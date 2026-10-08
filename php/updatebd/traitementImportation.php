<?php

require_once "../Connexion.php" ;
require_once "ImportStand.php" ;
require_once "ImportExposant.php" ;

$importStand = new ImportStand( Connexion::$tables["stand"]) ;
$importExposant = new ImportExposant( Connexion::$tables["exposant"] ) ;

$importStand->importeDonnees() ;

$importExposant->importeDonnees() ;

$importStand->executeSql( "select count(*) from " . Connexion::$tables["stand"] ) ;
$data = $importStand->executeSql( "select count(*) from " . Connexion::$tables["exposant"] ) ;
//$data = $importStand->executeSql( "select distinct `COL 3` from " . Connexion::$tables["import"] ) ;

?>