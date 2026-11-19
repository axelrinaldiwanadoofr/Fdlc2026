<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

   
   $sql = "select distinct num, nom, libelle, type, hall, x1, y1, x2, y2 from " . Connexion::$tables["lieu"] . " where num=:num " ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["num"]))
    {
        $cursor->bindValue( ":num", $_GET["num"], PDO::PARAM_INT ) ;
    }

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( $data ) ;

}
catch( PDOException $erreur )
{
    error_log( $erreur->getMessage() ) ;
    echo "Probleme d'acces à la BD" ;
}

?>