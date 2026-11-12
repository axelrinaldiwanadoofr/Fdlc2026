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
    $sql = "select ev.id, ev.type as typeevenement, ev.titre, ev.stitre, ev.public, ev.commentaire,"
         . " ev.debut, ev.fin, ev.idAnimateur, ev.numLieu"
         . " from " . Connexion::$tables["evenement"] . " as ev where 1 " ;

    if( isset($_GET["titre"])) $sql .= " and ev.titre like :titre " ;

    if( isset($_GET["debut"])) $sql .= " and ev.debut like :debut " ;

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
    if( isset($_GET["debut"])) $cursor->bindValue( ":debut", $_GET["debut"] . "%", PDO::PARAM_STR ) ;
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

?>
