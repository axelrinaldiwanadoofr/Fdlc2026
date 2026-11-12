<?php

header("Access-Control-Allow-Origin: http://localhost:8101");
header("Content-Type: application/json; charset=UTF-8");

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select distinct idevenement as id, titreevenement as titre, typeevenement as type, debut, date_format(debut,'%H:%i') as heureDebut, nomLieu from " . Connexion::$tables["LivreEditeurPersonneExposantLieu"] . " where 1 " ;

    if( isset($_GET["debut"])) 
    {
        if( isset($_GET["permanent"])) 
            $sql .= " and debut = :debut" ;
        else
            $sql .= " and debut between :debut and :fin" ;
    }

    if( isset($_GET["nomLieu"])) 
    {
        $sql .= " and nomLieu like :nomLieu" ;
    }

    if( isset($_GET["nom"])) 
    {
        $sql .= " and nom like :nom" ;
    }

    if( isset($_GET["titre"])) 
    {
        $sql .= " and titre like :titre" ;
    }

    $sql .= " order by debut" ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["debut"])) 
    {
        if( isset($_GET["permanent"])) 
            $cursor->bindValue( ":debut", $_GET["debut"] . " 00:00:00", PDO::PARAM_STR ) ;
        else
        {
            $cursor->bindValue( ":debut", $_GET["debut"] . " 01:00", PDO::PARAM_STR ) ;
            $cursor->bindValue( ":fin", $_GET["debut"] . " 23:00", PDO::PARAM_STR ) ;
        }
    }

    if( isset($_GET["nom"]))
    {
        $cursor->bindValue( ":nom", "%" . $_GET["nom"] . "%", PDO::PARAM_STR ) ;
    }

    if( isset($_GET["titre"]))
    {
        $cursor->bindValue( ":titre", "%" . $_GET["titre"] . "%", PDO::PARAM_STR ) ;
    }

    if( isset($_GET["nomLieu"]))
    {
        $cursor->bindValue( ":nomLieu", $_GET["nomLieu"] . "%", PDO::PARAM_STR ) ;
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