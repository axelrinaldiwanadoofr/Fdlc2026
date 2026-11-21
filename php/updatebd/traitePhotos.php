<?php require_once __DIR__ . "/../config/garde.php" ; ?>
<?php
require_once "../Connexion.php" ;
require_once "utils.php" ;

function redimensionnerImage($source, $destination, $nouvelleLargeur ) 
{
    // 1. Récupérer les dimensions d'origine
    list( $largeurOrigine, $hauteurOrigine, $type) = getimagesize($source);

    // 2. Calculer les nouvelles dimensions en gardant le ratio
    $ratio = $largeurOrigine / $hauteurOrigine;

    /*
    if ($largeurMax / $hauteurMax > $ratio) 
    {
        $nouvelleLargeur = $hauteurMax * $ratio;
        $nouvelleHauteur = $hauteurMax;
    } 
    else 
    {
        $nouvelleLargeur = $largeurMax;
        $nouvelleHauteur = $largeurMax / $ratio;
    }*/

    $nouvelleHauteur = $nouvelleLargeur / $ratio ;

    // 3. Créer l'image vide aux nouvelles dimensions
    $imageDest = imagecreatetruecolor($nouvelleLargeur, $nouvelleHauteur);

    // 4. Charger l'image source selon son type
    if( $type == 3 )
    {
        $imgSource = imagecreatefrompng($source);
        imagealphablending($imageDest, false);
        imagesavealpha($imageDest, true);
    }
    else if( $type == 18 )
    {
        $imgSource = imagecreatefromwebp($source);
    }
    else
        $imgSource = imagecreatefromjpeg($source);

    // 5. Redimensionner l'image
    imagecopyresampled(
        $imageDest, $imgSource,
        0, 0, 0, 0,
        $nouvelleLargeur, $nouvelleHauteur,
        $largeurOrigine, $hauteurOrigine
    );

    // 6. Sauvegarder la nouvelle image
    try
    {
        if( $type == 3 )
        {
            imagepng($imageDest, $destination);    
            //imagepng( $imgSource );    
        }
        else
        {
            imagejpeg($imageDest, $destination, 90);
            //imagejpeg( $imageDest );
        }
    }
    catch( ValueError $error )
    {
        echo "Erreur: " . $error ;
    }

    // 7. Libérer la mémoire
    imagedestroy($imageDest);
    imagedestroy($imgSource);

    return true;
}

function reduitCopieImage( $dossierSrc, $dossierDst, $nouvelleLargeur)
{
    // Vérifie si le dossier existe
    if( is_dir($dossierSrc) ) 
    {
        // Récupère la liste des fichiers et dossiers
        $fichiers = scandir($dossierSrc);
        
        // Supprime '.' et '..' de la liste
        $fichiers = array_diff($fichiers, array('.', '..'));
        
        foreach ($fichiers as $fichier) 
        {
            echo $fichier . '<br>';
            redimensionnerImage(
                $dossierSrc . "/" . $fichier,
                $dossierDst . "/" . $fichier,
                $nouvelleLargeur
            ) ;
        }
    } 
    else 
    {
        echo "Le dossier n'existe pas.";
    }
}

function updateToutesLesPersonnePhoto( $dossierDst, $lienDirDst )
{
    $db = Connexion::getInstance() ;

    // Vérifie si le dossier existe
    if( is_dir($dossierDst) ) 
    {
        // Récupère la liste des fichiers et dossiers
        $fichiers = scandir($dossierDst);
        
        // Supprime '.' et '..' de la liste
        $fichiers = array_diff($fichiers, array('.', '..'));
        
        foreach ($fichiers as $fichier) 
        {
            if( updatePersonnePhoto( $db, $fichier, $lienDirDst ) ) echo $fichier ." : ok<br>";
            else echo $fichier ." : auteur non trouvé<br>";
        }
    } 
    else 
    {
        echo "Le dossier n'existe pas.";
    }
}

$dossierSrc = '../../photos/original' ;
$dossierDst = '../../photos/reduit' ;
$nouvelleLargeur = 500 ;

//reduitCopieImage( $dossierSrc, $dossierDst, $nouvelleLargeur ) ;
updateToutesLesPersonnePhoto( "assets/photos", "assets/photos" ) ;

?>
