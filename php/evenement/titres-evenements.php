<?php

header('Access-Control-Allow-Origin: http://localhost:8101');
header('Content-Type: application/json; charset=utf-8');

require_once '../Connexion.php';

try {
    $connexion = Connexion::getInstance();

    $sql = "SELECT DISTINCT titre
            FROM evenement
            WHERE titre IS NOT NULL
            ORDER BY titre";

    $requete = $connexion->prepare($sql);
    $requete->execute();

    $titres = $requete->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($titres, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'erreur' => 'Impossible de récupérer les titres des événements.'
    ]);
}
