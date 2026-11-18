<?php

require_once "../Connexion.php";

try
{
    $bd = Connexion::getInstance();

    $sql = "select distinct titre from " . Connexion::$tables["evenement"]
         . " where titre is not null and titre != ''"
         . " order by titre";

    if( isset( $_GET["titre"] ) && $_GET["titre"] !== "" )
    {
        $sql = "select distinct titre from " . Connexion::$tables["evenement"]
             . " where titre is not null and titre like :titre"
             . " order by titre";
        $cursor = $bd->prepare( $sql );
        $cursor->bindValue( ":titre", "%" . $_GET["titre"] . "%", PDO::PARAM_STR );
    }
    else
    {
        $cursor = $bd->prepare( $sql );
    }

    $cursor->execute();

    $data = $cursor->fetchAll( PDO::FETCH_COLUMN );

    header( "Content-Type: application/json; charset=utf-8" );
    echo json_encode( $data, JSON_UNESCAPED_UNICODE );
}
catch( PDOException $erreur )
{
    error_log( $erreur->getMessage() );
    http_response_code( 500 );
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE );
}

?>
