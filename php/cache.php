<?php

// Auteur: Kevin MEYER - 19/11/2026

// Cache des réponses publiques : le jour du festival beaucoup de visiteurs
// demandent les mêmes listes, on ne refait les requêtes qu'une fois par minute
const DUREE_CACHE = 60 ;

function dossierReponses()
{
    return sys_get_temp_dir() . "/fdlc2026-cache" ;
}

// Renvoie la réponse déjà en cache, sinon garde la sortie du script pour la prochaine fois
// (les vieux fichiers sont effacés de temps en temps, sinon des adresses inventées rempliraient le disque)
function cacheDebut()
{
    $fichier = dossierReponses() . "/" . md5( ( $_SERVER["SCRIPT_NAME"] ?? "" ) . "?" . ( $_SERVER["QUERY_STRING"] ?? "" ) ) . ".json" ;

    if( is_file( $fichier ) && time() - filemtime( $fichier ) < DUREE_CACHE )
    {
        header( "Content-Type: application/json; charset=utf-8" ) ;
        readfile( $fichier ) ;
        exit ;
    }

    if( rand( 1, 200 ) == 1 )
    {
        foreach( glob( dossierReponses() . "/*.json" ) ?: [] as $vieux ) if( time() - @filemtime( $vieux ) > DUREE_CACHE ) @unlink( $vieux ) ;
    }

    ob_start( function( $sortie ) use( $fichier )
    {
        if( http_response_code() == 200 && in_array( substr( ltrim( $sortie ), 0, 1 ), ["[", "{"] ) )
        {
            if( !is_dir( dossierReponses() ) ) @mkdir( dossierReponses(), 0700 ) ;
            $temp = $fichier . "." . getmypid() ;
            if( @file_put_contents( $temp, $sortie ) !== false ) @rename( $temp, $fichier ) ;
        }
        return $sortie ;
    } ) ;
}

// Vide le cache après une modification
function videCache()
{
    foreach( glob( dossierReponses() . "/*.json" ) ?: [] as $fichier ) @unlink( $fichier ) ;
}

?>
