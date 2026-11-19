<?php

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select distinct num, nom, libelle, type, x1, y1, x2, y2 from " . Connexion::$tables["lieu"] . " where num=:num " ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["num"]))
    {
        $cursor->bindValue( ":num", $_GET["num"], PDO::PARAM_INT ) ;
    }

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( $data ) ;

}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>