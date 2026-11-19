<?php

// Fonctions partagées par les scripts qui renvoient des événements
// (programme.php, evenement-id.php).
// Toute la mise en forme (lieu, animateur, jour, heures...) est faite ici :
// le front n'a plus qu'à afficher.
//
// Jointures faites directement sur les tables (left join) : les événements sans lieu
// (expositions, stands...) sont gardés, et seules les colonnes présentes dans
// toutes les bases (locale et serveur) sont utilisées.

const JOURS_SEMAINE = [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ] ;
const MOIS_ANNEE = [ "janvier", "février", "mars", "avril", "mai", "juin", "juillet",
                     "août", "septembre", "octobre", "novembre", "décembre" ] ;

// Nom complet de l'animateur ("Prénom Nom")
const SQL_NOM_ANIMATEUR = "trim( concat( coalesce( pe.prenom, '' ), ' ', coalesce( pe.nom, '' ) ) )" ;

// Début de requête : événement + lieu + animateur.
// Dans la nouvelle base le type est dans la colonne type (typeevenement est vide).
function sqlEvenements() : string
{
    return "select ev.id, ev.type, ev.type as typeevenement, ev.titre, ev.stitre, ev.public, ev.commentaire,"
         . " ev.debut, ev.fin, ev.idAnimateur, ev.numLieu,"
         . " li.nom as nomLieu, li.type as typeLieu, li.hall,"
         . " pe.prenom as prenomAnimateur, pe.nom as nomAnimateur, pe.specialite as specialiteAnimateur,"
         . " " . SQL_NOM_ANIMATEUR . " as animateur"
         . " from " . Connexion::$tables["evenement"] . " as ev"
         . " left join " . Connexion::$tables["lieu"] . " as li on li.num = ev.numLieu"
         . " left join " . Connexion::$tables["personne"] . " as pe on pe.id = ev.idAnimateur"
         . " where 1 " ;
}

// Le festival se tient le samedi et le dimanche (dayofweek : 7 = samedi, 1 = dimanche).
// Les événements datés d'un autre jour (ex : le Off du vendredi) sont écartés,
// ceux sans date sont gardés.
function sqlPendantLeFestival() : string
{
    return " and ( ev.debut is null or dayofweek( ev.debut ) in ( 7, 1 ) ) " ;
}

// Recherche libre (accents et casse ignorés grâce à la collation de la base) :
// titre, sous-titre, descriptif (où sont cités les auteurs invités), type, lieu,
// animateur, titre et auteurs des livres présentés.
// Le paramètre :recherche doit être lié avec texteLike().
function sqlRecherche() : string
{
    return " and ( ev.titre like :recherche or ev.stitre like :recherche or ev.commentaire like :recherche"
         . " or ev.type like :recherche or li.nom like :recherche"
         . " or " . SQL_NOM_ANIMATEUR . " like :recherche"
         . " or exists ( select 1 from " . Connexion::$tables["presenter"] . " as pr"
         . "   inner join " . Connexion::$tables["livre"] . " as lv on lv.id = pr.idLivre"
         . "   left join " . Connexion::$tables["ecrire"] . " as ec on ec.idLivre = lv.id"
         . "   left join " . Connexion::$tables["personne"] . " as au on au.id = ec.idPersonne"
         . "   where pr.idEvenement = ev.id and ( lv.titre like :recherche"
         . "   or concat( coalesce( au.prenom, '' ), ' ', coalesce( au.nom, '' ) ) like :recherche ) ) ) " ;
}

// Événements d'une personne (paramètre :idPersonne) : elle anime, un de ses livres
// est présenté, ou elle est citée ("Prénom Nom") dans le titre ou le descriptif.
// Il n'y a pas de table de participation : les invités ne sont connus que par le texte.
function sqlPersonne() : string
{
    $personne = Connexion::$tables["personne"] ;
    $nomCite = "concat( '%', trim( pc.prenom ), ' ', trim( pc.nom ), '%' )" ;

    return " and ( ev.idAnimateur = :idPersonne"
         . " or exists ( select 1 from " . Connexion::$tables["presenter"] . " as pr"
         . "   inner join " . Connexion::$tables["ecrire"] . " as ec on ec.idLivre = pr.idLivre"
         . "   where pr.idEvenement = ev.id and ec.idPersonne = :idPersonne )"
         . " or exists ( select 1 from " . $personne . " as pc"
         . "   where pc.id = :idPersonne and trim( coalesce( pc.nom, '' ) ) <> ''"
         . "   and ( ev.titre like " . $nomCite . " or ev.stitre like " . $nomCite . " or ev.commentaire like " . $nomCite . " ) ) ) " ;
}

// Échappe % et _ pour un like
function texteLike( string $texte ) : string
{
    return "%" . addcslashes( trim( $texte ), "\\%_" ) . "%" ;
}

function lireDate( ?string $datetime ) : ?DateTime
{
    if( $datetime === null || $datetime === "" ) return null ;
    $date = DateTime::createFromFormat( "Y-m-d H:i:s", $datetime ) ;
    return $date === false ? null : $date ;
}

// "10h30"
function heure( DateTime $date ) : string
{
    return (int)$date->format( "G" ) . "h" . $date->format( "i" ) ;
}

// Ajoute les champs d'affichage à une ligne de la requête :
//   jourdebut ("2026-11-21"), heuredebut ("10:30") : mêmes champs que tous-les-evenements.php
//   nomJour ("Samedi"), dateJour ("21 novembre"),
//   touteLaJournee (début à 00:00 : stands, expositions...), heure ("10h30"),
//   heureFin (seulement si la fin tombe le même jour après le début)
function formaterEvenement( array $ligne ) : array
{
    $debut = lireDate( $ligne["debut"] ?? null ) ;
    $fin = lireDate( $ligne["fin"] ?? null ) ;

    $ligne["id"] = (int)$ligne["id"] ;
    $ligne["idAnimateur"] = ( $ligne["idAnimateur"] ?? null ) === null ? -1 : (int)$ligne["idAnimateur"] ;
    $ligne["numLieu"] = ( $ligne["numLieu"] ?? null ) === null ? -1 : (int)$ligne["numLieu"] ;
    $ligne["hall"] = ( $ligne["hall"] ?? null ) === null ? null : (int)$ligne["hall"] ;
    foreach( [ "type", "typeevenement", "titre", "stitre", "public", "commentaire", "nomLieu", "typeLieu",
               "prenomAnimateur", "nomAnimateur", "specialiteAnimateur", "animateur" ] as $champ )
    {
        $ligne[$champ] = trim( $ligne[$champ] ?? "" ) ;
    }

    $ligne["jourdebut"] = $debut ? $debut->format( "Y-m-d" ) : "" ;
    $ligne["heuredebut"] = $debut ? $debut->format( "H:i" ) : "" ;
    $ligne["nomJour"] = $debut ? JOURS_SEMAINE[ (int)$debut->format( "w" ) ] : "" ;
    $ligne["dateJour"] = $debut ? (int)$debut->format( "j" ) . " " . MOIS_ANNEE[ (int)$debut->format( "n" ) - 1 ] : "" ;
    $ligne["touteLaJournee"] = $debut !== null && $debut->format( "H:i" ) === "00:00" ;
    $ligne["heure"] = ( $debut && !$ligne["touteLaJournee"] ) ? heure( $debut ) : "" ;
    $ligne["heureFin"] = ( $debut && $fin && $fin > $debut && $fin->format( "Y-m-d" ) === $debut->format( "Y-m-d" ) )
                       ? heure( $fin ) : "" ;

    return $ligne ;
}

?>
