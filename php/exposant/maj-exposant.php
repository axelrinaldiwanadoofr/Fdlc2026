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

$exposant = $donnees["exposant"] ?? [] ;

if( trim( $exposant["nom"] ?? "" ) == "" )
{
    http_response_code( 400 ) ;
    echo json_encode( ["erreur" => "Le nom est obligatoire"], JSON_UNESCAPED_UNICODE ) ;
    exit ;
}

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;

    $table = Connexion::$tables["exposant"] ;
    $id = (int)( $exposant["id"] ?? -1 ) ;

    if( $id <= 0 )
    {
        // la colonne id n'est pas en auto_increment
        $id = (int)$bd->query( "select coalesce( max( id ), 0 ) + 1 from " . $table )->fetchColumn() ;
        $sql = "insert into " . $table . " ( id, nom, libelle, type, numLieu ) values ( :id, :nom, :libelle, :type, :numLieu )" ;
    }
    else
    {
        $sql = "update " . $table . " set nom = :nom, libelle = :libelle, type = :type, numLieu = :numLieu where id = :id" ;
    }

    // -1 = sans stand
    $numLieu = (int)( $exposant["numLieu"] ?? -1 ) ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->bindValue( ":nom", trim( $exposant["nom"] ) ) ;
    $cursor->bindValue( ":libelle", trim( $exposant["libelleExposant"] ?? "" ) ) ;
    $cursor->bindValue( ":type", trim( $exposant["type"] ?? "" ) ) ;
    $cursor->bindValue( ":numLieu", $numLieu > 0 ? $numLieu : null, $numLieu > 0 ? PDO::PARAM_INT : PDO::PARAM_NULL ) ;
    $cursor->execute() ;

    echo json_encode( ["id" => $id] ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
