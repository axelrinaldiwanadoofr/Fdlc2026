<?php
require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

require_once "../Connexion.php" ;
require_once "evenement-commun.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Programme du festival (samedi et dimanche), déjà regroupé pour l'affichage
// par le web component app-liste-evenements :
// {
//   jours:      [ { cle, nomJour, date, total,
//                   creneaux: [ { heure, evenements: [ev...] } ] } ],  // à horaire, triés par heure
//   permanents: [ { cle, nomJour, date, evenements: [ev...] } ],   // toute la journée (stands, expositions...), par jour
//   sansDate:   [ev...],                                           // pas encore programmés
//   total
// }
// Tous les jours du festival sont toujours renvoyés (même vides) : les onglets restent stables.
//
// Paramètres GET optionnels (cumulés avec AND, voir sqlCriteres) :
//   recherche, theme, numLieu, idAnimateur,
//   idPersonne : personne liée (anime, livre présenté, invitée) -> filtre « Auteur »
//   idLivre    : livre lié (présenté ou écrit par un invité)    -> filtre « Livre »
try
{
    $bd = Connexion::getInstance() ;

    // ---------- Jours du festival (même sans événement pour ces filtres) ----------

    $jours = [] ;
    $permanents = [] ;
    $dates = $bd->query( "select distinct jourdebut from " . vue( "EvenementProgramme" )
                       . " where pendantFestival and jourdebut is not null order by jourdebut" )->fetchAll( PDO::FETCH_COLUMN ) ;
    foreach( $dates as $d )
    {
        $jour = formaterEvenement( [ "id" => 0, "debut" => $d . " 00:00:00" ] ) ;
        $jours[$d] = [ "cle" => $d, "nomJour" => $jour["nomJour"], "date" => $jour["dateJour"], "total" => 0, "creneaux" => [] ] ;
        $permanents[$d] = [ "cle" => $d, "nomJour" => $jour["nomJour"], "date" => $jour["dateJour"], "evenements" => [] ] ;
    }

    // ---------- Événements filtrés ----------

    $criteres = sqlCriteres( lireCriteres() ) ;
    $cursor = $bd->prepare( "select * from " . vue( "EvenementProgramme" ) . " as ev where ev.pendantFestival "
                          . $criteres["sql"] . " order by ev.debut, ev.titre" ) ;
    $cursor->execute( $criteres["valeurs"] ) ;

    $sansDate = [] ;
    $total = 0 ;

    foreach( $cursor->fetchAll( PDO::FETCH_ASSOC ) as $ligne )
    {
        $ev = formaterEvenement( $ligne ) ;
        $cle = $ev["jourdebut"] ;
        $total++ ;

        if( $cle === "" || !isset( $jours[$cle] ) )
        {
            $sansDate[] = $ev ;
        }
        else if( $ev["touteLaJournee"] )
        {
            $permanents[$cle]["evenements"][] = $ev ;
        }
        else
        {
            // Tri par début : les événements de même heure se suivent
            $jours[$cle]["total"]++ ;
            $creneaux = &$jours[$cle]["creneaux"] ;
            $dernier = count( $creneaux ) - 1 ;
            if( $dernier >= 0 && $creneaux[$dernier]["heure"] === $ev["heure"] ) $creneaux[$dernier]["evenements"][] = $ev ;
            else $creneaux[] = [ "heure" => $ev["heure"], "evenements" => [ $ev ] ] ;
            unset( $creneaux ) ;
        }
    }

    echo json_encode( [
        "jours" => array_values( $jours ),
        "permanents" => array_values( $permanents ),
        "sansDate" => $sansDate,
        "total" => $total,
    ], JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
