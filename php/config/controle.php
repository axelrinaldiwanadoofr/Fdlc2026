<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Compte ce qui manque dans la base avant le festival
try
{
    $bd = Connexion::getInstance() ;

    $personne = Connexion::$tables["personne"] ;
    $exposant = Connexion::$tables["exposant"] ;
    $exposer = Connexion::$tables["exposer"] ;
    $livre = Connexion::$tables["livre"] ;
    $ecrire = Connexion::$tables["ecrire"] ;
    $lieu = Connexion::$tables["lieu"] ;
    $evenement = Connexion::$tables["evenement"] ;

    $requetes = [
        "personnesSansPhoto" => "select count(*) from $personne where photo is null or photo = ''",
        "personnesSansBio" => "select count(*) from $personne where biographie is null or biographie = ''",
        "personnesSansStand" => "select count(*) from $personne where specialite = 'auteur' and id not in ( select idPersonne from $exposer )",
        "exposantsSansStand" => "select count(*) from $exposant where numLieu is null",
        "livresSansEditeur" => "select count(*) from $livre where idEditeur is null",
        "livresSansAuteur" => "select count(*) from $livre where id not in ( select idLivre from $ecrire )",
        "lieuxNonPlaces" => "select count(*) from $lieu where x1 is null and num in ( select numLieu from $exposant )",
        "evenementsSansAnimateur" => "select count(*) from $evenement where idAnimateur is null"
    ] ;

    $resultat = [] ;
    foreach( $requetes as $nom => $sql ) $resultat[$nom] = (int)$bd->query( $sql )->fetchColumn() ;

    echo json_encode( $resultat ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
