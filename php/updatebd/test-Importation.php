<?php

require_once "../Connexion.php" ;
require_once "ImportStand.php" ;
require_once "ImportExposant.php" ;

$importStand = new ImportStand( Connexion::$tables["stand"]) ;
$importExposant = new ImportExposant( Connexion::$tables["exposant"] ) ;

// Test erreur sur une requete SQL
$importStand->executeSql( "select count(*) from " . Connexion::$tables["stand"] ) ;

// Vide la table stand
$importStand->executeSql( "delete from " . Connexion::$tables["stand"] ) ;

$importStand->importeDonnees() ;

// Ajoute un stand dans la table stand
$importStand->executeSql( "insert into " . Connexion::$tables["stand"] . "(num) values( 606 )" ) ;

$data = $importStand->executeSql( "select count(*) from " . Connexion::$tables["stand"] ) ;

$importStand->importeDonnees() ;

$data = $importStand->executeSql( "select count(*) from " . Connexion::$tables["stand"] ) ;

$importExposant->importeDonnees() ;

$data = $importStand->executeSql( "select count(*) from " . Connexion::$tables["exposant"] ) ;
$data = $importStand->executeSql( "select distinct `COL 3` from " . Connexion::$tables["import"] ) ;



?>