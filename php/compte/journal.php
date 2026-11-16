<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

// Les 300 dernières actions (connexions, comptes, rôles, suppressions)
try
{
    exigePermission( "journal.voir", false ) ;

    $lignes = bd()->query( "select date, identifiant, action, detail, ip from " . table( "journal" ) . " order by id desc limit 300" )->fetchAll( PDO::FETCH_ASSOC ) ;
    repond( $lignes ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD", 500 ) ;
}

?>
