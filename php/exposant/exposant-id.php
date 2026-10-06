<?php

require_once "../Connexion.php" ;

try
{
    if( isset($_GET["id"]) )
    {
        $bd = Connexion::getInstance() ;

        $sql = "select id, nom, numStand from " . Connexion::$tables["exposant"] . " where id = :id";

        $cursor = $bd->prepare( $sql ) ;
        $cursor->bindValue( ":id", intval($_GET["id"]), PDO::PARAM_INT ) ;
        $cursor->execute() ;

        $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

        echo json_encode( $data ) ;
    }

}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}

?>