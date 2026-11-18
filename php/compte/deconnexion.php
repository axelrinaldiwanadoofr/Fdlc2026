<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

$compte = compteConnecte() ;
if( $compte ) journal( "Déconnexion", "", $compte ) ;
fermeSession() ;

repond( ["ok" => true] ) ;

?>
