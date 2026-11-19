<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once "../Connexion.php";

try {
    $bd = Connexion::getInstance();

    $sql = "select distinct specialite from " . Connexion::$tables["specialite"] . " where specialite is not null and specialite != '' order by specialite";

    $cursor = $bd->prepare($sql);
    $cursor->execute();

    $data = $cursor->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($data, JSON_UNESCAPED_UNICODE);
} catch (Exception $erreur) {
    http_response_code(500);
    echo json_encode(["erreur" => "Probleme d'acces a la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE);
}
