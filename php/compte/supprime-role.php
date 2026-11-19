<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

// Supprime un rôle qui n'est donné à aucun compte
try
{
    $moi = exigePermission( "roles.gerer" ) ;
    $id = (int)( donneesPost()["id"] ?? 0 ) ;

    $cursor = bd()->prepare( "select nom, niveau, ( select count(*) from " . table( "compte" ) . " where idRole = :id1 ) as nbComptes from "
                           . table( "role" ) . " where id = :id2" ) ;
    $cursor->execute( ["id1" => $id, "id2" => $id] ) ;
    $role = $cursor->fetch( PDO::FETCH_ASSOC ) ;

    if( !$role ) refuse( "Rôle introuvable", 404 ) ;
    if( !$moi["estRoot"] && (int)$role["niveau"] >= $moi["niveau"] ) refuse( "Ce rôle est égal ou supérieur au vôtre" ) ;
    if( $role["nbComptes"] > 0 ) refuse( "Ce rôle est encore donné à " . $role["nbComptes"] . " compte(s)", 400 ) ;

    bd()->prepare( "delete from " . table( "permission" ) . " where idRole = :id" )->execute( ["id" => $id] ) ;
    bd()->prepare( "delete from " . table( "role" ) . " where id = :id" )->execute( ["id" => $id] ) ;
    journal( "Rôle supprimé", $role["nom"] ) ;

    repond( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD", 500 ) ;
}

?>
