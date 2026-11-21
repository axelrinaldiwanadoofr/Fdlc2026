<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;
require_once "../colonnes.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$compte = exigePermission( "lieux.modifier" ) ;
$donnees = donneesPost() ;

$lieu = $donnees["lieu"] ?? [] ;
$nouveau = $donnees["nouveau"] ?? false ;
$num = (int)( $lieu["num"] ?? 0 ) ;
$hall = (int)( $lieu["hall"] ?? 0 ) ;

if( $num <= 0 || $hall < 1 || $hall > 5 || empty( $lieu["type"] ) )
{
    http_response_code( 400 ) ;
    echo json_encode( ["erreur" => "Le numéro, le hall et le type sont obligatoires"], JSON_UNESCAPED_UNICODE ) ;
    exit ;
}

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;

    $table = Connexion::$tables["lieu"] ;
    $avecLibelle = colonneExiste( $bd, $table, "libelle" ) ;

    if( $nouveau )
    {
        $cursor = $bd->prepare( "select count(*) from " . $table . " where num = :num" ) ;
        $cursor->bindValue( ":num", $num, PDO::PARAM_INT ) ;
        $cursor->execute() ;

        if( $cursor->fetchColumn() > 0 )
        {
            http_response_code( 400 ) ;
            echo json_encode( ["erreur" => "Le lieu n° " . $num . " existe déjà"], JSON_UNESCAPED_UNICODE ) ;
            exit ;
        }

        $sql = $avecLibelle ? "insert into " . $table . " ( num, nom, libelle, hall, type ) values ( :num, :nom, :libelle, :hall, :type )"
                            : "insert into " . $table . " ( num, nom, hall, type ) values ( :num, :nom, :hall, :type )" ;
    }
    else
    {
        $sql = "update " . $table . " set nom = :nom, " . ( $avecLibelle ? "libelle = :libelle, " : "" ) . "hall = :hall, type = :type where num = :num" ;
    }

    // sans nom on met le numero comme pour les autres stands
    $nom = trim( $lieu["nom"] ?? "" ) ;
    if( $nom == "" ) $nom = (string)$num ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":num", $num, PDO::PARAM_INT ) ;
    $cursor->bindValue( ":nom", $nom ) ;
    if( $avecLibelle ) $cursor->bindValue( ":libelle", trim( $lieu["libelle"] ?? "" ) ) ;
    $cursor->bindValue( ":hall", $hall, PDO::PARAM_INT ) ;
    $cursor->bindValue( ":type", $lieu["type"] ) ;
    $cursor->execute() ;

    echo json_encode( ["num" => $num] ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
