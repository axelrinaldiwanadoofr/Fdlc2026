<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Tous les lieux avec le nombre d'exposants et d'evenements qui les utilisent
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select l.num, l.nom, l.libelle, coalesce( l.hall, l.num div 100 ) as hall, l.type, l.x1,"
         . " ( select count(*) from " . Connexion::$tables["exposant"] . " x where x.numLieu = l.num ) as nbExposants,"
         . " ( select count(*) from " . Connexion::$tables["evenement"] . " e where e.numLieu = l.num ) as nbEvenements"
         . " from " . Connexion::$tables["lieu"] . " l order by l.num" ;

    $cursor = $bd->query( $sql ) ;

    echo json_encode( $cursor->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
