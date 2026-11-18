<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../Connexion.php" ;
require_once "../compte/securite.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

$compte = exigePermission( "annonces.modifier" ) ;
$donnees = donneesPost() ;

$annonce = $donnees["annonce"] ?? [] ;

if( trim( $annonce["texte"] ?? "" ) == "" )
{
    http_response_code( 400 ) ;
    echo json_encode( ["erreur" => "Le texte est obligatoire"], JSON_UNESCAPED_UNICODE ) ;
    exit ;
}

// "2026-11-21T14:30:00" => "2026-11-21 14:30:00", vide => null
function dateBd( $date )
{
    if( empty( $date ) ) return null ;
    return substr( str_replace( "T", " ", $date ), 0, 19 ) ;
}

try
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;

    $table = Connexion::$tables["annonce"] ;

    // la table est créée à la première annonce (on n'a pas accès à la base du serveur)
    $bd->exec( "create table if not exists " . $table . " ( id int not null auto_increment primary key, texte varchar(300) not null,"
             . " couleur varchar(20) not null default 'primary', debut datetime default null, fin datetime default null,"
             . " active tinyint(1) not null default 1 )" ) ;
    $id = (int)( $annonce["id"] ?? -1 ) ;

    if( $id <= 0 )
        $sql = "insert into " . $table . " ( texte, couleur, debut, fin, active ) values ( :texte, :couleur, :debut, :fin, :active )" ;
    else
        $sql = "update " . $table . " set texte = :texte, couleur = :couleur, debut = :debut, fin = :fin, active = :active where id = :id" ;

    $cursor = $bd->prepare( $sql ) ;
    if( $id > 0 ) $cursor->bindValue( ":id", $id, PDO::PARAM_INT ) ;
    $cursor->bindValue( ":texte", trim( $annonce["texte"] ) ) ;
    $cursor->bindValue( ":couleur", in_array( $annonce["couleur"] ?? "", ["primary", "warning", "danger"] ) ? $annonce["couleur"] : "primary" ) ;
    $cursor->bindValue( ":debut", dateBd( $annonce["debut"] ?? "" ) ) ;
    $cursor->bindValue( ":fin", dateBd( $annonce["fin"] ?? "" ) ) ;
    $cursor->bindValue( ":active", empty( $annonce["active"] ) ? 0 : 1, PDO::PARAM_INT ) ;
    $cursor->execute() ;

    echo json_encode( ["ok" => true] ) ;
}
catch( Exception $erreur )
{
    http_response_code( 500 ) ;
    error_log( $erreur->getMessage() ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>
