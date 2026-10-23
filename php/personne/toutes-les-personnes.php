<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select distinct id, civilite, prenom, nom, specialite, biographie, photo from " . Connexion::$tables["personne"] . " order by nom, prenom";

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