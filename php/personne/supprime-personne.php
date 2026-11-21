<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$compte = exigePermission( "personnes.supprimer" ) ;
$donnees = donneesPost() ;

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;

    $id = (int)( $donnees["id"] ?? 0 ) ;
    verifieHierarchiePersonne( $compte, $id ) ;

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

    foreach( ["ecrire" => "idPersonne", "exposer" => "idPersonne", "invite" => "idpersonne", "compte" => "idPersonne", "personne" => "id"] as $table => $champ )
    {
        // la table invite n'existe pas dans toutes les bases
        if( tableExiste( $table ) ) $bd->prepare( "delete from " . Connexion::$tables[$table] . " where " . $champ . " = :id" )->execute( ["id" => $id] ) ;
    }

    $bd->commit() ;

    journal( "Personne supprimée", "id " . $id ) ;

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
