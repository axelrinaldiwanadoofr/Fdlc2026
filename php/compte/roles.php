<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

// Rôles du plus haut au plus bas avec leurs permissions
try
{
    $moi = compteConnecte() ;
    if( !peut( $moi, "roles.gerer" ) && !peut( $moi, "comptes.gerer" ) ) refuse( "Vous n'avez pas la permission de faire ça" ) ;

    $roles = bd()->query( "select r.id, r.nom, r.niveau, r.couleur,"
                        . " ( select count(*) from " . table( "compte" ) . " c where c.idRole = r.id ) as nbComptes"
                        . " from " . table( "role" ) . " r order by r.niveau desc" )->fetchAll( PDO::FETCH_ASSOC ) ;

    $permissions = [] ;
    foreach( bd()->query( "select idRole, code from " . table( "permission" ) )->fetchAll( PDO::FETCH_ASSOC ) as $ligne )
    {
        $permissions[$ligne["idRole"]][] = $ligne["code"] ;
    }

    foreach( $roles as &$role )
    {
        $role["permissions"] = $permissions[$role["id"]] ?? [] ;
        $role["modifiable"] = peut( $moi, "roles.gerer" ) && ( $moi["estRoot"] || (int)$role["niveau"] < $moi["niveau"] ) ;
    }

    $groupes = [] ;
    foreach( PERMISSIONS as $groupe => $liste )
    {
        $codes = [] ;
        foreach( $liste as $code => $texte ) $codes[] = ["code" => $code, "texte" => $texte] ;
        $groupes[] = ["nom" => $groupe, "permissions" => $codes] ;
    }

    repond( ["roles" => $roles, "groupes" => $groupes, "monNiveau" => $moi["niveau"]] ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD", 500 ) ;
}

?>
