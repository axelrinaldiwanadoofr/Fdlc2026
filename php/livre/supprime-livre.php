<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$compte = exigePermission( "livres.supprimer" ) ;
$donnees = donneesPost() ;

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;
    $bd->beginTransaction() ;

    $id = (int)( $donnees["id"] ?? 0 ) ;

    // ecrire n'est pas en cascade, presenter oui
    $bd->prepare( "delete from " . Connexion::$tables["ecrire"] . " where idLivre = :id" )->execute( ["id" => $id] ) ;
    $bd->prepare( "delete from " . Connexion::$tables["livre"] . " where id = :id" )->execute( ["id" => $id] ) ;

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
