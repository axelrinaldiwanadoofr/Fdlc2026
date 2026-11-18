<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

// Nouvel ordre des rôles, du plus haut au plus bas
try
{
    $moi = exigePermission( "roles.gerer" ) ;
    $ids = array_map( "intval", (array)( donneesPost()["ids"] ?? [] ) ) ;

    $cursor = bd()->prepare( "select id from " . table( "role" ) . " where niveau < :niveau" ) ;
    $cursor->execute( ["niveau" => $moi["niveau"]] ) ;
    $modifiables = array_map( "intval", $cursor->fetchAll( PDO::FETCH_COLUMN ) ) ;

    $tries = $ids ;
    sort( $tries ) ;
    sort( $modifiables ) ;
    if( count( $ids ) == 0 || $tries !== $modifiables ) refuse( "La liste des rôles a changé, rechargez la page", 409 ) ;

    // niveaux de 10 en 10 sous le sien
    $nb = count( $ids ) ;
    $pas = min( 10, intdiv( $moi["niveau"] - 1, $nb ) ) ;

    $bd = bd() ;
    $bd->beginTransaction() ;
    $cursor = $bd->prepare( "update " . table( "role" ) . " set niveau = :niveau where id = :id" ) ;
    foreach( $ids as $position => $id ) $cursor->execute( ["niveau" => ( $nb - $position ) * $pas, "id" => $id] ) ;
    $bd->commit() ;

    journal( "Ordre des rôles changé" ) ;
    repond( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    if( isset( $bd ) && $bd->inTransaction() ) $bd->rollBack() ;
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD", 500 ) ;
}

?>
