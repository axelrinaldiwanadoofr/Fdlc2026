<?php

// Auteur: Kevin MEYER - 19/11/2026

require_once "../compte/securite.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Envoi de l'affiche ou d'un plan de hall, rangé dans assets/reglages
exigePermission( "reglages.modifier" ) ;
if( !function_exists( "imagecreatefromstring" ) ) refuse( "L'extension GD de PHP n'est pas activée sur le serveur", 500 ) ;

$pour = $_POST["pour"] ?? "" ;
$fichier = $_FILES["image"] ?? null ;
$infos = ( $fichier && $fichier["error"] == UPLOAD_ERR_OK ) ? getimagesize( $fichier["tmp_name"] ) : false ;
$image = $infos ? @imagecreatefromstring( file_get_contents( $fichier["tmp_name"] ) ) : false ;

if( !preg_match( "/^(affiche|plan[0-9])$/", $pour ) ) refuse( "Image inconnue", 400 ) ;
if( !$image || !in_array( $infos[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP] ) || $fichier["size"] > 10 * 1024 * 1024 )
{
    refuse( "Image jpg, png ou webp de 10 Mo maximum", 400 ) ;
}

$dossier = dirname( __DIR__, 2 ) . "/assets/reglages" ;
if( !is_dir( $dossier ) && !@mkdir( $dossier, 0777, true ) ) refuse( "Le dossier assets/reglages ne peut pas être créé sur le serveur", 500 ) ;

// l'image est refaite : plus légère et sans code caché dedans
if( $pour == "affiche" )
{
    $largeur = min( 1200, imagesx( $image ) ) ;
    $copie = imagecreatetruecolor( $largeur, (int)round( imagesy( $image ) * $largeur / imagesx( $image ) ) ) ;
    imagefill( $copie, 0, 0, imagecolorallocate( $copie, 255, 255, 255 ) ) ;
    imagecopyresampled( $copie, $image, 0, 0, 0, 0, imagesx( $copie ), imagesy( $copie ), imagesx( $image ), imagesy( $image ) ) ;
    $nom = "affiche-" . date( "YmdHis" ) . ".jpg" ;
    $ok = imagejpeg( $copie, $dossier . "/" . $nom, 85 ) ;
}
else
{
    imagesavealpha( $image, true ) ;
    $nom = $pour . "-" . date( "YmdHis" ) . ".png" ;
    $ok = imagepng( $image, $dossier . "/" . $nom, 9 ) ;
}

if( !$ok ) refuse( "Impossible d'enregistrer l'image", 500 ) ;

repond( ["chemin" => "assets/reglages/" . $nom] ) ;

?>
