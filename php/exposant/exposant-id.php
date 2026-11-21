
<?php
require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

header("Access-Control-Allow-Origin: http://localhost:8101");
header("Content-Type: application/json; charset=UTF-8");

require_once "../Connexion.php";
require_once "../colonnes.php";

try
{
    $bd = Connexion::getInstance();

    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    if ($id === null || $id === false || $id <= 0)
    {
        http_response_code(400);
        echo json_encode([]);
        exit;
    }

    // tables de base : la vue ne contient que les exposants qui ont au moins une personne
    $exposant = Connexion::$tables["exposant"] ;
    $sql = "select x.id, trim( x.nom ) as nom, x.numLieu, l.nom as nomLieu, l.hall, "
         . colonneOuVide( $bd, $exposant, "x", "libelle", "libelle" ) . ", " . colonneOuVide( $bd, $exposant, "x", "type", "type" )
         . " from " . $exposant . " x left join " . Connexion::$tables["lieu"] . " l on l.num = x.numLieu"
         . " where x.id = :id";

    $cursor = $bd->prepare($sql);
    $cursor->bindValue(":id", $id, PDO::PARAM_INT);
    $cursor->execute();

    $data = $cursor->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
}
catch (PDOException $erreur)
{
    http_response_code(500);
    echo json_encode(["erreur" => "Problème d'accès à la base de données"]);
}
