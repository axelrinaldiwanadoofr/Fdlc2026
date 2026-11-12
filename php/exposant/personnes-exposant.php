<?php

// Auteur: Kevin MEYER - 12/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Personnes présentes sur le stand d'un exposant avec leurs créneaux
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select idPersonne, trim( prenom ) as prenom, trim( nom ) as nom, samedi_am, samedi_pm, dimanche_am, dimanche_pm from "
         . Connexion::$tables["PersonneExposantExposer"] . " where idExposant = :id order by nom, prenom" ;

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
