<?php

// Notices de la BnF pour un auteur (gardées 7 jours en cache)

header( "Content-Type: text/xml; charset=utf-8" ) ;

$prenom = trim( $_GET["prenom"] ?? "" ) ;
$nom = trim( $_GET["nom"] ?? "" ) ;

if( $nom == "" )
{
    http_response_code( 400 ) ;
    exit ;
}

$dossier = sys_get_temp_dir() . "/fdlc2026-bnf" ;
if( !is_dir( $dossier ) ) mkdir( $dossier ) ;
$fichier = $dossier . "/" . md5( mb_strtolower( $nom . " " . $prenom ) ) . ".xml" ;

if( is_file( $fichier ) && time() - filemtime( $fichier ) < 7 * 24 * 3600 )
{
    readfile( $fichier ) ;
    exit ;
}

$requete = 'bib.author all "' . str_replace( '"', '', $nom . " " . $prenom ) . '" and bib.doctype any "a"' ;
$url = "https://catalogue.bnf.fr/api/SRU?version=1.2&operation=searchRetrieve&recordSchema=dublincore"
     . "&maximumRecords=200&query=" . rawurlencode( $requete ) ;

$contexte = stream_context_create( ["http" => ["timeout" => 15, "header" => "User-Agent: Festival du livre de Colmar 2026\r\n"]] ) ;
$xml = @file_get_contents( $url, false, $contexte ) ;

if( $xml !== false && str_contains( $xml, "searchRetrieveResponse" ) )
{
    file_put_contents( $fichier, $xml, LOCK_EX ) ;
    echo $xml ;
}
else if( is_file( $fichier ) )
{
    // BnF hors service : ancienne réponse
    readfile( $fichier ) ;
}
else
{
    http_response_code( 502 ) ;
}

?>
