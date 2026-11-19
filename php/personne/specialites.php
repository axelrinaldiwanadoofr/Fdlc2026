<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "staff.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

try
{
    $bd = Connexion::getInstance() ;

    // ?staff=1 : seulement les spécialités qui ont l'étiquette STAFF
    $where = "" ;
    if( isset( $_GET["staff"] ) )
    {
        colonneStaff( $bd ) ;
        $where = " where staff = 1" ;
    }

    $cursor = $bd->query( "select specialite from " . Connexion::$tables["specialite"] . $where . " order by specialite" ) ;
    echo json_encode( $cursor->fetchAll( PDO::FETCH_COLUMN ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
