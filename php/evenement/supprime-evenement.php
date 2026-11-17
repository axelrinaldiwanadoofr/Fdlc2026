<?php

// Auteur: Kevin MEYER - 05/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$compte = exigePermission( "evenements.modifier" ) ;
$donnees = donneesPost() ;

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;
    $bd->beginTransaction() ;

    $id = (int)( $donnees["id"] ?? 0 ) ;

    // d'abord les livres presentes, puis l'evenement
    $cursor = $bd->prepare( "delete from " . Connexion::$tables["presenter"] . " where idEvenement = :id" ) ;
    $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->execute() ;

    $cursor = $bd->prepare( "delete from " . Connexion::$tables["evenement"] . " where id = :id" ) ;
    $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->execute() ;

    $bd->commit() ;

    echo json_encode( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    if( isset( $bd ) && $bd->inTransaction() ) $bd->rollBack() ;
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
