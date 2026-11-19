<?php

// Auteur: Kevin MEYER - 19/11/2026

// Valeur d'un réglage du festival (page Réglages), ou la valeur par défaut s'il n'a jamais été enregistré
function reglage( $cle, $defaut )
{
    try
    {
        if( !tableExiste( "parametre" ) ) return $defaut ;
        $cursor = bd()->prepare( "select valeur from " . table( "parametre" ) . " where cle = :cle" ) ;
        $cursor->execute( ["cle" => $cle] ) ;
        $valeur = $cursor->fetchColumn() ;
        return ( $valeur === false || trim( $valeur ) == "" ) ? $defaut : $valeur ;
    }
    catch( Exception $erreur )
    {
        return $defaut ;
    }
}

?>
