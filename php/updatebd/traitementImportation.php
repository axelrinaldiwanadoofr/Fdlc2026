<?php

require_once "../Connexion.php" ;
require_once "ImportStand.php" ;
require_once "ImportExposant.php" ;

$importStand = new ImportStand( Connexion::$tables["stand"]) ;
$importExposant = new ImportExposant( Connexion::$tables["exposant"]) ;

$importStand->ajouteDonnees() ;
$importExposant->ajouteDonnees() ;

$importExposant->modifieDonnees() ;
$importStand->modifieDonnees() ;

$importExposant->supprimeDonnees() ;
$importStand->supprimeDonnees() ;

?>