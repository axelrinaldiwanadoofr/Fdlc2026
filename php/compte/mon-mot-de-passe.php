<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

// Changement de son propre mot de passe (ancien obligatoire)
try
{
    $compte = compteConnecte() ;
    if( !$compte ) refuse( "Session expirée, reconnectez-vous", 401 ) ;
    verifieJeton() ;

    $donnees = donneesPost() ;
    $nouveau = (string)( $donnees["nouveau"] ?? "" ) ;

    $cursor = bd()->prepare( "select hash from " . table( "compte" ) . " where id = :id" ) ;
    $cursor->execute( ["id" => $compte["id"]] ) ;
    if( !password_verify( (string)( $donnees["ancien"] ?? "" ), $cursor->fetchColumn() ) ) refuse( "Ancien mot de passe incorrect", 400 ) ;

    verifieMotDePasse( $nouveau, $compte["identifiant"] ) ;
    if( $nouveau === ( $donnees["ancien"] ?? "" ) ) refuse( "Le nouveau mot de passe doit être différent", 400 ) ;

    // version + 1 : les autres sessions ouvertes avec l'ancien mot de passe sont coupées
    bd()->prepare( "update " . table( "compte" ) . " set hash = :hash, doitChanger = 0, version = version + 1 where id = :id" )
        ->execute( ["hash" => password_hash( $nouveau, PASSWORD_DEFAULT ), "id" => $compte["id"]] ) ;

    $compte = chargeCompte( $compte["id"] ) ;
    ouvreSession( $compte ) ;
    journal( "Mot de passe changé", "", $compte ) ;

    repond( compteAppli( $compte ) ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD", 500 ) ;
}

?>
