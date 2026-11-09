<?php

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Livres de la base écrits par une personne (table ecrire)
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select l.id, l.titre, e.nom as editeur from " . Connexion::$tables["livre"] . " l"
         . " join " . Connexion::$tables["ecrire"] . " ec on ec.idLivre = l.id"
         . " left join " . Connexion::$tables["editeur"] . " e on e.id = l.idEditeur"
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
