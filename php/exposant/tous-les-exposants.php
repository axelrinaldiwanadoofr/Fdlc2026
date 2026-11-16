<?php

header("Access-Control-Allow-Origin: http://localhost:8101");
header("Content-Type: application/json; charset=UTF-8");

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    // Les créneaux de présence n'ont de sens que pour une personne
    $creneaux = isset($_GET["idPersonne"]) ? ", samedi_am, samedi_pm, dimanche_am, dimanche_pm" : "" ;

    // Récupérer les exposants et leurs créneaux de présence
    $sql = "SELECT DISTINCT
                idExposant AS id,
                trim( nomExposant ) AS nom,
                libelleExposant as libelle,
                typeExposant as type,
                nomLieu,
                numLieu" . $creneaux . "
            FROM " . Connexion::$tables["PersonneExposantExposerLieu"] . "
            WHERE 1 " ;
            
    if( isset($_GET["nom"])) 
    {
        $sql .= " and nom = :nom " ;
    }

    if( isset($_GET["nomLieu"])) 
    {
        $sql .= " and nomLieu like :nomLieu " ;
    }

    // Filtrer les exposants associés à une personne
    if( isset($_GET["idPersonne"]))
    {
        $sql .= " and idPersonne = :idPersonne " ;
    }

    $sql .= " order by trim( nomExposant )" ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["nom"]))
    {
        $cursor->bindValue( ":nom", $_GET["nom"], PDO::PARAM_STR ) ;
    }

    if( isset($_GET["nomLieu"]))
    {
        $cursor->bindValue( ":nomLieu", $_GET["nomLieu"] . "%", PDO::PARAM_STR ) ;
    }

    // Associer l'identifiant de la personne au paramètre SQL
    if( isset($_GET["idPersonne"]))
    {
        $cursor->bindValue( ":idPersonne", (int) $_GET["idPersonne"], PDO::PARAM_INT ) ;
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