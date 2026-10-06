<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select id, nom, numStand from " . Connexion::$tables["exposant"] . " order by nom";

    $cursor = $bd->prepare( $sql ) ;
    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( $data ) ;

}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}

?>