<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "../config/mot-de-passe.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

// Envoi d'une photo de profil, elle est rangée avec les autres dans assets/photos
if( !motDePasseOk( $_POST["mdp"] ?? "" ) )
{
    http_response_code( 403 ) ;
    echo json_encode( ["erreur" => "Mot de passe incorrect"] ) ;
    exit ;
}

$fichier = $_FILES["photo"] ?? null ;
$extensions = [ IMAGETYPE_JPEG => "jpg", IMAGETYPE_PNG => "png", IMAGETYPE_WEBP => "webp" ] ;
$infos = ( $fichier && $fichier["error"] == UPLOAD_ERR_OK ) ? getimagesize( $fichier["tmp_name"] ) : false ;

if( !$infos || !isset( $extensions[$infos[2]] ) || $fichier["size"] > 5 * 1024 * 1024 )
{
    http_response_code( 400 ) ;
    echo json_encode( ["erreur" => "Image jpg, png ou webp de 5 Mo maximum"], JSON_UNESCAPED_UNICODE ) ;
    exit ;
}

$dossier = dirname( __DIR__, 2 ) . "/assets/photos" ;
if( !is_dir( $dossier ) ) mkdir( $dossier, 0777, true ) ;

$nom = "photo-" . date( "YmdHis" ) . "-" . rand( 100, 999 ) ;

// on refait l'image en jpg de 400 px max : plus légère, et tout ce qui n'est pas
// de l'image (code caché dans le fichier) disparait
$image = function_exists( "imagecreatefromstring" ) ? @imagecreatefromstring( file_get_contents( $fichier["tmp_name"] ) ) : false ;

if( $image )
{
    $largeur = imagesx( $image ) ;
    $hauteur = imagesy( $image ) ;
    $echelle = min( 1, 400 / max( $largeur, $hauteur ) ) ;
    $photo = imagecreatetruecolor( (int)round( $largeur * $echelle ), (int)round( $hauteur * $echelle ) ) ;

    // fond blanc pour les png transparents
    imagefill( $photo, 0, 0, imagecolorallocate( $photo, 255, 255, 255 ) ) ;
    imagecopyresampled( $photo, $image, 0, 0, 0, 0, imagesx( $photo ), imagesy( $photo ), $largeur, $hauteur ) ;

    $nom .= ".jpg" ;
    $ok = imagejpeg( $photo, $dossier . "/" . $nom, 85 ) ;
}
else
{
    $nom .= "." . $extensions[$infos[2]] ;
    $ok = move_uploaded_file( $fichier["tmp_name"], $dossier . "/" . $nom ) ;
}

if( !$ok )
{
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Impossible d'enregistrer la photo"], JSON_UNESCAPED_UNICODE ) ;
    exit ;
}

echo json_encode( ["photo" => "assets/photos/" . $nom] ) ;

?>
