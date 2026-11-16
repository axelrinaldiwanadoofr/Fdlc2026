<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Types de la table typeexposant et ceux déjà utilisés par les exposants
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select type from " . Connexion::$tables["typeexposant"]
         . " union select distinct type from " . Connexion::$tables["exposant"] . " where type is not null and type <> ''"
         . " order by type" ;

    echo json_encode( $bd->query( $sql )->fetchAll( PDO::FETCH_COLUMN ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
