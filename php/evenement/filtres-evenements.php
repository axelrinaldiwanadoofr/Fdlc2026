<?php

require_once "../Connexion.php" ;
require_once "evenement-commun.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Choix proposés par les filtres de la page des événements, calculés sur tout le
// programme du festival (samedi, dimanche ou sans date) :
// { themes: [ "GRAND ENTRETIEN", ... ], lieux: [ { num, nom } ], animateurs: [ { id, nom } ] }
try
{
    $bd = Connexion::getInstance() ;

    $evenements = " from " . Connexion::$tables["evenement"] . " as ev " ;

    $themes = $bd->query( "select distinct trim( ev.type ) as t " . $evenements
                        . " where trim( coalesce( ev.type, '' ) ) <> '' " . sqlPendantLeFestival() . " order by t" )
                 ->fetchAll( PDO::FETCH_COLUMN ) ;

    $lieux = $bd->query( "select distinct li.num, li.nom " . $evenements
                       . " inner join " . Connexion::$tables["lieu"] . " as li on li.num = ev.numLieu"
                       . " where 1 " . sqlPendantLeFestival() . " order by li.nom" )->fetchAll( PDO::FETCH_ASSOC ) ;

    $animateurs = $bd->query( "select distinct pe.id, " . SQL_NOM_ANIMATEUR . " as nom, pe.nom as tri " . $evenements
                            . " inner join " . Connexion::$tables["personne"] . " as pe on pe.id = ev.idAnimateur"
                            . " where 1 " . sqlPendantLeFestival() . " order by tri, nom" )->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( [
        "themes" => $themes,
        "lieux" => array_map( fn( $l ) => [ "num" => (int)$l["num"], "nom" => $l["nom"] ], $lieux ),
        "animateurs" => array_map( fn( $a ) => [ "id" => (int)$a["id"], "nom" => $a["nom"] ], $animateurs ),
    ], JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
