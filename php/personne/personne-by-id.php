<?php

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

try
{
    $bd = Connexion::getInstance() ;

    // Renvoie la personne dont l'id est passé en paramètre (ou rien si absent)
    $sql = "select id, civilite, prenom, nom, specialite, biographie, photo from " . Connexion::$tables["personne"] . " where id = :id" ;

    $cursor = $bd->prepare( $sql ) ;

    $cursor->bindValue( ":id", isset($_GET["id"]) ? $_GET["id"] : -1, PDO::PARAM_INT ) ;

    $cursor->execute() ;

    $data = $cursor->fetch( PDO::FETCH_ASSOC ) ;

    // Renvoie null si aucune personne ne correspond
    echo json_encode( $data ? $data : null ) ;

}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
