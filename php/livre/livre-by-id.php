<?php
require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

try
{
    $bd = Connexion::getInstance() ;

    if( isset( $_GET["id"] ) )
    {
        $sql = "select idLivre as id, titreLivre as titre, resumeLivre as resume, genreLivre as genre, "
             . "nomEditeur as editeur, nom, prenom, nomExposant "
             . "from " . Connexion::$tables["PersonneComplete"] . " "
             . "where idLivre = :id limit 1" ;

        $cursor = $bd->prepare( $sql ) ;
        $cursor->execute( [ "id" => (int)$_GET["id"] ] ) ;

        $data = $cursor->fetch( PDO::FETCH_ASSOC ) ;
        if( !$data ) $data = null ;
    }
    else
    {
        $data = null ;
    }

    echo json_encode( $data ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>