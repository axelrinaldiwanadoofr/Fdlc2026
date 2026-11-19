<?php
// API de liste d'evenements - recherche combinee (AND).
require_once __DIR__ . '/../Connexion.php';
header('Content-Type: application/json; charset=utf-8');

try {
    $bd = Connexion::getInstance();
    $bd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Respecte les noms de tables propres au serveur (fdlc_*) et les aliases officiels.
    $tableEvenement = Connexion::$tables['evenement'] ?? 'evenement';
    $tablePersonne = Connexion::$tables['personne'] ?? 'personne';
    $prefixe = (strpos($tableEvenement, 'fdlc_') === 0 || strpos($tablePersonne, 'fdlc_') === 0) ? 'fdlc_' : '';
    $vue = Connexion::$tables['EvenementLieuAnimateur'] ?? ($prefixe . 'EvenementLieuAnimateur');
    $tablePresenter = Connexion::$tables['presenter'] ?? ($prefixe . 'presenter');
    $tableLivre = Connexion::$tables['livre'] ?? ($prefixe . 'livre');

    $sql = "SELECT ev.id, ev.type, ev.type AS typeevenement,
                   ev.titre, ev.stitre, ev.public, ev.commentaire,
                   ev.debut, ev.fin,
                   DATE_FORMAT(ev.debut, '%H:%i') AS heuredebut,
                   DATE_FORMAT(ev.debut, '%Y-%m-%d') AS jourdebut,
                   ev.idAnimateur, ev.nomAnimateur, ev.prenomAnimateur,
                   ev.specialiteAnimateur, ev.numLieu, ev.nomLieu, ev.theme
            FROM `$vue` AS ev WHERE 1 = 1";
    $parametres = [];

    foreach (['titre' => 'ev.titre', 'nomAnimateur' => 'ev.nomAnimateur'] as $param => $champ) {
        if (isset($_GET[$param]) && trim($_GET[$param]) !== '') {
            $sql .= " AND $champ LIKE :$param";
            $parametres[$param] = '%' . trim($_GET[$param]) . '%';
        }
    }
    foreach (['debut' => 'ev.debut', 'jourdebut' => "DATE_FORMAT(ev.debut, '%Y-%m-%d')", 'heuredebut' => "DATE_FORMAT(ev.debut, '%H:%i')", 'numLieu' => 'ev.numLieu', 'type' => 'ev.type', 'theme' => 'ev.theme'] as $param => $champ) {
        if (isset($_GET[$param]) && trim((string)$_GET[$param]) !== '' && $_GET[$param] !== '-1') {
            $operateur = $param === 'debut' ? '>=' : '=';
            $sql .= " AND $champ $operateur :$param";
            $parametres[$param] = $_GET[$param];
        }
    }

    // Eviter un JOIN qui multiplierait les evenements ayant plusieurs livres.
    if (isset($_GET['titreLivre']) && trim($_GET['titreLivre']) !== '') {
        $sql .= " AND EXISTS (
                    SELECT 1 FROM `$tablePresenter` AS pr
                    INNER JOIN `$tableLivre` AS li ON li.id = pr.idlivre
                    WHERE pr.idevenement = ev.id AND li.titre LIKE :titreLivre
                  )";
        $parametres['titreLivre'] = '%' . trim($_GET['titreLivre']) . '%';
    }

    $sql .= ' ORDER BY ev.debut ASC, ev.titre ASC';
    $requete = $bd->prepare($sql);
    foreach ($parametres as $nom => $valeur) {
        $requete->bindValue(':' . $nom, $valeur, $nom === 'numLieu' ? PDO::PARAM_INT : PDO::PARAM_STR);
    }
    $requete->execute();
    echo json_encode($requete->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
} catch (Throwable $erreur) {
    error_log('tous-les-evenements.php : ' . $erreur->getMessage());
    http_response_code(500);
    echo json_encode(['erreur' => "Probleme d'acces a la BD"], JSON_UNESCAPED_UNICODE);
}
