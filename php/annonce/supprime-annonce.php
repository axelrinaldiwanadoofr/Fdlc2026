<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$compte = exigePermission( "annonces.modifier" ) ;
$donnees = donneesPost() ;

try
{
    $bd = Connexion::getInstance() ;
    $cursor = $bd->prepare( "delete from " . Connexion::$tables["annonce"] . " where id = :id" ) ;
    $cursor->execute( ["id" => (int)( $donnees["id"] ?? 0 )] ) ;

    echo json_encode( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
