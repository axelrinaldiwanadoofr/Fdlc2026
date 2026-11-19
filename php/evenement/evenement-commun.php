<?php

// Fonctions partagées par les scripts du programme des événements
// (programme.php, filtres-evenements.php, evenement-id.php).
//
// Les jointures sont dans les vues MySQL (src/sql/EvenementProgramme.sql) :
//   EvenementProgramme : événement + lieu + animateur + jour / heure / toute la journée
//   EvenementPersonne  : personnes liées à un événement (animateur, livre présenté, invité)
//   EvenementLivre     : livres liés à un événement (présenté, livre d'un invité)
// Ici on ne fait que des requêtes courtes sur ces vues et la mise en forme pour l'affichage.

const JOURS_SEMAINE = [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ] ;
const MOIS_ANNEE = [ "janvier", "février", "mars", "avril", "mai", "juin", "juillet",
                     "août", "septembre", "octobre", "novembre", "décembre" ] ;

function vue( string $nom ) : string
{
    return Connexion::$tables[$nom] ;
}

// Critères de filtre communs, lus dans $_GET ("" / null = pas de filtre)
function lireCriteres() : array
{
    return [
        "recherche"   => trim( $_GET["recherche"] ?? "" ),
        "theme"       => trim( $_GET["theme"] ?? "" ),
        "numLieu"     => filter_input( INPUT_GET, "numLieu", FILTER_VALIDATE_INT ) ?: null,
        "idAnimateur" => filter_input( INPUT_GET, "idAnimateur", FILTER_VALIDATE_INT ) ?: null,
        "idPersonne"  => filter_input( INPUT_GET, "idPersonne", FILTER_VALIDATE_INT ) ?: null,
        "idLivre"     => filter_input( INPUT_GET, "idLivre", FILTER_VALIDATE_INT ) ?: null,
    ] ;
}

// Conditions SQL sur la vue EvenementProgramme (alias ev) et valeurs à lier
// pour les critères renseignés. Renvoie [ "sql" => " and ...", "valeurs" => [...] ].
function sqlCriteres( array $criteres ) : array
{
    $sql = "" ;
    $valeurs = [] ;

    if( $criteres["recherche"] !== "" )
    {
        // Accents et casse ignorés grâce à la collation de la base
        $sql .= " and ( ev.titre like :recherche or ev.stitre like :recherche or ev.commentaire like :recherche"
              . " or ev.type like :recherche or ev.nomLieu like :recherche or ev.animateur like :recherche"
              . " or exists ( select 1 from " . vue( "EvenementPersonne" ) . " as ep where ep.idEvenement = ev.id"
              . "   and concat( coalesce( ep.prenom, '' ), ' ', coalesce( ep.nom, '' ) ) like :recherche )"
              . " or exists ( select 1 from " . vue( "EvenementLivre" ) . " as el where el.idEvenement = ev.id"
              . "   and el.titre like :recherche ) ) " ;
        $valeurs["recherche"] = "%" . addcslashes( $criteres["recherche"], "\\%_" ) . "%" ;
    }
    if( $criteres["theme"] !== "" )
    {
        $sql .= " and ev.type = :theme " ;
        $valeurs["theme"] = $criteres["theme"] ;
    }
    if( $criteres["numLieu"] )
    {
        $sql .= " and ev.numLieu = :numLieu " ;
        $valeurs["numLieu"] = $criteres["numLieu"] ;
    }
    if( $criteres["idAnimateur"] )
    {
        $sql .= " and ev.idAnimateur = :idAnimateur " ;
        $valeurs["idAnimateur"] = $criteres["idAnimateur"] ;
    }
    if( $criteres["idPersonne"] )
    {
        $sql .= " and exists ( select 1 from " . vue( "EvenementPersonne" ) . " as ep"
              . " where ep.idEvenement = ev.id and ep.idPersonne = :idPersonne ) " ;
        $valeurs["idPersonne"] = $criteres["idPersonne"] ;
    }
    if( $criteres["idLivre"] )
    {
        $sql .= " and exists ( select 1 from " . vue( "EvenementLivre" ) . " as el"
              . " where el.idEvenement = ev.id and el.idLivre = :idLivre ) " ;
        $valeurs["idLivre"] = $criteres["idLivre"] ;
    }

    return [ "sql" => $sql, "valeurs" => $valeurs ] ;
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

// Mise en forme d'une ligne de la vue EvenementProgramme pour l'affichage :
// types (nombres, booléens), typeevenement (compatibilité avec le modèle Evenement),
// nomJour ("Samedi"), dateJour ("21 novembre"), heure ("10h30", "" si toute la journée),
// heureFin (seulement si la fin tombe le même jour après le début)
function formaterEvenement( array $ligne ) : array
{
    $debut = lireDate( $ligne["debut"] ?? null ) ;
    $fin = lireDate( $ligne["fin"] ?? null ) ;

    $ligne["id"] = (int)$ligne["id"] ;
    $ligne["idAnimateur"] = ( $ligne["idAnimateur"] ?? null ) === null ? -1 : (int)$ligne["idAnimateur"] ;
    $ligne["numLieu"] = ( $ligne["numLieu"] ?? null ) === null ? -1 : (int)$ligne["numLieu"] ;
    $ligne["hall"] = ( $ligne["hall"] ?? null ) === null ? null : (int)$ligne["hall"] ;
    foreach( [ "type", "titre", "stitre", "public", "commentaire", "nomLieu", "typeLieu",
               "prenomAnimateur", "nomAnimateur", "specialiteAnimateur", "animateur", "jourdebut", "heuredebut" ] as $champ )
    {
        $ligne[$champ] = trim( $ligne[$champ] ?? "" ) ;
    }
    $ligne["typeevenement"] = $ligne["type"] ;
    $ligne["touteLaJournee"] = (bool)( $ligne["touteLaJournee"] ?? false ) ;
    unset( $ligne["pendantFestival"] ) ;

    $ligne["nomJour"] = $debut ? JOURS_SEMAINE[ (int)$debut->format( "w" ) ] : "" ;
    $ligne["dateJour"] = $debut ? (int)$debut->format( "j" ) . " " . MOIS_ANNEE[ (int)$debut->format( "n" ) - 1 ] : "" ;
    $ligne["heure"] = ( $debut && !$ligne["touteLaJournee"] ) ? heure( $debut ) : "" ;
    $ligne["heureFin"] = ( $debut && $fin && $fin > $debut && $fin->format( "Y-m-d" ) === $debut->format( "Y-m-d" ) )
                       ? heure( $fin ) : "" ;

    return $ligne ;
}

?>
