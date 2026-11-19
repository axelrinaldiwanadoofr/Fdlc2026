<?php

// Auteur: Kevin MEYER - 19/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Vrai si la valeur est acceptée pour ce réglage
function valeurValide( $cle, $valeur )
{
    if( !is_string( $valeur ) ) return false ;
    if( $cle == "accueil" ) return in_array( $valeur, ["ancien", "nouveau"] ) ;
    if( $cle == "debut" || $cle == "fin" ) return preg_match( "/^\d{4}-\d{2}-\d{2}$/", $valeur ) == 1 ;
    if( $cle == "lienLycee" || $cle == "siteFestival" ) return $valeur == "" || preg_match( "/^https?:\/\/\S+$/", $valeur ) == 1 ;
    if( $cle == "affiche" || preg_match( "/^plan[1-9]$/", $cle ) ) return $valeur == "" || preg_match( "/^assets\/reglages\/[\w.-]+$/", $valeur ) == 1 ;
    if( in_array( $cle, ["titre", "lieu", "contact", "professeur"] ) ) return mb_strlen( $valeur ) <= 200 ;
    if( $cle == "etudiants" ) return mb_strlen( $valeur ) <= 3000 ;
    return false ;
}

$donnees = donneesPost() ;

// la page config envoie une seule clé (accueil), la page Réglages toutes ses valeurs
$valeurs = isset( $donnees["cle"] ) ? [$donnees["cle"] => $donnees["valeur"] ?? ""] : ( $donnees["valeurs"] ?? [] ) ;
if( !is_array( $valeurs ) || count( $valeurs ) == 0 ) refuse( "Aucun réglage à enregistrer", 400 ) ;

foreach( $valeurs as $cle => $valeur )
{
    if( !valeurValide( $cle, $valeur ) ) refuse( "Valeur incorrecte pour " . $cle, 400 ) ;
}
if( isset( $valeurs["debut"], $valeurs["fin"] ) && $valeurs["fin"] < $valeurs["debut"] ) refuse( "La fin du festival doit être après le début", 400 ) ;

if( isset( $valeurs["accueil"] ) ) $compte = exigePermission( "accueil.modifier" ) ;
if( count( $valeurs ) > ( isset( $valeurs["accueil"] ) ? 1 : 0 ) ) $compte = exigePermission( "reglages.modifier" ) ;

try
{
    $bd = bd() ;

    if( !tableExiste( "parametre" ) ) $bd->exec( "create table " . table( "parametre" ) . " ( cle varchar(50) not null primary key, valeur text not null ) engine=InnoDB" ) ;
    else if( !isset( $valeurs["accueil"] ) ) $bd->exec( "alter table " . table( "parametre" ) . " modify valeur text not null" ) ;

    $cursor = $bd->prepare( "replace into " . table( "parametre" ) . " ( cle, valeur ) values ( :cle, :valeur )" ) ;
    foreach( $valeurs as $cle => $valeur ) $cursor->execute( ["cle" => $cle, "valeur" => trim( $valeur )] ) ;

    journal( "Réglage du site", isset( $valeurs["accueil"] ) ? "accueil = " . $valeurs["accueil"] : "Réglages du festival", $compte ) ;
    repond( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    repond( ["erreur" => "Probleme d'acces à la BD"], 500 ) ;
}

?>
