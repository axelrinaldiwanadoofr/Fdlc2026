<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Tous les livres avec leur éditeur et leurs auteurs
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select l.id, trim( l.titre ) as titre, l.genre, l.idEditeur, trim( x.nom ) as editeur,"
         . " group_concat( concat_ws( ' ', trim( p.prenom ), trim( p.nom ) ) order by p.nom separator ', ' ) as nom"
         . " from " . Connexion::$tables["livre"] . " l"
         . " left join " . Connexion::$tables["exposant"] . " x on x.id = l.idEditeur"
         . " left join " . Connexion::$tables["ecrire"] . " e on e.idLivre = l.id"
         . " left join " . Connexion::$tables["personne"] . " p on p.id = e.idPersonne"
         . " group by l.id order by trim( l.titre )" ;

    echo json_encode( $bd->query( $sql )->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
