<?php

require_once "../Connexion.php" ;
require_once "ImportStand.php" ;

$importStand = new ImportStand( "stand ") ;

// Test erreur sur une requete SQL
$importStand->executeSql( "select count(*) from stind" ) ;

// Vide la table stand
$importStand->executeSql( "delete from stand" ) ;

$importStand->importeDonnees() ;

// Ajoute un stand dans la table stand
$importStand->executeSql( "insert into stand(num) values( 606 )" ) ;

$data = $importStand->executeSql( "select count(*) from stand" ) ;

$importStand->pushAfficheErreurDb( true ) ;
$importStand->importeDonnees() ;
$importStand->restoreAfficheErreurDb() ;

$data = $importStand->executeSql( "select count(*) from stand" ) ;

?>