<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

// Supprime un compte, la personne reste dans la base
try
{
    $moi = exigePermission( "comptes.gerer" ) ;
    $cible = chargeCompte( (int)( donneesPost()["id"] ?? 0 ) ) ;

    if( !$cible ) refuse( "Compte introuvable", 404 ) ;
    if( $cible["estRoot"] ) refuse( "Le compte root ne peut pas être supprimé" ) ;
    if( $cible["id"] == $moi["id"] ) refuse( "Vous ne pouvez pas supprimer votre propre compte" ) ;
    if( !$moi["estRoot"] && $cible["niveau"] >= $moi["niveau"] ) refuse( "Ce compte a un rôle égal ou supérieur au vôtre" ) ;

    bd()->prepare( "delete from " . table( "compte" ) . " where id = :id" )->execute( ["id" => $cible["id"]] ) ;
    journal( "Compte supprimé", $cible["identifiant"] ) ;

    repond( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD", 500 ) ;
}

?>
