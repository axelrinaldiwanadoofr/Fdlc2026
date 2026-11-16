<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Toutes les personnes avec les numeros des stands où elles sont présentes
try
{
    $bd = Connexion::getInstance() ;

    $sql = "select p.id, p.civilite, trim( p.prenom ) as prenom, trim( p.nom ) as nom, p.specialite, p.photo, p.type,"
         . " group_concat( distinct x.numLieu order by x.numLieu separator ', ' ) as stands"
         . " from " . Connexion::$tables["personne"] . " p"
         . " left join " . Connexion::$tables["exposer"] . " e on e.idPersonne = p.id"
         . " left join " . Connexion::$tables["exposant"] . " x on x.id = e.idExposant"
         . " group by p.id order by trim( p.nom ), trim( p.prenom )" ;

    echo json_encode( $bd->query( $sql )->fetchAll( PDO::FETCH_ASSOC ), JSON_UNESCAPED_UNICODE ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD " . $erreur->getMessage()], JSON_UNESCAPED_UNICODE ) ;
}

?>
