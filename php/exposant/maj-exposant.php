<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;
require_once "../colonnes.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$compte = exigePermission( "exposants.modifier" ) ;
$donnees = donneesPost() ;

$exposant = $donnees["exposant"] ?? [] ;

if( trim( $exposant["nom"] ?? "" ) == "" )
{
    http_response_code( 400 ) ;
    echo json_encode( ["erreur" => "Le nom est obligatoire"], JSON_UNESCAPED_UNICODE ) ;
    exit ;
}

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;

    $table = Connexion::$tables["exposant"] ;
    $id = (int)( $exposant["id"] ?? -1 ) ;

    // libellé et type seulement si la base a ces colonnes
    $colonnes = ["nom", "numLieu"] ;
    if( colonneExiste( $bd, $table, "libelle" ) ) $colonnes[] = "libelle" ;
    if( colonneExiste( $bd, $table, "type" ) ) $colonnes[] = "type" ;

    if( $id <= 0 )
    {
        // la colonne id n'est pas en auto_increment
        $id = (int)$bd->query( "select coalesce( max( id ), 0 ) + 1 from " . $table )->fetchColumn() ;
        $sql = "insert into " . $table . " ( id, " . implode( ", ", $colonnes ) . " ) values ( :id, :" . implode( ", :", $colonnes ) . " )" ;
    }
    else
    {
        $modifs = [] ;
        foreach( $colonnes as $colonne ) $modifs[] = $colonne . " = :" . $colonne ;
        $sql = "update " . $table . " set " . implode( ", ", $modifs ) . " where id = :id" ;
    }

    // -1 = sans stand
    $numLieu = (int)( $exposant["numLieu"] ?? -1 ) ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->bindValue( ":nom", trim( $exposant["nom"] ) ) ;
    if( in_array( "libelle", $colonnes ) ) $cursor->bindValue( ":libelle", trim( $exposant["libelleExposant"] ?? "" ) ) ;
    if( in_array( "type", $colonnes ) ) $cursor->bindValue( ":type", trim( $exposant["type"] ?? "" ) ) ;
    $cursor->bindValue( ":numLieu", $numLieu > 0 ? $numLieu : null, $numLieu > 0 ? PDO::PARAM_INT : PDO::PARAM_NULL ) ;
    $cursor->execute() ;

    echo json_encode( ["id" => $id] ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
