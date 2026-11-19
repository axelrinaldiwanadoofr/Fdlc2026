<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once "../Connexion.php";

try {
    $bd = Connexion::getInstance();

    $titre = isset($_GET["titre"]) ? trim($_GET["titre"]) : "";

    $sql = "select distinct titre from " . Connexion::$tables["evenement"] . " where titre is not null and titre != ''";

    if ($titre !== "") {
        $sql .= " and titre like :titre";
    }

    $sql .= " order by titre";

    $cursor = $bd->prepare($sql);

    if ($titre !== "") {
        $cursor->bindValue(":titre", "%" . $titre . "%", PDO::PARAM_STR);
    }

    $cursor->execute();

    $data = $cursor->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($data, JSON_UNESCAPED_UNICODE);
} catch (Exception $erreur) {
    http_response_code(500);
    echo json_encode(["erreur" => "Probleme d'acces a la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE);
}
