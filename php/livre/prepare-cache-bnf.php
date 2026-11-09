<?php

// Auteur: Kevin MEYER - 09/11/2026

require_once "../Connexion.php" ;
require_once "bnf.php" ;

// A lancer une fois avant le festival pour mettre en cache les livres de tous les auteurs
// ça prend quelques minutes car on fait une requête à la fois
set_time_limit( 0 ) ;
header( "Content-Type: text/plain; charset=utf-8" ) ;

$bd = Connexion::getInstance() ;
$sql = "select prenom, nom from " . Connexion::$tables["personne"] . " where specialite = 'auteur' order by nom" ;
$auteurs = $bd->query( $sql )->fetchAll( PDO::FETCH_ASSOC ) ;

foreach( $auteurs as $auteur )
{
    $ok = xmlBnf( trim( $auteur["prenom"] ?? "" ), trim( $auteur["nom"] ?? "" ) ) !== false ;
    echo ( $ok ? "ok     " : "erreur " ) . $auteur["prenom"] . " " . $auteur["nom"] . "\n" ;
    flush() ;
}

echo "Fini, " . count( $auteurs ) . " auteurs" ;

?>
