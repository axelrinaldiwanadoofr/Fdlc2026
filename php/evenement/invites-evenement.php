<?php
// Invités spécifiques d'un événement, via la table invite.
// GET : id (identifiant de l'événement)
header('Content-Type: application/json; charset=utf-8');
require_once '../Connexion.php';

try {
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    if (!$id || $id < 1) {
        http_response_code(400);
        echo json_encode([]);
        exit;
    }

    $bd = Connexion::getInstance();
    $bd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Les alias correspondent aux noms locaux ou préfixés du serveur du professeur.
    $tableEvenement = Connexion::$tables['evenement'] ?? 'evenement';
    $tablePersonne = Connexion::$tables['personne'] ?? 'personne';
    $prefixe = (strpos($tableEvenement, 'fdlc_') === 0 || strpos($tablePersonne, 'fdlc_') === 0) ? 'fdlc_' : '';
    $tableInvite = Connexion::$tables['invite'] ?? ($prefixe . 'invite');

    $sql = "SELECT DISTINCT p.id, p.civilite, p.prenom, p.nom, p.specialite, p.photo
            FROM {$tableInvite} AS i
            INNER JOIN {$tablePersonne} AS p ON p.id = i.idpersonne
            WHERE i.idevenement = :id
            ORDER BY p.nom, p.prenom";

    $requete = $bd->prepare($sql);
    $requete->bindValue(':id', $id, PDO::PARAM_INT);
    $requete->execute();
    echo json_encode($requete->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
} catch (Throwable $erreur) {
    error_log('invites-evenement.php : ' . $erreur->getMessage());
    http_response_code(500);
    echo json_encode(['erreur' => 'Impossible de charger les invités'], JSON_UNESCAPED_UNICODE);
}
