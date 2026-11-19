<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

// Compte connecté, null sinon
try
{
    if( !rootExiste() ) creeTables() ;
    $compte = compteConnecte() ;

    repond( ["compte" => $compte ? compteAppli( $compte ) : null] ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD (erreur " . $erreur->getCode() . ")", 500 ) ;
}

?>
