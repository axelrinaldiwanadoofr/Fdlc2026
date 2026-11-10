
<?php
require_once "../Connexion.php";

try
{
    $bd = Connexion::getInstance();

    // La recherche utilise la vue SQL PersonneComplete.
    // DISTINCT évite les doublons liés aux livres,
    // aux exposants et aux événements.
    //
    // Les fiches incomplètes sont masquées uniquement dans la liste.
    // Aucune personne n'est supprimée de la base de données.

    $vue = Connexion::$tables["PersonneComplete"];

    $sql = "SELECT DISTINCT
            p.id,
            p.civilite,
            p.prenom,
            p.nom,
            p.specialite,
            p.biographie,
            p.photo
        FROM " . $vue . " AS p
        WHERE 1
        AND NOT (
            (p.nom IS NULL OR TRIM(p.nom) = '')
            AND (
                p.prenom IS NULL   
                OR TRIM(p.prenom) = ''
                OR TRIM(p.prenom) = 'XX'
            )
        )";

    // Filtres sur les informations de la personne
    if (isset($_GET["id"]))
        $sql .= " AND p.id = :id";

    if (isset($_GET["specialite"]))
        $sql .= " AND p.specialite LIKE :specialite";

    if (isset($_GET["nom"]))
        $sql .= " AND p.nom LIKE :nom";

    // Filtres sur les exposants
    if (isset($_GET["idExposant"]))
        $sql .= " AND p.id IN (
            SELECT id FROM " . $vue . "
            WHERE idExposant = :idExposant
        )";

    if (isset($_GET["nomExposant"]))
        $sql .= " AND p.id IN (
            SELECT id FROM " . $vue . "
            WHERE nomExposant LIKE :nomExposant
        )";

    if (isset($_GET["numLieu"]))
        $sql .= " AND p.id IN (
            SELECT id FROM " . $vue . "
            WHERE numLieu = :numLieu
        )";

    // Filtre sur les livres
    if (isset($_GET["titreLivre"]))
        $sql .= " AND p.id IN (
            SELECT id FROM " . $vue . "
            WHERE titreLivre LIKE :titreLivre
        )";

    // Filtre sur les événements
    if (isset($_GET["titreEvenement"]))
        $sql .= " AND p.id IN (
            SELECT id FROM " . $vue . "
            WHERE titreEvenement LIKE :titreEvenement
        )";

    $sql .= " ORDER BY p.nom, p.prenom";

    $cursor = $bd->prepare($sql);

    // Paramètres des filtres
    if (isset($_GET["id"]))
        $cursor->bindValue(":id", $_GET["id"], PDO::PARAM_INT);

    if (isset($_GET["specialite"]))
        $cursor->bindValue(":specialite", "%" . $_GET["specialite"] . "%", PDO::PARAM_STR);

    if (isset($_GET["nom"]))
        $cursor->bindValue(":nom", "%" . $_GET["nom"] . "%", PDO::PARAM_STR);

    if (isset($_GET["idExposant"]))
        $cursor->bindValue(":idExposant", $_GET["idExposant"], PDO::PARAM_INT);

    if (isset($_GET["nomExposant"]))
        $cursor->bindValue(":nomExposant", "%" . $_GET["nomExposant"] . "%", PDO::PARAM_STR);

    if (isset($_GET["numLieu"]))
        $cursor->bindValue(":numLieu", $_GET["numLieu"], PDO::PARAM_INT);

    if (isset($_GET["titreLivre"]))
        $cursor->bindValue(":titreLivre", "%" . $_GET["titreLivre"] . "%", PDO::PARAM_STR);

    if (isset($_GET["titreEvenement"]))
        $cursor->bindValue(":titreEvenement", "%" . $_GET["titreEvenement"] . "%", PDO::PARAM_STR);

    $cursor->execute();

    $data = $cursor->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
}
catch (PDOException $erreur)
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage();
}
?>