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

$importStand->ajouteDonnees() ;
$importExposant->ajouteDonnees() ;
$importAuteur->ajouteDonnees() ;
$importExposer->ajouteDonnees() ;

$importAuteur->modifieDonnees() ;
$importExposant->modifieDonnees() ;
$importStand->modifieDonnees() ;

$importAuteur->supprimeDonnees() ;
$importExposant->supprimeDonnees() ;
$importStand->supprimeDonnees() ;

?>

<form action="index.php" method="POST">
    <button type="submit" name="mon_bouton" value="valider">Revenir au menu</button>
</form>
