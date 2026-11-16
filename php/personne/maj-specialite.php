<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../config/mot-de-passe.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Ajoute ou supprime un rôle (table specialite)
$donnees = json_decode( file_get_contents( "php://input" ), true ) ;

if( !motDePasseOk( $donnees["mdp"] ?? "" ) )
{
    http_response_code( 403 ) ;
    echo json_encode( ["erreur" => "Mot de passe incorrect"] ) ;
    exit ;
}

$specialite = mb_strtolower( trim( $donnees["specialite"] ?? "" ) ) ;

if( $specialite == "" || mb_strlen( $specialite ) > 20 )
{
    http_response_code( 400 ) ;
    echo json_encode( ["erreur" => "Le rôle doit faire entre 1 et 20 caractères"], JSON_UNESCAPED_UNICODE ) ;
    exit ;
}

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;

    $table = Connexion::$tables["specialite"] ;

    if( !empty( $donnees["supprimer"] ) )
    {
        $cursor = $bd->prepare( "select count(*) from " . Connexion::$tables["personne"] . " where specialite = :specialite" ) ;
        $cursor->execute( ["specialite" => $specialite] ) ;

        if( $cursor->fetchColumn() > 0 )
        {
            http_response_code( 400 ) ;
            echo json_encode( ["erreur" => "Ce rôle est encore donné à des personnes"], JSON_UNESCAPED_UNICODE ) ;
            exit ;
        }

        $bd->prepare( "delete from " . $table . " where specialite = :specialite" )->execute( ["specialite" => $specialite] ) ;
    }
    else
    {
        $bd->prepare( "insert ignore into " . $table . " ( specialite ) values ( :specialite )" )->execute( ["specialite" => $specialite] ) ;
    }

    echo json_encode( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
