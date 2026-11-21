<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

try
{
    $bd = Connexion::getInstance() ;
    $cursor = $bd->query( "select genre from " . Connexion::$tables["genre"] . " order by genre" ) ;
    echo json_encode( $cursor->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
