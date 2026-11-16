<?php

// Auteur: Kevin MEYER - 04/11/2026

header( "Content-Type: application/json; charset=utf-8" ) ;

require_once "mot-de-passe.php" ;

// le mot de passe est envoye en POST pour ne pas apparaitre dans l'url
$donnees = json_decode( file_get_contents( "php://input" ), true ) ;

$ok = motDePasseOk( $donnees["mdp"] ?? "", true ) ;
if( $ok ) ouvreSessionConfig() ;

// bloque = trop d'essais, l'appli affiche un message
// parDefaut : l'appli demande de changer le mot de passe tout de suite
echo json_encode( [ "ok" => $ok, "bloque" => !$ok && estBloque(), "parDefaut" => $ok && motDePasseParDefaut() ] ) ;

?>
