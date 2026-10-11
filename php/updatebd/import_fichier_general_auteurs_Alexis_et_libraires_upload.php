

<?php

require_once( "../Connexion.php" ) ;

$separateur = ";" ;

echo '<pre>';
if (is_uploaded_file($_FILES['userfile']['tmp_name'])) 
{
  echo "File ". $_FILES['userfile']['name'] ." téléchargé avec succès.\n";

  //readfile($_FILES['userfile']['tmp_name']);
  $lignes = file( $_FILES['userfile']['tmp_name'] ) ;

  try
  {
    $db = Connexion::getInstance() ;

    $nbupdate = 0 ;
    $nblignes = 0 ;

    try
    {
      // Met à jour le champ type de la table auteur
      $sql = "update " . Connexion::$tables["auteur"] . " set type = :type where prenom = :prenom and nom = :nom" ;
      $cursor = $db->prepare( $sql ) ;

      foreach( $lignes as $ligne )
      {
        $values = explode( $separateur, $ligne ) ;
        $nblignes++ ;
        if( $values[0] != ""  )
        {
          $cursor->bindValue( ":prenom", $values[0], PDO::PARAM_STR) ;
          $cursor->bindValue( ":nom", $values[1], PDO::PARAM_STR) ;
          if( $values[3] != "" )
            $cursor->bindValue( ":type", $values[3], PDO::PARAM_STR) ;
          else
            $cursor->bindValue( ":type", NULL, PDO::PARAM_STR) ;

          $cursor->execute() ;
          $nbupdate++ ;
        }
      }
      echo $nbupdate . " lignes modifiées dans la table " . Connexion::$tables["auteur"] . "<br>";
    }
    catch( PDOException $error )
    {
      echo "Erreur à la ligne n° " . $nblignes . " " . $error ;
    }
  }
  catch( PDOException $error )
  {
    echo "Erreur: " . $error ;
  }
} 
else 
{
   echo "Attaque possible par téléchargement de fichier : ";
   echo "Nom du fichier : '". $_FILES['userfile']['tmp_name'] . "'.";
}
?>

<form action="index.php" method="POST">
    <button type="submit" name="mon_bouton" value="valider">Revenir au menu</button>
</form>
