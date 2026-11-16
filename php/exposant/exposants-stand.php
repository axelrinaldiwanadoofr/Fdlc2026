<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Les autres exposants qui partagent le stand d'un exposant
try
{
    $bd = Connexion::getInstance() ;

    $table = Connexion::$tables["exposant"] ;

    $sql = "select x.id, trim( x.nom ) as nom, x.numLieu from " . $table . " x"
         . " join " . $table . " moi on moi.numLieu = x.numLieu"
         . " where moi.id = :id and x.id <> moi.id order by trim( x.nom )" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":id", (int)( $_GET["id"] ?? -1 ), PDO::PARAM_INT ) ;
    $cursor->execute() ;

    echo json_encode( $cursor->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
