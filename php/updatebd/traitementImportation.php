<?php

require_once "../Connexion.php" ;
require_once "ImportStand.php" ;

$importStand = new ImportStand( "stand ") ;

$importStand->executeSql( "delete from stand" ) ;

$importStand->importeDonnees() ;

$importStand->executeSql( "insert into stand(num) values( 606 )" ) ;

$importStand->importeDonnees() ;

$data = $importStand->executeSql( "select count(*) from stand" ) ;
$importStand->afficheDonnes( $data ) ;

?>