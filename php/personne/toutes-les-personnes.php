<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;


    $sql = "select distinct id, civilite, prenom, nom, specialite, biographie, photo from " . Connexion::$tables["personne"] . " where 1 ";

    if( isset($_GET["nom"])) $sql .= " and nom like :nom " ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["nom"])) $cursor->bindValue( ":nom", "%" . $_GET["nom"] . "%", PDO::PARAM_STR ) ;

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( $data ) ;

}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}

?>