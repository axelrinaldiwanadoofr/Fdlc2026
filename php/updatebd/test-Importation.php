<?php

require_once "../Connexion.php" ;
require_once "ImportStand.php" ;
require_once "ImportExposant.php" ;
require_once "ImportAuteur.php" ;
require_once "ImportExposer.php" ;

$importStand = new ImportStand( Connexion::$tables["stand"]) ;
$importExposant = new ImportExposant( Connexion::$tables["exposant"]) ;
$importAuteur = new ImportAuteur( Connexion::$tables["auteur"]) ;
$importExposer = new ImportExposer( Connexion::$tables["exposer"]) ;

// 86 Françoise Gardeur exposant: 61 ALL Bourgogne Franche-Comté -> 53 Association des Éditeurs belges302 -> 304
$importExposant->executeSql( "update " . Connexion::$tables["exposer"] . " set idExposant = 53 where idAuteur=86 and idExposant=61 ;" ) ;

// 62  De Riemaecker creaneau: samedi_am 0 -> 1
$importExposant->executeSql( "update " . Connexion::$tables["exposer"] . " set samedi_am = 1 where idAuteur = 62 ;" ) ;

// Auxilivre stand 302 -> 304
$importExposant->executeSql( "update " . Connexion::$tables["exposant"] . " set numStand = 304 where nom = 'Auxilivre' ;" ) ;

// Ajoute un stand dans la table stand
$importStand->executeSql( "insert into " . Connexion::$tables["stand"] . "(num) values( 606 )" ) ;


$importExposer->supprimeDonnees() ;
$importExposant->supprimeDonnees() ;
$importAuteur->supprimeDonnees() ;
$importStand->supprimeDonnees() ;

$importAuteur->modifieDonnees() ;
$importExposant->modifieDonnees() ;
$importStand->modifieDonnees() ;

$importStand->ajouteDonnees() ;
$importExposant->ajouteDonnees() ;
$importAuteur->ajouteDonnees() ;
$importExposer->ajouteDonnees() ;


$importExposant->executeSql( "select * from " . Connexion::$tables["exposant"] . " where nom = 'Auxilivre' ;" ) ;


$importExposant->executeSql( "select * from " . Connexion::$tables["stand"] . " where num = 606 ;" ) ;

$importExposant->executeSql( "select * from " . Connexion::$tables["AuteurExposantExposer"] . " where idAuteur = 86 ;" ) ;

$importExposant->executeSql( "select * from " . Connexion::$tables["AuteurExposantExposer"] . " where idAuteur = 62 ;" ) ;

?>