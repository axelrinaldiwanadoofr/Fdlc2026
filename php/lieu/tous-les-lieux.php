<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select distinct num, nom, type, x1, y1, x2, y2 from " . Connexion::$tables["lieu"] . " where 1 " ;

    if( isset($_GET["nom"])) 
    {
        $sql .= " and nom = :nom " ;
    }

    if( isset($_GET["type"])) 
    {
        $sql .= " and type = :type " ;
    }

    $sql .= " order by nom" ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["nom"]))
    {
        $cursor->bindValue( ":nom", $_GET["nom"], PDO::PARAM_STR ) ;
    }

    if( isset($_GET["type"]))
    {
        $cursor->bindValue( ":type", $_GET["type"], PDO::PARAM_STR ) ;
    }

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( $data ) ;

}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}

?>