<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

// Crée ou modifie un rôle : nom, couleur, niveau et permissions
// On ne gère que les rôles en dessous du sien et on ne donne que les permissions qu'on a
try
{
    $moi = exigePermission( "roles.gerer" ) ;
    $role = donneesPost()["role"] ?? [] ;
    $id = (int)( $role["id"] ?? -1 ) ;

    $nom = trim( (string)( $role["nom"] ?? "" ) ) ;
    $niveau = (int)( $role["niveau"] ?? 0 ) ;
    $couleur = (string)( $role["couleur"] ?? "" ) ;

    if( $nom == "" || mb_strlen( $nom ) > 40 ) refuse( "Le nom fait entre 1 et 40 caractères", 400 ) ;
    if( mb_strtolower( $nom ) == "root" ) refuse( "Ce nom est réservé", 400 ) ;
    if( !preg_match( "/^#[0-9a-fA-F]{6}$/", $couleur ) ) $couleur = "#6b7280" ;
    if( $niveau < 1 || $niveau >= NIVEAU_ROOT ) refuse( "Le niveau va de 1 à 999", 400 ) ;
    if( !$moi["estRoot"] && $niveau >= $moi["niveau"] ) refuse( "Le niveau doit rester en dessous du vôtre (" . $moi["niveau"] . ")" ) ;

    $cursor = bd()->prepare( "select count(*) from " . table( "role" ) . " where nom = :nom and id <> :id" ) ;
    $cursor->execute( ["nom" => $nom, "id" => $id] ) ;
    if( $cursor->fetchColumn() > 0 ) refuse( "Un rôle porte déjà ce nom", 400 ) ;

    $demandees = array_intersect( (array)( $role["permissions"] ?? [] ), codesPermissions() ) ;
    $actuelles = [] ;

    if( $id > 0 )
    {
        $cursor = bd()->prepare( "select niveau from " . table( "role" ) . " where id = :id" ) ;
        $cursor->execute( ["id" => $id] ) ;
        $ancienNiveau = $cursor->fetchColumn() ;
        if( $ancienNiveau === false ) refuse( "Rôle introuvable", 404 ) ;
        if( !$moi["estRoot"] && (int)$ancienNiveau >= $moi["niveau"] ) refuse( "Ce rôle est égal ou supérieur au vôtre" ) ;

        $cursor = bd()->prepare( "select code from " . table( "permission" ) . " where idRole = :id" ) ;
        $cursor->execute( ["id" => $id] ) ;
        $actuelles = $cursor->fetchAll( PDO::FETCH_COLUMN ) ;
    }

    // les permissions qu'on n'a pas soi-même restent comme elles étaient
    $codes = $moi["estRoot"] ? $demandees
           : array_merge( array_intersect( $demandees, $moi["permissions"] ), array_diff( $actuelles, $moi["permissions"] ) ) ;

    $bd = bd() ;
    $bd->beginTransaction() ;

    if( $id > 0 )
    {
        $bd->prepare( "update " . table( "role" ) . " set nom = :nom, niveau = :niveau, couleur = :couleur where id = :id" )
           ->execute( ["nom" => $nom, "niveau" => $niveau, "couleur" => $couleur, "id" => $id] ) ;
    }
    else
    {
        $bd->prepare( "insert into " . table( "role" ) . " ( nom, niveau, couleur ) values ( :nom, :niveau, :couleur )" )
           ->execute( ["nom" => $nom, "niveau" => $niveau, "couleur" => $couleur] ) ;
        $id = (int)$bd->lastInsertId() ;
    }
    ecritPermissions( $id, $codes ) ;

    $bd->commit() ;

    journal( "Rôle enregistré", $nom . " | niveau " . $niveau . " | " . count( $codes ) . " permission(s)" ) ;
    repond( ["id" => $id] ) ;
}
catch( Exception $erreur )
{
    if( isset( $bd ) && $bd->inTransaction() ) $bd->rollBack() ;
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD", 500 ) ;
}

?>
