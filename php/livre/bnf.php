<?php

// Auteur: Kevin MEYER - 09/11/2026

// Fonctions pour interroger la BnF
// Une seule requete a la fois avec une pause d'1 seconde, sinon la BnF bloque l'adresse du serveur

function dossierCache( string $nom ): string
{
    $dossier = sys_get_temp_dir() . "/" . $nom ;
    if( !is_dir( $dossier ) ) mkdir( $dossier ) ;
    return $dossier ;
}

function telecharge( string $url ): string | false
{
    // si la BnF nous a bloqué on attend 30 minutes avant de réessayer
    $pause = sys_get_temp_dir() . "/fdlc2026-bnf-pause" ;
    if( is_file( $pause ) && time() - filemtime( $pause ) < 1800 ) return false ;

    $verrou = fopen( sys_get_temp_dir() . "/fdlc2026-bnf.lock", "c" ) ;
    flock( $verrou, LOCK_EX ) ;

    $contexte = stream_context_create( ["http" => ["timeout" => 15, "header" => "User-Agent: Festival du livre de Colmar 2026\r\n"]] ) ;
    $reponse = @file_get_contents( $url, false, $contexte ) ;

    // pas de réponse du tout (pas une erreur 404 ou 500) : on est bloqué
    if( $reponse === false && empty( $http_response_header ) ) touch( $pause ) ;

    sleep( 1 ) ;
    flock( $verrou, LOCK_UN ) ;
    fclose( $verrou ) ;

    return $reponse ;
}

// XML des livres imprimés d'un auteur, gardé 7 jours en cache
function xmlBnf( string $prenom, string $nom ): string | false
{
    $fichier = dossierCache( "fdlc2026-bnf" ) . "/" . md5( mb_strtolower( $nom . " " . $prenom ) ) . ".xml" ;

    if( is_file( $fichier ) && time() - filemtime( $fichier ) < 7 * 24 * 3600 ) return file_get_contents( $fichier ) ;

    $requete = 'bib.author all "' . str_replace( '"', '', $nom . " " . $prenom ) . '" and bib.doctype any "a"' ;
    $url = "https://catalogue.bnf.fr/api/SRU?version=1.2&operation=searchRetrieve&recordSchema=dublincore"
         . "&maximumRecords=200&query=" . rawurlencode( $requete ) ;

    $xml = telecharge( $url ) ;
    if( $xml !== false && str_contains( $xml, "searchRetrieveResponse" ) )
    {
        file_put_contents( $fichier, $xml, LOCK_EX ) ;
        return $xml ;
    }

    // BnF hors service : ancienne réponse
    if( is_file( $fichier ) ) return file_get_contents( $fichier ) ;
    return false ;
}

?>
