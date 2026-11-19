<?php

// Auteur: Kevin MEYER - 19/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Réglages du site visibles par tout le monde
$parametres = ["accueil" => "ancien"] ;

try
{
    if( tableExiste( "parametre" ) )
    {
        $lignes = bd()->query( "select cle, valeur from " . table( "parametre" ) )->fetchAll( PDO::FETCH_ASSOC ) ;
        foreach( $lignes as $ligne ) $parametres[$ligne["cle"]] = $ligne["valeur"] ;
    }
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
}

echo json_encode( $parametres, JSON_UNESCAPED_UNICODE ) ;

?>
