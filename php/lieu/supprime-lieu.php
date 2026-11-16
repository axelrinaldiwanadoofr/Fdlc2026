<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../config/mot-de-passe.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$donnees = json_decode( file_get_contents( "php://input" ), true ) ;

if( !motDePasseOk( $donnees["mdp"] ?? "" ) )
{
    http_response_code( 403 ) ;
    echo json_encode( ["erreur" => "Mot de passe incorrect"] ) ;
    exit ;
}

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;

    $num = (int)( $donnees["num"] ?? 0 ) ;

    // on ne supprime pas un lieu encore utilise par un exposant ou un evenement
    $sql = "select ( select count(*) from " . Connexion::$tables["exposant"] . " where numLieu = :num1 )"
         . " + ( select count(*) from " . Connexion::$tables["evenement"] . " where numLieu = :num2 )" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":num1", $num, PDO::PARAM_INT ) ;
    $cursor->bindValue( ":num2", $num, PDO::PARAM_INT ) ;
    $cursor->execute() ;

    if( $cursor->fetchColumn() > 0 )
    {
        http_response_code( 400 ) ;
        echo json_encode( ["erreur" => "Ce lieu est utilisé par des exposants ou des événements"], JSON_UNESCAPED_UNICODE ) ;
        exit ;
    }

    $cursor = $bd->prepare( "delete from " . Connexion::$tables["lieu"] . " where num = :num" ) ;
    $cursor->bindValue( ":num", $num, PDO::PARAM_INT ) ;
    $cursor->execute() ;

    echo json_encode( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
