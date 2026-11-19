<?php
require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

require_once "../Connexion.php" ;
require_once "evenement-commun.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Un événement complet pour la page de détail ([] si l'id n'existe pas) :
// mêmes champs que la vue EvenementLieuAnimateur (type, nomLieu, typeLieu, hall,
// prenomAnimateur, nomAnimateur, specialiteAnimateur...) + champs d'affichage
// (voir formaterEvenement) + livres présentés [ { id, titre, auteurs } ].
// Requête faite sur les tables (left join) : un événement sans lieu (exposition,
// stand...) est aussi trouvé.
try
{
    $bd = Connexion::getInstance() ;

    $id = filter_input( INPUT_GET, "id", FILTER_VALIDATE_INT ) ;

    if( !$id )
    {
        echo json_encode( [] ) ;
        exit ;
    }

    $cursor = $bd->prepare( sqlEvenements() . " and ev.id = :id" ) ;
    $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->execute() ;

    $data = [] ;
    foreach( $cursor->fetchAll( PDO::FETCH_ASSOC ) as $ligne )
    {
        $ev = formaterEvenement( $ligne ) ;

        $livres = $bd->prepare( "select lv.id, lv.titre,"
            . " group_concat( trim( concat( coalesce( au.prenom, '' ), ' ', coalesce( au.nom, '' ) ) ) separator ', ' ) as auteurs"
            . " from " . Connexion::$tables["presenter"] . " as pr"
            . " inner join " . Connexion::$tables["livre"] . " as lv on lv.id = pr.idLivre"
            . " left join " . Connexion::$tables["ecrire"] . " as ec on ec.idLivre = lv.id"
            . " left join " . Connexion::$tables["personne"] . " as au on au.id = ec.idPersonne"
            . " where pr.idEvenement = :id group by lv.id, lv.titre order by lv.titre" ) ;
        $livres->bindValue( ":id", $id, PDO::PARAM_INT ) ;
        $livres->execute() ;

        $ev["livres"] = array_map( fn( $l ) => [ "id" => (int)$l["id"], "titre" => $l["titre"], "auteurs" => $l["auteurs"] ?? "" ],
                                   $livres->fetchAll( PDO::FETCH_ASSOC ) ) ;
        $data[] = $ev ;
    }

    echo json_encode( $data, JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
