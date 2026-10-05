<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    if( isset($_GET["r-titre"]) )
    {
        $r_titre = "%" . $_GET["r-titre"] . "%" ;

        //$sql = "select id, titre, annee from film where titre like '%" .$_GET["r-titre"]. "%'" ;
        $sql = "select id, titre, annee from film where titre like ?" ;

        $cursor = $bd->prepare( $sql ) ;
        $cursor->bindValue( 1, $r_titre, PDO::PARAM_STR ) ;
        $cursor->execute() ;

        $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

        echo json_encode( $data ) ;
    }
    else
    {
      echo json_encode( [] ) ;  
    } 


}
catch( PDOException $erreur )
{
    $message = $erreur->getMessage() ;
    echo "Probleme d'acces à la BD " . $message ;
}

?>