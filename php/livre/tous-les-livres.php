<?php

// Connexion à la base de données
require_once "../Connexion.php";

try
{
    // Récupération de la connexion
    $bd = Connexion::getInstance();

    $sql = "select distinct id, titre, resume from " . Connexion::$tables["livre"] . " where 1 " ;

    if( isset($_GET["titre"]))
    {
        $sql .= " and titre = :titre" ;
    }

    if( isset($_GET["resume"]))
    {
        $sql .= " and resume like :resume" ;
    }

    $sql .= " order by titre" ;

    $cursor = $bd->prepare ( $sql ) ;

    // Filtre facultatif sur le titre du livre
    if (isset($_GET["titre"]))
    {
        $sql .= " AND l.titre = :titre";
    }

    // Filtre facultatif sur le résumé du livre
    if (isset($_GET["resume"]))
    {
        $sql .= " AND l.resume LIKE :resume";
    }

    // Nouveau filtre facultatif : livres écrits par une personne
    // La vue PersonneComplete contient les associations
    // entre les personnes et leurs livres
    if (isset($_GET["idPersonne"]))
    {
        $sql .= " AND l.id IN (
                    SELECT idLivre
                    FROM PersonneComplete
                    WHERE id = :idPersonne
                      AND idLivre IS NOT NULL
                  )";
    }

    // Tri alphabétique des livres
    $sql .= " ORDER BY l.titre";

    // Préparation de la requête SQL
    $cursor = $bd->prepare($sql);

    // Association du titre si le filtre est utilisé
    if (isset($_GET["titre"]))
    {
        $cursor->bindValue(
            ":titre",
            $_GET["titre"],
            PDO::PARAM_STR
        );
    }

    // Association du résumé si le filtre est utilisé
    if (isset($_GET["resume"]))
    {
        $cursor->bindValue(
            ":resume",
            "%" . $_GET["resume"] . "%",
            PDO::PARAM_STR
        );
    }

    // Association de l'identifiant de la personne
    if (isset($_GET["idPersonne"]))
    {
        $cursor->bindValue(
            ":idPersonne",
            $_GET["idPersonne"],
            PDO::PARAM_INT
        );
    }

    // Exécution de la requête
    $cursor->execute();

    // Récupération des résultats
    $data = $cursor->fetchAll(PDO::FETCH_ASSOC);

    // Envoi des livres au format JSON
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
}
catch (PDOException $erreur)
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}

?>
