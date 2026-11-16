<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../config/mot-de-passe.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$donnees = json_decode( file_get_contents( "php://input" ), true ) ;

if( !motDePasseOk( $donnees["mdp"] ?? "" ) )
{
    http_response_code( 403 ) ;
    echo json_encode( ["erreur" => "Mot de passe incorrect"] ) ;
    exit ;
}

$personne = $donnees["personne"] ?? [] ;
$creneaux = $donnees["creneaux"] ?? [] ;
$idLivres = $donnees["idLivres"] ?? [] ;

if( trim( $personne["nom"] ?? "" ) == "" )
{
    http_response_code( 400 ) ;
    echo json_encode( ["erreur" => "Le nom est obligatoire"], JSON_UNESCAPED_UNICODE ) ;
    exit ;
}

// "" venant de l'appli => null dans la BD
function valeur( $valeur )
{
    if( $valeur === null || trim( $valeur ) === "" ) return null ;
    return trim( $valeur ) ;
}

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;
    $bd->beginTransaction() ;

    $tablePersonne = Connexion::$tables["personne"] ;
    $tableExposer = Connexion::$tables["exposer"] ;
    $tableEcrire = Connexion::$tables["ecrire"] ;

    $id = (int)( $personne["id"] ?? -1 ) ;

    if( $id <= 0 )
    {
        // la colonne id n'est pas en auto_increment
        $id = (int)$bd->query( "select coalesce( max( id ), 0 ) + 1 from " . $tablePersonne )->fetchColumn() ;

        $sql = "insert into " . $tablePersonne . " ( id, civilite, prenom, nom, biographie, specialite, photo, type )"
             . " values ( :id, :civilite, :prenom, :nom, :biographie, :specialite, :photo, :type )" ;
    }
    else
    {
        $sql = "update " . $tablePersonne . " set civilite = :civilite, prenom = :prenom, nom = :nom, biographie = :biographie,"
             . " specialite = :specialite, photo = :photo, type = :type where id = :id" ;
    }

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->bindValue( ":civilite", valeur( $personne["civilite"] ?? "" ) ) ;
    $cursor->bindValue( ":prenom", valeur( $personne["prenom"] ?? "" ) ) ;
    $cursor->bindValue( ":nom", valeur( $personne["nom"] ) ) ;
    $cursor->bindValue( ":biographie", valeur( $personne["biographie"] ?? "" ) ) ;
    $cursor->bindValue( ":specialite", valeur( $personne["specialite"] ?? "" ) ) ;
    $cursor->bindValue( ":photo", valeur( $personne["photo"] ?? "" ) ) ;
    $cursor->bindValue( ":type", valeur( $personne["type"] ?? "" ) ) ;
    $cursor->execute() ;

    // on remplace les créneaux et les livres par les nouvelles listes
    $bd->prepare( "delete from " . $tableExposer . " where idPersonne = :id" )->execute( ["id" => $id] ) ;
    $bd->prepare( "delete from " . $tableEcrire . " where idPersonne = :id" )->execute( ["id" => $id] ) ;

    $cursor = $bd->prepare( "insert into " . $tableExposer . " ( idExposant, idPersonne, samedi_am, samedi_pm, dimanche_am, dimanche_pm )"
                          . " values ( :idExposant, :id, :samedi_am, :samedi_pm, :dimanche_am, :dimanche_pm )" ) ;
    $dejaFaits = [] ;
    foreach( $creneaux as $creneau )
    {
        $idExposant = (int)$creneau["idExposant"] ;
        if( in_array( $idExposant, $dejaFaits ) ) continue ;
        $dejaFaits[] = $idExposant ;

        $cursor->execute( [
            "idExposant" => $idExposant,
            "id" => $id,
            "samedi_am" => empty( $creneau["samedi_am"] ) ? 0 : 1,
            "samedi_pm" => empty( $creneau["samedi_pm"] ) ? 0 : 1,
            "dimanche_am" => empty( $creneau["dimanche_am"] ) ? 0 : 1,
            "dimanche_pm" => empty( $creneau["dimanche_pm"] ) ? 0 : 1
        ] ) ;
    }

    $cursor = $bd->prepare( "insert into " . $tableEcrire . " ( idPersonne, idLivre ) values ( :id, :idLivre )" ) ;
    foreach( array_unique( $idLivres ) as $idLivre )
    {
        $cursor->execute( ["id" => $id, "idLivre" => (int)$idLivre] ) ;
    }

    $bd->commit() ;

    echo json_encode( ["id" => $id] ) ;
}
catch( Exception $erreur )
{
    if( isset( $bd ) && $bd->inTransaction() ) $bd->rollBack() ;

    // le couple prenom + nom est unique dans la table
    if( $erreur->getCode() == 23000 && str_contains( $erreur->getMessage(), "1062" ) )
    {
        http_response_code( 400 ) ;
        echo json_encode( ["erreur" => "Cette personne existe déjà"], JSON_UNESCAPED_UNICODE ) ;
        exit ;
    }

    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
