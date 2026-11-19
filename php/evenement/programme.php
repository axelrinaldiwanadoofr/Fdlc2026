<?php

require_once "../Connexion.php" ;
require_once "evenement-commun.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Programme du festival (samedi et dimanche), déjà regroupé pour l'affichage
// par le web component app-liste-evenements :
// {
//   permanents: [ { cle, nomJour, date, evenements: [ev...] } ],   // toute la journée (stands, expositions...), par jour
//   jours:      [ { cle, nomJour, date, total,
//                   creneaux: [ { heure, evenements: [ev...] } ] } ],  // à horaire, triés par heure
//   sansDate:   [ev...],                                           // pas encore programmés
//   total
// }
// Tous les jours du festival sont toujours renvoyés (même vides) : les onglets restent stables.
//
// Paramètres GET optionnels (cumulés avec AND) :
//   recherche   : auteur, titre, mot du descriptif, lieu, animateur, livre...
//   theme       : type d'événement exact
//   numLieu     : numéro du lieu
//   idAnimateur : id de la personne qui anime
//   idPersonne  : événements d'une personne (anime, livre présenté ou citée dans le texte)
try
{
    $bd = Connexion::getInstance() ;

    $recherche = trim( $_GET["recherche"] ?? "" ) ;
    $theme = trim( $_GET["theme"] ?? "" ) ;
    $numLieu = filter_input( INPUT_GET, "numLieu", FILTER_VALIDATE_INT ) ;
    $idAnimateur = filter_input( INPUT_GET, "idAnimateur", FILTER_VALIDATE_INT ) ;
    $idPersonne = filter_input( INPUT_GET, "idPersonne", FILTER_VALIDATE_INT ) ;

    // ---------- Jours du festival (même sans événement pour ces filtres) ----------

    $permanents = [] ;
    $jours = [] ;
    $dates = $bd->query( "select distinct date( ev.debut ) as d from " . Connexion::$tables["evenement"] . " as ev"
                       . " where ev.debut is not null " . sqlPendantLeFestival() . " order by d" )->fetchAll( PDO::FETCH_COLUMN ) ;
    foreach( $dates as $d )
    {
        $jour = formaterEvenement( [ "id" => 0, "debut" => $d . " 00:00:00" ] ) ;
        $permanents[$d] = [ "cle" => $d, "nomJour" => $jour["nomJour"], "date" => $jour["dateJour"], "evenements" => [] ] ;
        $jours[$d] = [ "cle" => $d, "nomJour" => $jour["nomJour"], "date" => $jour["dateJour"], "total" => 0, "creneaux" => [] ] ;
    }

    // ---------- Événements filtrés ----------

    $sql = sqlEvenements() . sqlPendantLeFestival() ;
    if( $recherche !== "" ) $sql .= sqlRecherche() ;
    if( $theme !== "" ) $sql .= " and ev.type = :theme " ;
    if( $numLieu ) $sql .= " and ev.numLieu = :numLieu " ;
    if( $idAnimateur ) $sql .= " and ev.idAnimateur = :idAnimateur " ;
    if( $idPersonne ) $sql .= sqlPersonne() ;
    $sql .= " order by ev.debut, ev.titre" ;

    $cursor = $bd->prepare( $sql ) ;
    if( $recherche !== "" ) $cursor->bindValue( ":recherche", texteLike( $recherche ), PDO::PARAM_STR ) ;
    if( $theme !== "" ) $cursor->bindValue( ":theme", $theme, PDO::PARAM_STR ) ;
    if( $numLieu ) $cursor->bindValue( ":numLieu", $numLieu, PDO::PARAM_INT ) ;
    if( $idAnimateur ) $cursor->bindValue( ":idAnimateur", $idAnimateur, PDO::PARAM_INT ) ;
    if( $idPersonne ) $cursor->bindValue( ":idPersonne", $idPersonne, PDO::PARAM_INT ) ;
    $cursor->execute() ;

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
        "permanents" => array_values( $permanents ),
        "jours" => array_values( $jours ),
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
