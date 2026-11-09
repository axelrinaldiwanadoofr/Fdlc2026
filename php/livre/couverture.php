<?php

require_once "bnf.php" ;

// Couverture d'un livre : BnF avec l'ark ou Open Library avec l'isbn
// L'image est réduite et gardée en cache, comme ça les visiteurs n'appellent pas la BnF

$ark = $_GET["ark"] ?? "" ;
$isbn = $_GET["isbn"] ?? "" ;

if( preg_match( "/^ark:\/12148\/\w+$/", $ark ) )
{
    $url = "https://catalogue.bnf.fr/couverture?&appName=NE&idArk=" . $ark . "&couverture=1" ;
}
else if( preg_match( "/^[0-9X]{10,13}$/", $isbn ) )
{
    $url = "https://covers.openlibrary.org/b/isbn/" . $isbn . "-M.jpg?default=false" ;
}
else
{
    http_response_code( 400 ) ;
    exit ;
}

$fichier = dossierCache( "fdlc2026-couvertures" ) . "/" . md5( $url ) . ".jpg" ;

// un fichier vide veut dire pas d'image, on réessaie au bout de 7 jours
$aTelecharger = !is_file( $fichier ) || ( filesize( $fichier ) == 0 && time() - filemtime( $fichier ) > 7 * 24 * 3600 ) ;

if( $aTelecharger )
{
    $image = telecharge( $url ) ;
    if( $image === false || @getimagesizefromstring( $image ) === false ) $image = "" ;

    // largeur 240 px max pour que la page reste légère
    if( $image != "" && function_exists( "imagecreatefromstring" ) )
    {
        $img = imagecreatefromstring( $image ) ;
        if( $img !== false && imagesx( $img ) > 240 )
        {
            ob_start() ;
            imagejpeg( imagescale( $img, 240 ), null, 80 ) ;
            $image = ob_get_clean() ;
        }
    }

    file_put_contents( $fichier, $image, LOCK_EX ) ;
}

if( filesize( $fichier ) == 0 )
{
    http_response_code( 404 ) ;
    exit ;
}

header( "Content-Type: image/jpeg" ) ;
header( "Cache-Control: max-age=2592000" ) ;
readfile( $fichier ) ;

?>
