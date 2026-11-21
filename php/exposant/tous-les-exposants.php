<?php
require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

header("Access-Control-Allow-Origin: http://localhost:8101");
header("Content-Type: application/json; charset=UTF-8");

require_once "../Connexion.php" ;
require_once "../colonnes.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $exposant = Connexion::$tables["exposant"] ;
    $exposer = Connexion::$tables["exposer"] ;

    // Les créneaux de présence n'ont de sens que pour une personne
    $creneaux = isset($_GET["idPersonne"]) ? ", ser.samedi_am, ser.samedi_pm, ser.dimanche_am, ser.dimanche_pm" : "" ;

    // Exposants qui ont un stand (tables de base : la vue n'a pas les mêmes colonnes dans toutes les bases)
    $sql = "SELECT DISTINCT
                ex.id,
                trim( ex.nom ) AS nom,
                " . colonneOuVide( $bd, $exposant, "ex", "libelle", "libelle" ) . ",
                " . colonneOuVide( $bd, $exposant, "ex", "type", "type" ) . ",
                l.nom AS nomLieu,
                ex.numLieu" . $creneaux . "
            FROM " . $exposant . " AS ex
            INNER JOIN " . Connexion::$tables["lieu"] . " AS l ON l.num = ex.numLieu " ;

    // Exposants associés à une personne
    if( isset($_GET["idPersonne"]))
    {
        $sql .= " INNER JOIN " . $exposer . " AS ser ON ser.idExposant = ex.id AND ser.idPersonne = :idPersonne " ;
    }

    $sql .= " WHERE 1 " ;

    // Exposants où est présente une personne de ce nom
    if( isset($_GET["nom"])) 
    {
        $sql .= " and exists ( select 1 from " . $exposer . " AS s INNER JOIN " . Connexion::$tables["personne"] . " AS p ON p.id = s.idPersonne"
              . " where s.idExposant = ex.id and p.nom = :nom ) " ;
    }

    if( isset($_GET["nomLieu"])) 
    {
        $sql .= " and l.nom like :nomLieu " ;
    }

    $sql .= " order by trim( ex.nom )" ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["nom"]))
    {
        $cursor->bindValue( ":nom", $_GET["nom"], PDO::PARAM_STR ) ;
    }

    if( isset($_GET["nomLieu"]))
    {
        $cursor->bindValue( ":nomLieu", $_GET["nomLieu"] . "%", PDO::PARAM_STR ) ;
    }

    if( isset($_GET["idPersonne"]))
    {
        $cursor->bindValue( ":idPersonne", (int) $_GET["idPersonne"], PDO::PARAM_INT ) ;
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