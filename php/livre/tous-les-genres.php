<?php

// Auteur: Kevin MEYER - 16/11/2026

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
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
