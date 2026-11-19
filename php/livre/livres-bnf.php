<?php

// Auteur: Kevin MEYER - 09/11/2026

require_once "../Connexion.php" ;
require_once "bnf.php" ;

header( "Content-Type: text/xml; charset=utf-8" ) ;

// Notices de la BnF pour un auteur
$prenom = trim( $_GET["prenom"] ?? "" ) ;
$nom = trim( $_GET["nom"] ?? "" ) ;

// seulement pour une personne de la base, sinon n'importe qui pourrait
// faire interroger la BnF en boucle et faire bloquer le serveur
$cursor = Connexion::getInstance()->prepare( "select count(*) from " . Connexion::$tables["personne"]
                                           . " where trim( nom ) = :nom and trim( coalesce( prenom, '' ) ) = :prenom" ) ;
$cursor->execute( ["nom" => $nom, "prenom" => $prenom] ) ;

if( $cursor->fetchColumn() == 0 )
{
    http_response_code( 404 ) ;
    exit ;
}

$xml = $nom != "" ? xmlBnf( $prenom, $nom ) : false ;

if( $xml === false ) http_response_code( 502 ) ;
else echo $xml ;

?>
