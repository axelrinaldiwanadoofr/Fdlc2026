<?php

require_once "bnf.php" ;

header( "Content-Type: text/xml; charset=utf-8" ) ;

// Notices de la BnF pour un auteur
$prenom = trim( $_GET["prenom"] ?? "" ) ;
$nom = trim( $_GET["nom"] ?? "" ) ;

$xml = $nom != "" ? xmlBnf( $prenom, $nom ) : false ;

if( $xml === false ) http_response_code( 502 ) ;
else echo $xml ;

?>
