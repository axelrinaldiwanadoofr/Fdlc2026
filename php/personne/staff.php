<?php

// Auteur: Kevin MEYER - 19/11/2026

require_once __DIR__ . "/../compte/securite.php" ;
require_once __DIR__ . "/../parametre/reglage.php" ;

// Spécialités marquées STAFF, gardées dans la table parametre (clé staff) pour ne pas toucher à la table specialite
function specialitesStaff()
{
    $liste = reglage( "staff", "animateur|modérateur|présentateur|organisateur|bénévole" ) ;
    return array_values( array_filter( explode( "|", $liste ) ) ) ;
}

function enregistreStaff( $liste )
{
    $bd = bd() ;
    if( !tableExiste( "parametre" ) ) $bd->exec( "create table " . table( "parametre" ) . " ( cle varchar(50) not null primary key, valeur text not null ) engine=InnoDB" ) ;
    $bd->prepare( "replace into " . table( "parametre" ) . " ( cle, valeur ) values ( 'staff', :valeur )" )
       ->execute( ["valeur" => "|" . implode( "|", $liste )] ) ;
}

?>
