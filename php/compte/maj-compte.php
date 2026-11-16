<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

// Crée ou modifie le compte d'une personne : identifiant, rôle, accès.
// A la création (ou avec nouveauMdp) le serveur tire un mot de passe au hasard, renvoyé une seule fois
// pour le donner à la personne, qui devra le changer à sa première connexion
try
{
    $moi = exigePermission( "comptes.gerer" ) ;
    $donnees = donneesPost() ;
    $compte = $donnees["compte"] ?? [] ;
    $id = (int)( $compte["id"] ?? -1 ) ;
    $mdp = ( $id <= 0 || !empty( $donnees["nouveauMdp"] ) ) ? motDePasseAleatoire() : "" ;

    $identifiant = mb_strtolower( trim( (string)( $compte["identifiant"] ?? "" ) ) ) ;
    if( !preg_match( "/^[a-z0-9._-]{3,50}$/", $identifiant ) || $identifiant == "root" )
    {
        refuse( "L'identifiant fait 3 à 50 caractères : lettres sans accent, chiffres, point, tiret", 400 ) ;
    }

    // le rôle donné doit être en dessous du sien
    $cursor = bd()->prepare( "select niveau, nom from " . table( "role" ) . " where id = :id" ) ;
    $cursor->execute( ["id" => (int)( $compte["idRole"] ?? 0 )] ) ;
    $role = $cursor->fetch( PDO::FETCH_ASSOC ) ;
    if( !$role ) refuse( "Choisissez un rôle", 400 ) ;
    if( !$moi["estRoot"] && (int)$role["niveau"] >= $moi["niveau"] ) refuse( "Vous ne pouvez donner qu'un rôle inférieur au vôtre" ) ;

    // identifiant déjà pris : à la création on ajoute un numéro (jean.dupont2), sinon on refuse
    $cursor = bd()->prepare( "select count(*) from " . table( "compte" ) . " where identifiant = :identifiant and id <> :id" ) ;
    $base = mb_substr( $identifiant, 0, 47 ) ;
    for( $numero = 2 ; ; $numero++ )
    {
        $cursor->execute( ["identifiant" => $identifiant, "id" => $id] ) ;
        if( $cursor->fetchColumn() == 0 ) break ;
        if( $id > 0 || $numero > 99 ) refuse( "Cet identifiant est déjà pris", 400 ) ;
        $identifiant = $base . $numero ;
    }

    $actif = empty( $compte["actif"] ) ? 0 : 1 ;

    if( $id <= 0 )
    {
        $idPersonne = (int)( $compte["idPersonne"] ?? 0 ) ;
        $cursor = bd()->prepare( "select count(*) from " . table( "personne" ) . " where id = :id" ) ;
        $cursor->execute( ["id" => $idPersonne] ) ;
        if( $cursor->fetchColumn() == 0 ) refuse( "Choisissez la personne du compte", 400 ) ;

        $cursor = bd()->prepare( "select count(*) from " . table( "compte" ) . " where idPersonne = :id" ) ;
        $cursor->execute( ["id" => $idPersonne] ) ;
        if( $cursor->fetchColumn() > 0 ) refuse( "Cette personne a déjà un compte", 400 ) ;

        bd()->prepare( "insert into " . table( "compte" ) . " ( identifiant, hash, idRole, idPersonne, actif, doitChanger, creeLe )"
                     . " values ( :identifiant, :hash, :idRole, :idPersonne, :actif, 1, now() )" )
            ->execute( [
                "identifiant" => $identifiant,
                "hash" => password_hash( $mdp, PASSWORD_DEFAULT ),
                "idRole" => (int)$compte["idRole"],
                "idPersonne" => $idPersonne,
                "actif" => $actif
            ] ) ;
        $id = (int)bd()->lastInsertId() ;
        journal( "Compte créé", $identifiant . " | " . $role["nom"] ) ;
        repond( ["id" => $id, "mdp" => $mdp, "identifiant" => $identifiant] ) ;
    }

    $cible = chargeCompte( $id ) ;
    if( !$cible ) refuse( "Compte introuvable", 404 ) ;
    if( $cible["estRoot"] ) refuse( "Le compte root ne se modifie pas ici" ) ;
    if( $cible["id"] == $moi["id"] ) refuse( "Votre propre compte se modifie dans Mon compte" ) ;
    if( !$moi["estRoot"] && $cible["niveau"] >= $moi["niveau"] ) refuse( "Ce compte a un rôle égal ou supérieur au vôtre" ) ;

    $sql = "update " . table( "compte" ) . " set identifiant = :identifiant, idRole = :idRole, actif = :actif" ;
    $parametres = ["identifiant" => $identifiant, "idRole" => (int)$compte["idRole"], "actif" => $actif, "id" => $id] ;

    // nouveau mot de passe, désactivation ou changement de rôle : les sessions ouvertes sont coupées
    $couperSessions = $actif != $cible["actif"] || (int)$compte["idRole"] != (int)$cible["idRole"] ;
    if( $mdp != "" )
    {
        $sql .= ", hash = :hash, doitChanger = 1, essais = 0, bloqueJusqua = null" ;
        $parametres["hash"] = password_hash( $mdp, PASSWORD_DEFAULT ) ;
        $couperSessions = true ;
    }
    if( $couperSessions ) $sql .= ", version = version + 1" ;

    bd()->prepare( $sql . " where id = :id" )->execute( $parametres ) ;

    $detail = $identifiant . " | " . $role["nom"] . ( $actif ? "" : " | accès désactivé" ) . ( $mdp != "" ? " | nouveau mot de passe" : "" ) ;
    journal( "Compte modifié", $detail ) ;
    repond( ["id" => $id, "mdp" => $mdp, "identifiant" => $identifiant] ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD", 500 ) ;
}

?>
