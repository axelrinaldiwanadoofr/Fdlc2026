<?php
require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

require_once "../Connexion.php" ;
require_once "evenement-commun.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Choix proposés par les filtres de la page des événements, calculés sur tout le
// programme du festival (vues EvenementProgramme, EvenementPersonne, EvenementLivre) :
// {
//   themes:    [ "L", "J", ... ],
//   types:     [ "GRAND ENTRETIEN", ... ],
//   lieux:      [ { num, nom } ],
//   animateurs: [ { id, nom } ],
//   auteurs:    [ { id, nom } ],   // personnes invitées ou dont un livre est présenté
//   livres:     [ { id, titre } ]
// }
try
{
    $bd = Connexion::getInstance() ;

    $programme = vue( "EvenementProgramme" ) ;
    $festival = " from " . $programme . " as ev where ev.pendantFestival " ;

    $themes = $bd->query( "select distinct ev.theme " . $festival . " and trim( coalesce( ev.theme, '' ) ) <> '' order by ev.theme" )
                 ->fetchAll( PDO::FETCH_COLUMN ) ;

    $types = $bd->query( "select distinct ev.type " . $festival . " and trim( coalesce( ev.type, '' ) ) <> '' order by ev.type" )
                ->fetchAll( PDO::FETCH_COLUMN ) ;

    $lieux = $bd->query( "select distinct ev.numLieu as num, ev.nomLieu as nom " . $festival
                       . " and ev.numLieu is not null order by ev.nomLieu" )->fetchAll( PDO::FETCH_ASSOC ) ;

    $animateurs = $bd->query( "select distinct ev.idAnimateur as id, ev.animateur as nom, ev.nomAnimateur " . $festival
                            . " and ev.idAnimateur is not null order by ev.nomAnimateur, ev.animateur" )->fetchAll( PDO::FETCH_ASSOC ) ;

    $auteurs = $bd->query( "select distinct ep.idPersonne as id,"
                         . " trim( concat( coalesce( ep.prenom, '' ), ' ', coalesce( ep.nom, '' ) ) ) as nom, ep.nom as tri"
                         . " from " . vue( "EvenementPersonne" ) . " as ep"
                         . " inner join " . $programme . " as ev on ev.id = ep.idEvenement"
                         . " where ev.pendantFestival and ep.estAnimateur = 0 order by tri, nom" )->fetchAll( PDO::FETCH_ASSOC ) ;

    $livres = $bd->query( "select distinct el.idLivre as id, trim( el.titre ) as titre"
                        . " from " . vue( "EvenementLivre" ) . " as el"
                        . " inner join " . $programme . " as ev on ev.id = el.idEvenement"
                        . " where ev.pendantFestival order by titre" )->fetchAll( PDO::FETCH_ASSOC ) ;

    $liste = fn( array $lignes, string $libelle ) => array_map(
        fn( $l ) => [ "id" => (int)$l["id"], $libelle => $l[$libelle] ], $lignes ) ;

    echo json_encode( [
        "themes" => $themes,
        "types" => $types,
        "lieux" => array_map( fn( $l ) => [ "num" => (int)$l["num"], "nom" => $l["nom"] ], $lieux ),
        "animateurs" => $liste( $animateurs, "nom" ),
        "auteurs" => $liste( $auteurs, "nom" ),
        "livres" => $liste( $livres, "titre" ),
    ], JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
