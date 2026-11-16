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

    $id = (int)( $donnees["id"] ?? 0 ) ;

    // la suppression de l'animateur supprimerait aussi ses événements (cascade)
    $cursor = $bd->prepare( "select count(*) from " . Connexion::$tables["evenement"] . " where idAnimateur = :id" ) ;
    $cursor->execute( ["id" => $id] ) ;

    if( $cursor->fetchColumn() > 0 )
    {
        http_response_code( 400 ) ;
        echo json_encode( ["erreur" => "Cette personne anime des événements, changez d'abord l'animateur"], JSON_UNESCAPED_UNICODE ) ;
        exit ;
    }

    $bd->beginTransaction() ;

    foreach( ["ecrire" => "idPersonne", "exposer" => "idPersonne", "invite" => "idpersonne", "personne" => "id"] as $table => $champ )
    {
        $bd->prepare( "delete from " . Connexion::$tables[$table] . " where " . $champ . " = :id" )->execute( ["id" => $id] ) ;
    }

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
