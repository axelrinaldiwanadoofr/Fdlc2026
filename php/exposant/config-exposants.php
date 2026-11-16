<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Tous les exposants avec leur stand, le nombre de personnes et de livres édités
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select x.id, trim( x.nom ) as nom, x.libelle as libelleExposant, x.type, x.numLieu, l.nom as nomLieu,"
         . " ( select count(*) from " . Connexion::$tables["exposer"] . " e where e.idExposant = x.id ) as nbPersonnes,"
         . " ( select count(*) from " . Connexion::$tables["livre"] . " v where v.idEditeur = x.id ) as nbLivres"
         . " from " . Connexion::$tables["exposant"] . " x"
         . " left join " . Connexion::$tables["lieu"] . " l on l.num = x.numLieu"
         . " order by trim( x.nom )" ;

    echo json_encode( $bd->query( $sql )->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
