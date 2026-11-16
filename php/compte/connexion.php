<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

// Connexion avec identifiant et mot de passe
// 5 erreurs sur un compte le bloquent 15 minutes, 15 erreurs depuis une même adresse aussi
try
{
    creeTables() ;

    $donnees = donneesPost() ;
    $identifiant = mb_strtolower( trim( (string)( $donnees["identifiant"] ?? "" ) ) ) ;
    $mdp = (string)( $donnees["mdp"] ?? "" ) ;
    $messageErreur = "Identifiant ou mot de passe incorrect" ;

    if( ipBloquee() ) refuse( "Trop d'essais, réessayez dans 15 minutes", 429 ) ;

    $cursor = bd()->prepare( "select id, hash, actif, essais, bloqueJusqua > now() as bloque from " . table( "compte" ) . " where identifiant = :identifiant" ) ;
    $cursor->execute( ["identifiant" => $identifiant] ) ;
    $ligne = $cursor->fetch( PDO::FETCH_ASSOC ) ;

    if( !$ligne )
    {
        // même temps de réponse qu'avec un vrai compte
        password_verify( $mdp, '$2y$10$abcdefghijklmnopqrstuu6qe8c0gD5BJ/IIQtsYb3dVPqk6cXWW6' ) ;
        noteEssaiIp( false ) ;
        journal( "Échec de connexion", "Identifiant inconnu : " . $identifiant, [] ) ;
        refuse( $messageErreur, 401 ) ;
    }

    if( $ligne["bloque"] == 1 ) refuse( "Trop d'essais sur ce compte, réessayez dans 15 minutes", 429 ) ;

    if( !password_verify( $mdp, $ligne["hash"] ) )
    {
        $essais = (int)$ligne["essais"] + 1 ;
        $sql = $essais >= ESSAIS_MAX
             ? "update " . table( "compte" ) . " set essais = 0, bloqueJusqua = now() + interval " . ( DUREE_BLOCAGE / 60 ) . " minute where id = :id"
             : "update " . table( "compte" ) . " set essais = essais + 1 where id = :id" ;
        bd()->prepare( $sql )->execute( ["id" => $ligne["id"]] ) ;
        noteEssaiIp( false ) ;
        journal( "Échec de connexion", $essais >= ESSAIS_MAX ? "Compte bloqué 15 minutes" : "Mauvais mot de passe", ["id" => $ligne["id"], "identifiant" => $identifiant] ) ;
        refuse( $messageErreur, 401 ) ;
    }

    if( $ligne["actif"] != 1 ) refuse( "Ce compte est désactivé", 403 ) ;

    // hash refait si PHP conseille un algorithme plus récent
    if( password_needs_rehash( $ligne["hash"], PASSWORD_DEFAULT ) )
    {
        bd()->prepare( "update " . table( "compte" ) . " set hash = :hash where id = :id" )
            ->execute( ["hash" => password_hash( $mdp, PASSWORD_DEFAULT ), "id" => $ligne["id"]] ) ;
    }

    bd()->prepare( "update " . table( "compte" ) . " set essais = 0, bloqueJusqua = null, derniereConnexion = now() where id = :id" )
        ->execute( ["id" => $ligne["id"]] ) ;
    noteEssaiIp( true ) ;

    $compte = chargeCompte( $ligne["id"] ) ;
    ouvreSession( $compte ) ;
    journal( "Connexion", "", $compte ) ;

    repond( compteAppli( $compte ) ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD", 500 ) ;
}

?>
