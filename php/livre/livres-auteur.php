<?php

// Auteur: Kevin MEYER - 09/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Livres de la base écrits par une personne (table ecrire)
// avec le stand où l'auteur est présent (table exposer)
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select l.id, l.titre, e.nom as editeur, x.id as idExposant, x.nom as nomExposant from " . Connexion::$tables["livre"] . " l"
         . " join " . Connexion::$tables["ecrire"] . " ec on ec.idLivre = l.id"
         . " left join " . Connexion::$tables["editeur"] . " e on e.id = l.idEditeur"
         . " left join " . Connexion::$tables["exposant"] . " x on x.id = ( select min( idExposant ) from "
         . Connexion::$tables["exposer"] . " where idPersonne = ec.idPersonne )"
         . " where ec.idPersonne = :id order by l.titre" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":id", (int)( $_GET["id"] ?? -1 ), PDO::PARAM_INT ) ;
    $cursor->execute() ;

    echo json_encode( $cursor->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
