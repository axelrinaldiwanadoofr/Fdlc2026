<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Une personne avec ses créneaux sur les stands et ses livres
try
{
    $bd = Connexion::getInstance() ;
    $id = (int)( $_GET["id"] ?? -1 ) ;

    $cursor = $bd->prepare( "select id, civilite, prenom, nom, biographie, specialite, photo, type from "
                          . Connexion::$tables["personne"] . " where id = :id" ) ;
    $cursor->execute( ["id" => $id] ) ;
    $personne = $cursor->fetch( PDO::FETCH_ASSOC ) ;

    $cursor = $bd->prepare( "select e.idExposant, trim( x.nom ) as nomExposant, x.numLieu, e.samedi_am, e.samedi_pm, e.dimanche_am, e.dimanche_pm"
                          . " from " . Connexion::$tables["exposer"] . " e"
                          . " join " . Connexion::$tables["exposant"] . " x on x.id = e.idExposant"
                          . " where e.idPersonne = :id order by x.numLieu" ) ;
    $cursor->execute( ["id" => $id] ) ;
    $creneaux = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    $cursor = $bd->prepare( "select idLivre from " . Connexion::$tables["ecrire"] . " where idPersonne = :id" ) ;
    $cursor->execute( ["id" => $id] ) ;
    $idLivres = array_map( "intval", $cursor->fetchAll( PDO::FETCH_COLUMN ) ) ;

    echo json_encode( ["personne" => $personne, "creneaux" => $creneaux, "idLivres" => $idLivres], JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
