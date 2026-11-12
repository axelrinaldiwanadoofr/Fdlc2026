<?php

require_once "../Connexion.php" ;

try
{
    $bd = Connexion::getInstance() ;

    // Borne inférieure facultative : on ne garde que les débuts >= à cette valeur
    $debutMin = "1000-01-01 00:00:00" ;
    if( isset( $_GET["debut"] ) && $_GET["debut"] !== "" )
    {
        $debutMin = $_GET["debut"] ;
    }

    // Début de la date saisie par l'utilisateur (facultatif)
    $texte = "" ;
    if( isset( $_GET["texte"] ) )
    {
        $texte = $_GET["texte"] ;
    }
    $texte .= "%" ;

    $sql = "select distinct debut from " . Connexion::$tables["evenement"]
         . " where debut is not null and debut >= :debut and cast( debut as char ) like :texte"
         . " order by debut" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->execute( [ "debut" => $debutMin, "texte" => $texte ] ) ;

    // FETCH_COLUMN : tableau simple de chaînes ["2026-11-21 10:00:00", ...]
    $data = $cursor->fetchAll( PDO::FETCH_COLUMN ) ;

    echo json_encode( $data ) ;
}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}

?>