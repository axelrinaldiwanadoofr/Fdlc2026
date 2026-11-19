<?php
require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

require_once "../Connexion.php" ;

try
{
    $id = filter_input( INPUT_GET, "id", FILTER_VALIDATE_INT ) ;
    $reponse = [ "auteurs" => [], "exposants" => [], "evenements" => [] ] ;

    if( $id )
    {
        $bd = Connexion::getInstance() ;
        $t = Connexion::$tables ;

        // Auteurs du livre
        $sql = "select distinct p.id, p.prenom, p.nom from " . $t["ecrire"] . " e "
             . "inner join " . $t["personne"] . " p on p.id = e.idPersonne "
             . "where e.idLivre = :id order by p.nom, p.prenom" ;
        $cursor = $bd->prepare( $sql ) ;
        $cursor->execute( [ ":id" => $id ] ) ;
        $reponse["auteurs"] = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

        // Exposants chez qui se trouvent les auteurs
        $sql = "select distinct ex.id, ex.nom, ex.numLieu from " . $t["ecrire"] . " e "
             . "inner join " . $t["exposer"] . " s on s.idPersonne = e.idPersonne "
             . "inner join " . $t["exposant"] . " ex on ex.id = s.idExposant "
             . "where e.idLivre = :id order by ex.nom" ;
        $cursor = $bd->prepare( $sql ) ;
        $cursor->execute( [ ":id" => $id ] ) ;
        $reponse["exposants"] = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

        // Événements où le livre est présenté
        $sql = "select ev.id, ev.titre, ev.debut, ev.numLieu, ev.type from " . $t["presenter"] . " pr "
             . "inner join " . $t["evenement"] . " ev on ev.id = pr.idevenement "
             . "where pr.idlivre = :id order by ev.debut" ;
        $cursor = $bd->prepare( $sql ) ;
        $cursor->execute( [ ":id" => $id ] ) ;
        $reponse["evenements"] = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;
    }

    echo json_encode( $reponse ) ;
}
catch( PDOException $erreur )
{
    error_log( $erreur->getMessage() ) ;
    http_response_code( 500 ) ;
    echo json_encode( [ "erreur" => "Erreur d'accès à la base de données" ] ) ;
}

?>