<?php

// Auteur: Kevin MEYER - 18/11/2026

require_once "securite.php" ;

// Tout ce qui est enregistré sur le compte connecté (droit d'accès RGPD)
try
{
    $compte = compteConnecte() ;
    if( !$compte ) refuse( "Session expirée, reconnectez-vous", 401 ) ;

    $cursor = bd()->prepare( "select derniereConnexion from " . table( "compte" ) . " where id = :id" ) ;
    $cursor->execute( ["id" => $compte["id"]] ) ;
    $infos = $cursor->fetch( PDO::FETCH_ASSOC ) ;

    $droits = [] ;
    foreach( PERMISSIONS as $groupe )
    {
        foreach( $groupe as $code => $texte ) if( in_array( $code, $compte["permissions"] ) ) $droits[] = $texte ;
    }

    $cursor = bd()->prepare( "select date, action, detail, ip from " . table( "journal" ) . " where idCompte = :id order by id desc limit 100" ) ;
    $cursor->execute( ["id" => $compte["id"]] ) ;

    repond( [
        "identifiant" => $compte["identifiant"],
        "nom" => $compte["nom"],
        "role" => $compte["role"],
        "droits" => $droits,
        "derniereConnexion" => $infos["derniereConnexion"],
        "joursJournal" => JOURS_JOURNAL,
        "journal" => $cursor->fetchAll( PDO::FETCH_ASSOC )
    ] ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD", 500 ) ;
}

?>
