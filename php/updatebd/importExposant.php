<?php

require_once "./ConnexionFdlc.php" ;

echo "Ajout des exposants à partir de la table import <br>" ;

try
{
    $bd = Connexion::getInstance() ;

    $sql = "SELECT distinct `COL 3` from import where not exists( select nom from exposant where nom = `COL 3` )" ;

    $cursor = $bd->prepare( $sql ) ;
    $cursor->execute() ;

    $sqlInsert = "INSERT INTO exposant(nom) values( :nom )" ;
    $cursorInsert = $bd->prepare( $sqlInsert ) ;

    $count = 0 ;
    while( $row = $cursor->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) 
    {
        $cursorInsert->bindValue( ":nom", $row["COL 3"], PDO::PARAM_STR ) ;
        $cursorInsert->execute() ;
        $count++ ;
    }
    echo " " . $count . " exposants ajoutés dans la table exposant" ;
}
catch( PDOException $erreur )
{
    echo "Probleme d'acces à la BD " . $erreur->getMessage() ;
}

?>