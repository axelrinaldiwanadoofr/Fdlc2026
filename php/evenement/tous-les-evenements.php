<?php

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Liste des événements, triés par date de début
// Paramètres GET optionnels (cumulés avec AND) :
//   titre        : partie du titre
//   debut        : début de la date/heure de début (ex : "2026-11-14")
//   nomAnimateur : partie du nom de l'animateur
//   titreLivre   : partie du titre d'un livre présenté pendant l'événement
//   numLieu      : numéro du lieu où se déroule l'événement
try
{
    $bd = Connexion::getInstance() ;

    // dans la nouvelle base le type est dans la colonne type (typeevenement est vide)
    $sql = "select 
        ev.id, 
        ev.type as typeevenement, 
        ev.titre, 
        ev.stitre, 
        ev.public, 
        ev.commentaire,
        ev.debut, 
        date_format(ev.debut, '%H:%i') as heuredebut,    
        date_format(ev.debut, '%Y-%m-%d') as jourdebut, 
        ev.idAnimateur, 
        ev.numLieu
        from " . Connexion::$tables["evenement"] . " as ev where 1 " ;

    if( isset($_GET["titre"])) $sql .= " and ev.titre like :titre " ;

    if( isset($_GET["debut"])) $sql .= " and ev.debut >= :debut " ;

    if( isset($_GET["jourdebut"])) $sql .= " and date_format(ev.debut, '%Y-%m-%d') = :jourdebut " ;

    if( isset($_GET["heuredebut"])) $sql .= " and date_format(ev.debut, '%H:%i') = :heuredebut " ;

    if( isset($_GET["numLieu"])) $sql .= " and ev.numLieu = :numLieu " ;

    if( isset($_GET["nomAnimateur"]))
    {
        $sql .= " and exists ( select 1 from " . Connexion::$tables["personne"] . " as p"
              . " where p.id = ev.idAnimateur and p.nom like :nomAnimateur ) " ;
    }

    if( isset($_GET["titreLivre"]))
    {
        $sql .= " and exists ( select 1 from " . Connexion::$tables["presenter"] . " as pr"
              . " inner join " . Connexion::$tables["livre"] . " as li on pr.idLivre = li.id"
              . " where pr.idEvenement = ev.id and li.titre like :titreLivre ) " ;
    }

    $sql .= " order by ev.debut, ev.titre" ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["titre"])) $cursor->bindValue( ":titre", "%" . $_GET["titre"] . "%", PDO::PARAM_STR ) ;
    if( isset($_GET["debut"])) $cursor->bindValue( ":debut", $_GET["debut"], PDO::PARAM_STR ) ;
    if( isset($_GET["jourdebut"])) $cursor->bindValue( ":jourdebut", $_GET["jourdebut"], PDO::PARAM_STR ) ;
    if( isset($_GET["heuredebut"])) $cursor->bindValue( ":heuredebut", $_GET["heuredebut"], PDO::PARAM_STR ) ;
    if( isset($_GET["numLieu"])) $cursor->bindValue( ":numLieu", $_GET["numLieu"], PDO::PARAM_INT ) ;
    if( isset($_GET["nomAnimateur"])) $cursor->bindValue( ":nomAnimateur", "%" . $_GET["nomAnimateur"] . "%", PDO::PARAM_STR ) ;
    if( isset($_GET["titreLivre"])) $cursor->bindValue( ":titreLivre", "%" . $_GET["titreLivre"] . "%", PDO::PARAM_STR ) ;

    $cursor->execute() ;

    echo json_encode( $cursor->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}


/**
 * GET /php/evenement/tous-les-evenements.php
 * Renvoie tous les événements au format JSON (tableau, y compris si vide).
 * Colonnes compatibles avec le modèle Evenement : id, titre, type,
 * debut, fin, commentaire, idLieu, idAnimateur, lieu, animateur.
 */
/*
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET');
    http_response_code(405);
    echo json_encode(['erreur' => 'Méthode non autorisée'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Le projet utilise Connexion.php après configuration du serveur.
// Dans le ZIP master, seul Connexion_local.php est présent.
$fichierConnexion = __DIR__ . '/../Connexion.php';
if (!is_file($fichierConnexion)) {
    $fichierConnexion = __DIR__ . '/../Connexion_local.php';
}
require_once $fichierConnexion;

try {
    $bd = Connexion::getInstance();
    $bd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // SQL basé sur les noms réels de colonnes de fdlc.sql (pas sur une vue
    // encore attribuée à un autre membre du groupe).
    $sql = 'SELECT e.id, e.titre, e.stitre, e.typeevenement AS type,
                   e.typeevenement, e.public, e.debut, e.fin,
                   e.commentaire, e.numLieu AS idLieu, e.numLieu,
                   e.idAnimateur, l.nom AS lieu,
                   TRIM(CONCAT_WS(" ", p.prenom, p.nom)) AS animateur
            FROM evenement AS e
            LEFT JOIN lieu AS l ON l.num = e.numLieu
            LEFT JOIN personne AS p ON p.id = e.idAnimateur
            ORDER BY e.debut ASC, e.titre ASC, e.id ASC';

    $requete = $bd->prepare($sql);
    $requete->execute();
    echo json_encode($requete->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
} catch (Throwable $erreur) {
    // Ne pas divulguer les identifiants SQL ni les détails du serveur aux utilisateurs.
    error_log('tous-les-evenements.php : ' . $erreur->getMessage());
    http_response_code(500);
    echo json_encode(['erreur' => 'Impossible de charger les événements'], JSON_UNESCAPED_UNICODE);
}
*/

?>