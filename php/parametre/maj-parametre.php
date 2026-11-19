<?php

// Auteur: Kevin MEYER - 19/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$compte = exigePermission( "accueil.modifier" ) ;
$donnees = donneesPost() ;

// valeurs acceptées pour chaque réglage
$valeurs = ["accueil" => ["ancien", "nouveau"]] ;

$cle = $donnees["cle"] ?? "" ;
$valeur = $donnees["valeur"] ?? "" ;

if( !isset( $valeurs[$cle] ) || !in_array( $valeur, $valeurs[$cle] ) ) refuse( "Réglage inconnu", 400 ) ;

try
{
    $bd = bd() ;

    if( !tableExiste( "parametre" ) ) $bd->exec( "create table " . table( "parametre" ) . " ( cle varchar(50) not null primary key, valeur varchar(200) not null ) engine=InnoDB" ) ;

    $bd->prepare( "replace into " . table( "parametre" ) . " ( cle, valeur ) values ( :cle, :valeur )" )
       ->execute( ["cle" => $cle, "valeur" => $valeur] ) ;

    journal( "Réglage du site", $cle . " = " . $valeur, $compte ) ;
    repond( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    repond( ["erreur" => "Probleme d'acces à la BD"], 500 ) ;
}

?>
