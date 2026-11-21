<?php
require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

require_once "../Connexion.php" ;
require_once "evenement-commun.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Un événement complet pour la page de détail ([] si l'id n'existe pas) :
// colonnes de la vue EvenementProgramme mises en forme (voir formaterEvenement) +
//   invites : personnes invitées ou dont un livre est présenté [ { id, nom, specialite } ]
//   livres  : livres liés [ { id, titre, origine } ]
// La vue fait des left join : un événement sans lieu (exposition, stand...) est aussi trouvé.
try
{
    $bd = Connexion::getInstance() ;

    $id = filter_input( INPUT_GET, "id", FILTER_VALIDATE_INT ) ;

    if( !$id )
    {
        echo json_encode( [] ) ;
        exit ;
    }

    $cursor = $bd->prepare( "select * from " . vue( "EvenementProgramme" ) . " where id = :id" ) ;
    $cursor->execute( [ "id" => $id ] ) ;

    $data = [] ;
    foreach( $cursor->fetchAll( PDO::FETCH_ASSOC ) as $ligne )
    {
        $ev = formaterEvenement( $ligne ) ;

        $invites = $bd->prepare( "select distinct idPersonne as id,"
            . " trim( concat( coalesce( prenom, '' ), ' ', coalesce( nom, '' ) ) ) as nom, specialite"
            . " from " . vue( "EvenementPersonne" ) . " where idEvenement = :id and estAnimateur = 0 order by nom" ) ;
        $invites->execute( [ "id" => $id ] ) ;
        $ev["invites"] = array_map( fn( $p ) => [ "id" => (int)$p["id"], "nom" => $p["nom"], "specialite" => $p["specialite"] ?? "" ],
                                    $invites->fetchAll( PDO::FETCH_ASSOC ) ) ;

        $livres = $bd->prepare( "select idLivre as id, trim( titre ) as titre, origine"
            . " from " . vue( "EvenementLivre" ) . " where idEvenement = :id order by titre" ) ;
        $livres->execute( [ "id" => $id ] ) ;
        $ev["livres"] = array_map( fn( $l ) => [ "id" => (int)$l["id"], "titre" => $l["titre"], "origine" => $l["origine"] ],
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
