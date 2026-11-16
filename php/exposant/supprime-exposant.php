<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../config/mot-de-passe.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Supprime un exposant, ou le fusionne dans un autre si idGarde est donné :
// ses personnes et ses livres passent sur l'exposant gardé
$donnees = json_decode( file_get_contents( "php://input" ), true ) ;

if( !motDePasseOk( $donnees["mdp"] ?? "" ) )
{
    http_response_code( 403 ) ;
    echo json_encode( ["erreur" => "Mot de passe incorrect"] ) ;
    exit ;
}

$id = (int)( $donnees["id"] ?? 0 ) ;
$idGarde = (int)( $donnees["idGarde"] ?? 0 ) ;

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;

    $tableExposer = Connexion::$tables["exposer"] ;
    $tableLivre = Connexion::$tables["livre"] ;

    if( $idGarde <= 0 )
    {
        $cursor = $bd->prepare( "select count(*) from " . $tableLivre . " where idEditeur = :id" ) ;
        $cursor->execute( ["id" => $id] ) ;

        if( $cursor->fetchColumn() > 0 )
        {
            http_response_code( 400 ) ;
            echo json_encode( ["erreur" => "Cet exposant édite des livres, fusionnez-le plutôt avec un autre"], JSON_UNESCAPED_UNICODE ) ;
            exit ;
        }
    }

    $bd->beginTransaction() ;

    if( $idGarde > 0 )
    {
        // une personne déjà sur l'exposant gardé garde ses créneaux
        $bd->prepare( "insert ignore into " . $tableExposer . " ( idExposant, idPersonne, samedi_am, samedi_pm, dimanche_am, dimanche_pm )"
                    . " select :idGarde, idPersonne, samedi_am, samedi_pm, dimanche_am, dimanche_pm from " . $tableExposer . " where idExposant = :id" )
           ->execute( ["idGarde" => $idGarde, "id" => $id] ) ;

        $bd->prepare( "update " . $tableLivre . " set idEditeur = :idGarde where idEditeur = :id" )
           ->execute( ["idGarde" => $idGarde, "id" => $id] ) ;
    }

    $bd->prepare( "delete from " . $tableExposer . " where idExposant = :id" )->execute( ["id" => $id] ) ;
    $bd->prepare( "delete from " . Connexion::$tables["exposant"] . " where id = :id" )->execute( ["id" => $id] ) ;

    $bd->commit() ;

    echo json_encode( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    if( isset( $bd ) && $bd->inTransaction() ) $bd->rollBack() ;
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
