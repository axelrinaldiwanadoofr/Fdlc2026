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



?>

<form action="index.php" method="POST">
    <button type="submit" name="mon_bouton" value="valider">Revenir au menu</button>
</form>
