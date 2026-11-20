<?php
require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

// Auteur: Kevin MEYER - 20/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Livres publiés par un exposant (éditeur) avec leurs auteurs
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select v.id, trim( v.titre ) as titre,"
         . " group_concat( distinct trim( concat( coalesce( p.prenom, '' ), ' ', coalesce( p.nom, '' ) ) ) order by p.nom separator ', ' ) as auteurs"
         . " from " . Connexion::$tables["livre"] . " v"
         . " left join " . Connexion::$tables["ecrire"] . " e on e.idLivre = v.id"
         . " left join " . Connexion::$tables["personne"] . " p on p.id = e.idPersonne"
         . " where v.idEditeur = :id"
         . " group by v.id, v.titre order by trim( v.titre )" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":id", (int)( $_GET["id"] ?? -1 ), PDO::PARAM_INT ) ;
    $cursor->execute() ;

    echo json_encode( $cursor->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
