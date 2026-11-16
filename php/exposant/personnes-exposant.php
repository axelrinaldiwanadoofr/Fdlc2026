<?php

// Auteur: Kevin MEYER - 12/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Personnes présentes sur le stand d'un exposant avec leurs créneaux
// (tous les exposants qui partagent le même stand)
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select idPersonne, trim( prenom ) as prenom, trim( nom ) as nom,"
         . " max( samedi_am ) as samedi_am, max( samedi_pm ) as samedi_pm, max( dimanche_am ) as dimanche_am, max( dimanche_pm ) as dimanche_pm"
         . " from " . Connexion::$tables["PersonneExposantExposer"]
         . " where idExposant in ( select x.id from " . Connexion::$tables["exposant"] . " x join " . Connexion::$tables["exposant"] . " moi"
         . " on moi.numLieu = x.numLieu where moi.id = :id )"
         . " group by idPersonne, prenom, nom order by nom, prenom" ;

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
