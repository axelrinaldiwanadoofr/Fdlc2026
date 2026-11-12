
<?php

/*
 * Fichier : toutes-les-personnes.php
 *
 * Objectif :
 * Récupérer la liste des personnes depuis la vue SQL
 * PersonneComplete, en appliquant les filtres demandés.
 */

// Importation de la classe qui gère la connexion à MySQL.
require_once "../Connexion.php";

try
{
    // Récupération de la connexion à la base de données.
    $bd = Connexion::getInstance();

    // Récupération du nom de la vue depuis Connexion.php.
    $vue = Connexion::$tables["PersonneComplete"];

    /*
     * Construction de la requête principale.
     *
     * DISTINCT évite de retourner plusieurs fois la même
     * personne lorsqu'elle possède plusieurs livres,
     * exposants ou événements.
     *
     * WHERE 1 permet d'ajouter facilement des conditions AND.
     */
    /*
 * Récupération des personnes depuis la vue PersonneComplete.
 *
 * DISTINCT évite les doublons.
 *
 * Les personnes sans nom et dont le prénom est vide
 * ou égal à XX sont masquées dans la liste.
 *
 * Les données restent conservées dans la base fdlc.
 */
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

    /*
     * FILTRES SUR LA PERSONNE
     */

    // Recherche d'une personne à partir de son identifiant.
    if (isset($_GET["id"]))
    {
        $sql .= " AND p.id = :id";
    }

    // Recherche des personnes ayant une spécialité donnée.
    if (isset($_GET["specialite"]))
    {
        $sql .= " AND p.specialite LIKE :specialite";
    }

    // Recherche des personnes dont le nom contient une valeur.
    if (isset($_GET["nom"]))
    {
        $sql .= " AND p.nom LIKE :nom";
    }

    /*
     * FILTRES SUR LES EXPOSANTS
     *
     * Les sous-requêtes IN recherchent les identifiants
     * des personnes correspondant à chaque critère.
     *
     * Cela permet de conserver le fonctionnement des
     * anciens filtres sans utiliser AND EXISTS.
     */

    // Personnes associées à un exposant précis.
    if (isset($_GET["idExposant"]))
    {
        $sql .= " AND p.id IN (
            SELECT id
            FROM " . $vue . "
            WHERE idExposant = :idExposant
        )";
    }

    // Personnes associées à un exposant dont le nom correspond.
    if (isset($_GET["nomExposant"]))
    {
        $sql .= " AND p.id IN (
            SELECT id
            FROM " . $vue . "
            WHERE nomExposant LIKE :nomExposant
        )";
    }

    // Personnes présentes chez un exposant situé au lieu demandé.
    if (isset($_GET["numLieu"]))
    {
        $sql .= " AND p.id IN (
            SELECT id
            FROM " . $vue . "
            WHERE numLieu = :numLieu
        )";
    }

    /*
     * FILTRE SUR LES LIVRES
     */

    // Personnes ayant écrit un livre dont le titre correspond.
    if (isset($_GET["titreLivre"]))
    {
        $sql .= " AND p.id IN (
            SELECT id
            FROM " . $vue . "
            WHERE titreLivre LIKE :titreLivre
        )";
    }

    /*
     * FILTRE SUR LES ÉVÉNEMENTS
     */

    // Personnes animant un événement dont le titre correspond.
    if (isset($_GET["titreEvenement"]))
    {
        $sql .= " AND p.id IN (
            SELECT id
            FROM " . $vue . "
            WHERE titreEvenement LIKE :titreEvenement
        )";
    }

    // Classement alphabétique par nom, puis par prénom.
    $sql .= " ORDER BY p.nom, p.prenom";

    /*
     * PRÉPARATION DE LA REQUÊTE
     *
     * Les paramètres nommés permettent de transmettre
     * les valeurs sans les insérer directement dans le SQL.
     */
    $cursor = $bd->prepare($sql);

    // Association des valeurs aux paramètres SQL.
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

    /*
     * EXÉCUTION ET RÉSULTAT
     */

    // Exécution de la requête SQL.
    $cursor->execute();

    // Récupération des personnes sous forme de tableau associatif.
    $data = $cursor->fetchAll(PDO::FETCH_ASSOC);

    // Indication que la réponse contient du JSON.
    header("Content-Type: application/json; charset=utf-8");

    // Conversion du tableau PHP en JSON.
    // JSON_UNESCAPED_UNICODE conserve les accents lisibles.
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
}
catch (PDOException $erreur)
{
    // Affichage d'un message en cas d'erreur de base de données.
    echo "Problème d'accès à la BD : " . $erreur->getMessage();
}

?>
