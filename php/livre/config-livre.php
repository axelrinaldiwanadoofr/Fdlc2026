<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Un livre avec son résumé et les id de ses auteurs
try
{
    $bd = Connexion::getInstance() ;
    $id = (int)( $_GET["id"] ?? -1 ) ;

    $cursor = $bd->prepare( "select id, titre, resume, genre, idEditeur from " . Connexion::$tables["livre"] . " where id = :id" ) ;
    $cursor->execute( ["id" => $id] ) ;
    $livre = $cursor->fetch( PDO::FETCH_ASSOC ) ;

    $cursor = $bd->prepare( "select idPersonne from " . Connexion::$tables["ecrire"] . " where idLivre = :id" ) ;
    $cursor->execute( ["id" => $id] ) ;

    echo json_encode( ["livre" => $livre, "idPersonnes" => array_map( "intval", $cursor->fetchAll( PDO::FETCH_COLUMN ) )], JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
