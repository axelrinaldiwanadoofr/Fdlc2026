<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$compte = exigePermission( "livres.modifier" ) ;
$donnees = donneesPost() ;

$livre = $donnees["livre"] ?? [] ;
$idPersonnes = $donnees["idPersonnes"] ?? [] ;

if( trim( $livre["titre"] ?? "" ) == "" )
{
    http_response_code( 400 ) ;
    echo json_encode( ["erreur" => "Le titre est obligatoire"], JSON_UNESCAPED_UNICODE ) ;
    exit ;
}

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;
    $bd->beginTransaction() ;

    $table = Connexion::$tables["livre"] ;
    $tableEcrire = Connexion::$tables["ecrire"] ;
    $id = (int)( $livre["id"] ?? -1 ) ;

    if( $id <= 0 )
    {
        // la colonne id n'est pas en auto_increment
        $id = (int)$bd->query( "select coalesce( max( id ), 0 ) + 1 from " . $table )->fetchColumn() ;
        $sql = "insert into " . $table . " ( id, titre, resume, genre, idEditeur ) values ( :id, :titre, :resume, :genre, :idEditeur )" ;
    }
    else
    {
        $sql = "update " . $table . " set titre = :titre, resume = :resume, genre = :genre, idEditeur = :idEditeur where id = :id" ;
    }

    $idEditeur = (int)( $livre["idEditeur"] ?? -1 ) ;
    $resume = trim( $livre["resume"] ?? "" ) ;
    $genre = trim( $livre["genre"] ?? "" ) ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->bindValue( ":titre", trim( $livre["titre"] ) ) ;
    $cursor->bindValue( ":resume", $resume == "" ? null : $resume ) ;
    $cursor->bindValue( ":genre", $genre == "" ? null : $genre ) ;
    $cursor->bindValue( ":idEditeur", $idEditeur > 0 ? $idEditeur : null, $idEditeur > 0 ? PDO::PARAM_INT : PDO::PARAM_NULL ) ;
    $cursor->execute() ;

    // on remplace les auteurs par la nouvelle liste
    $bd->prepare( "delete from " . $tableEcrire . " where idLivre = :id" )->execute( ["id" => $id] ) ;

    $cursor = $bd->prepare( "insert into " . $tableEcrire . " ( idPersonne, idLivre ) values ( :idPersonne, :id )" ) ;
    foreach( array_unique( $idPersonnes ) as $idPersonne )
    {
        $cursor->execute( ["idPersonne" => (int)$idPersonne, "id" => $id] ) ;
    }

    $bd->commit() ;

    echo json_encode( ["id" => $id] ) ;
}
catch( Exception $erreur )
{
    if( isset( $bd ) && $bd->inTransaction() ) $bd->rollBack() ;
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
