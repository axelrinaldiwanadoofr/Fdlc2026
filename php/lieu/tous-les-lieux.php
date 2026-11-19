<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "select distinct l.num, l.nom, l.libelle, l.hall, l.type, l.x1, l.y1, l.x2, l.y2 from " . Connexion::$tables["lieu"] . " as l where 1 " ;

    if( isset($_GET["nom"]))
    {
        $sql .= " and ( l.nom like :nom or l.libelle like :libelle or l.num like :num ) " ;
    }

    if( isset($_GET["type"]))
    {
        $sql .= " and l.type = :type " ;
    }

    // Seulement les lieux où il y a au moins un exposant
    if( isset($_GET["avecExposant"]))
    {
        $sql .= " and l.num in ( select numLieu from " . Connexion::$tables["exposant"] . " ) " ;
    }

    // Lieux hébergeant un exposant dont le nom contient la valeur
    if( isset($_GET["nomExposant"]))
    {
        $sql .= " and exists ( select 1 from " . Connexion::$tables["exposant"] . " as ex"
              . " where ex.numLieu = l.num and ex.nom like :nomExposant ) " ;
    }

    // Lieux où est présente une personne dont le nom contient la valeur
    if( isset($_GET["nomPersonne"]))
    {
        $sql .= " and exists ( select 1 from " . Connexion::$tables["exposant"] . " as ex"
              . " inner join " . Connexion::$tables["exposer"] . " as ser on ser.idExposant = ex.id"
              . " inner join " . Connexion::$tables["personne"] . " as p on ser.idPersonne = p.id"
              . " where ex.numLieu = l.num and p.nom like :nomPersonne ) " ;
    }

    // Lieux où se déroule un événement dont le titre contient la valeur
    if( isset($_GET["titreEvenement"]))
    {
        $sql .= " and exists ( select 1 from " . Connexion::$tables["evenement"] . " as ev"
              . " where ev.numLieu = l.num and ev.titre like :titreEvenement ) " ;
    }

    $sql .= " order by l.nom" ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["nom"]))
    {
        $cursor->bindValue( ":nom", "%" . $_GET["nom"] . "%", PDO::PARAM_STR ) ;
        $cursor->bindValue( ":libelle", "%" . $_GET["nom"] . "%", PDO::PARAM_STR ) ;
        $cursor->bindValue( ":num", $_GET["nom"] . "%", PDO::PARAM_STR ) ;
    }

    if( isset($_GET["type"]))
    {
        $cursor->bindValue( ":type", $_GET["type"], PDO::PARAM_STR ) ;
    }

    if( isset($_GET["nomExposant"])) $cursor->bindValue( ":nomExposant", "%" . $_GET["nomExposant"] . "%", PDO::PARAM_STR ) ;
    if( isset($_GET["nomPersonne"])) $cursor->bindValue( ":nomPersonne", "%" . $_GET["nomPersonne"] . "%", PDO::PARAM_STR ) ;
    if( isset($_GET["titreEvenement"])) $cursor->bindValue( ":titreEvenement", "%" . $_GET["titreEvenement"] . "%", PDO::PARAM_STR ) ;

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( $data ) ;

}
catch( PDOException $erreur )
{
    error_log( $erreur->getMessage() ) ;
    echo "Probleme d'acces à la BD" ;
}

?>