<?php
require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Annonces à afficher maintenant, ou toutes avec ?toutes (page de config)
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select id, texte, couleur, debut, fin, active from " . Connexion::$tables["annonce"] ;

    if( !isset( $_GET["toutes"] ) )
    {
        $sql .= " where active = 1 and ( debut is null or debut <= now() ) and ( fin is null or fin > now() )" ;
    }

    $sql .= " order by id desc" ;

    echo json_encode( $bd->query( $sql )->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    // sans la table annonce on n'affiche rien
    echo json_encode( [] ) ;
}

?>
