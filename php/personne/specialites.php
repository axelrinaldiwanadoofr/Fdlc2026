<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

require_once "../Connexion.php" ;
require_once "staff.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

try
{
    $bd = Connexion::getInstance() ;

    $cursor = $bd->query( "select specialite from " . Connexion::$tables["specialite"] . " order by specialite" ) ;
    $specialites = $cursor->fetchAll( PDO::FETCH_COLUMN ) ;

    // ?staff=1 : seulement les spécialités qui ont l'étiquette STAFF
    if( isset( $_GET["staff"] ) ) $specialites = array_values( array_intersect( $specialites, specialitesStaff() ) ) ;

    echo json_encode( $specialites, JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
