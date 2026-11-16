<?php

// Auteur: Kevin MEYER - 16/11/2026

// A inclure en haut des pages PHP réservées à la config :
// il faut s'être connecté sur la page Configuration de l'appli
require_once __DIR__ . "/mot-de-passe.php" ;

if( php_sapi_name() != "cli" && !sessionConfigOk() )
{
    http_response_code( 403 ) ;
    echo "Accès réservé : connectez-vous d'abord sur la page Configuration de l'application." ;
    exit ;
}

?>
