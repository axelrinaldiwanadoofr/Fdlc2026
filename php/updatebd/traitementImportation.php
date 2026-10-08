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

<form action="updatebd.php" method="POST">
    <button type="submit" name="mon_bouton" value="valider">Revenir au menu</button>
</form>
