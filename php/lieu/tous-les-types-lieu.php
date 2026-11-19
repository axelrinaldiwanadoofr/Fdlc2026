<?php

// Renvoie au format JSON la liste des types de lieu (table typelieu)
// Paramètre GET optionnel : type => début du type recherché (recherche avec like)
// Exemple de résultat : [{"type":"restaurant"},{"type":"stand"}]

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select type from " . Connexion::$tables["typelieu"] . " where 1 " ;

    if( isset($_GET["type"])) 
    {
        $sql .= " and type like :type " ;
    }

    $sql .= " order by type" ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["type"]))
    {
        $cursor->bindValue( ":type", $_GET["type"] . "%", PDO::PARAM_STR ) ;
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
