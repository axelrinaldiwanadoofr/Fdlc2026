<?php

// Auteur: Kevin MEYER - 09/11/2026

require_once "../Connexion.php" ;
require_once "bnf.php" ;

// A lancer une fois avant le festival pour mettre en cache les livres de tous les auteurs
// ça prend quelques minutes car on fait une requête à la fois
// seulement après connexion à la config (ou "php prepare-cache-bnf.php" sur le serveur)
$bnfPatient = true ;
$permissionGarde = "bnf.lancer" ;
require_once "../config/garde.php" ;

set_time_limit( 0 ) ;
header( "Content-Type: text/plain; charset=utf-8" ) ;

$bd = Connexion::getInstance() ;
$sql = "select prenom, nom from " . Connexion::$tables["personne"] . " where specialite = 'auteur' order by nom" ;
$auteurs = $bd->query( $sql )->fetchAll( PDO::FETCH_ASSOC ) ;

$nbOk = 0 ;
foreach( $auteurs as $auteur )
{
    $ok = xmlBnf( trim( $auteur["prenom"] ?? "" ), trim( $auteur["nom"] ?? "" ) ) !== false ;
    if( $ok ) $nbOk++ ;
    echo ( $ok ? "ok     " : "erreur " ) . $auteur["prenom"] . " " . $auteur["nom"] . "\n" ;
    flush() ;

    // la BnF ne répond plus : inutile de continuer, les auteurs déjà faits restent en cache
    if( !$ok && bnfEnPause() )
    {
        echo "\nLa BnF ne répond plus. Relancer cette page dans 30 minutes : seuls les auteurs manquants seront demandés.\n" ;
        break ;
    }
}

echo "Fini, " . $nbOk . " auteurs sur " . count( $auteurs ) . " en cache" ;

?>
