<?php

require_once "../Connexion.php" ;
require_once "Importation.php" ;

$importation = new Importation( Connexion::$tables["import"] ) ;
$importation->afficheContenuTable() ;
?>

<form action="updatebd.php" method="POST">
    <button type="submit" name="mon_bouton" value="valider">Revenir au menu</button>
</form>
