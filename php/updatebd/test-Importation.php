<?php

require_once "../Connexion.php" ;
require_once "ImportLieu.php" ;
require_once "ImportExposant.php" ;
require_once "ImportPersonne.php" ;
require_once "ImportExposer.php" ;

$importStand = new ImportLieu( Connexion::$tables["lieu"]) ;
$importExposant = new ImportExposant( Connexion::$tables["exposant"]) ;
$importAuteur = new ImportPersonne( Connexion::$tables["personne"]) ;
$importExposer = new ImportExposer( Connexion::$tables["exposer"]) ;

// 86 Françoise Gardeur exposant: 61 ALL Bourgogne Franche-Comté -> 53 Association des Éditeurs belges 
$importExposant->executeSql( "update " . Connexion::$tables["exposer"] . " set idExposant = 53 where idAuteur=86 and idExposant=61 ;" ) ;

// 62  De Riemaecker creaneau: samedi_am 0 -> 1
$importExposant->executeSql( "update " . Connexion::$tables["exposer"] . " set samedi_am = 1 where idAuteur = 62 ;" ) ;

// Auxilivre stand 302 -> 304
$importExposant->executeSql( "update " . Connexion::$tables["exposant"] . " set numStand = 304 where nom = 'Auxilivre' ;" ) ;

// Ajoute un stand non répétorié dans la table stand 
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


$importExposant->unitTest( 
    "Auxilivre stand 302 -> 304",
    "select * from " . Connexion::$tables["exposant"] . " where nom = 'Auxilivre' ;" ) ;

$importExposant->unitTest( "Ajoute un stand non répétorié dans la table stand" ,
    "select * from " . Connexion::$tables["stand"] . " where num = 606 ;", false ) ;

$importExposant->unitTest(
    "86 Françoise Gardeur exposant: 61 ALL Bourgogne Franche-Comté -> 53 Association des Éditeurs belges",
    "select * from " . Connexion::$tables["AuteurExposantExposer"] . " where idAuteur = 86 and idExposant=61;" ) ;

$importExposant->unitTest( "62  De Riemaecker creaneau: samedi_am 0 -> 1", 
    "select * from " . Connexion::$tables["AuteurExposantExposer"] . " where idAuteur = 62 and samedi_am=0 ;" ) ;


?>

<form action="index.php" method="POST">
    <button type="submit" name="mon_bouton" value="valider">Revenir au menu</button>
</form>