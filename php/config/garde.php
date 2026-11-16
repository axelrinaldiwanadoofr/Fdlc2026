<?php

// Auteur: Kevin MEYER - 16/11/2026

// A inclure en haut des pages PHP réservées à la config (imports, cache BnF) :
// il faut être connecté avec un compte qui a la permission $permissionGarde
require_once __DIR__ . "/../compte/securite.php" ;

if( php_sapi_name() != "cli" && !peut( compteConnecte(), $permissionGarde ?? "imports.lancer" ) )
{
    http_response_code( 403 ) ;
    echo "Accès réservé : connectez-vous sur la page Configuration avec un compte qui a ce droit." ;
    exit ;
}

?>
