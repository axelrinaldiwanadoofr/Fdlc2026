<?php

require_once "../Connexion.php" ;
require_once "ImportStand.php" ;
require_once "ImportExposant.php" ;

$importStand = new ImportStand( "stand") ;
$importExposant = new ImportExposant( "exposant" ) ;

// Test erreur sur une requete SQL
$importStand->executeSql( "select count(*) from stind" ) ;

// Vide la table stand
$importStand->executeSql( "delete from stand" ) ;

$importStand->importeDonnees() ;

// Ajoute un stand dans la table stand
$importStand->executeSql( "insert into stand(num) values( 606 )" ) ;

$data = $importStand->executeSql( "select count(*) from stand" ) ;

$importStand->importeDonnees() ;

$data = $importStand->executeSql( "select count(*) from stand" ) ;

$importExposant->importeDonnees() ;

$data = $importStand->executeSql( "select count(*) from exposant" ) ;
$data = $importStand->executeSql( "select distinct `COL 3` from import" ) ;



?>