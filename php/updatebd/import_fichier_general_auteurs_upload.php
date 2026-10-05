

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

    // Supprime les données de la table import
    $sql = "delete from " . Connexion::$tables["import"] ;
    $cursor = $db->prepare( $sql ) ;
    $cursor->execute() ;

    $nbinsert = 0 ;
    $nblignes = 0 ;

    try
    {
      // Insere les nouvelles données
      $sql = "insert into " . Connexion::$tables["import"] . "( `COL 1`, `COL 2`, `COL 3`, `COL 4`, `COL 5`, `COL 6`, `COL 7`, `COL 8`) values( :c1, :c2, :c3, :c4, :c5, :c6, :c7, :c8 )" ;
      $cursor = $db->prepare( $sql ) ;

      foreach( $lignes as $ligne )
      {
        $values = explode( $separateur, $ligne ) ;
        $nblignes++ ;
        if( $values[0] != "" && $values[0] != "Prénom " && $values[0] != "Auteurs" )
        {
          for( $i = 0; $i < 8; $i++ )
          {
            $cursor->bindValue( ":c" . $i+1, $values[$i], PDO::PARAM_STR) ;
          }
          $cursor->execute() ;
          $nbinsert++ ;
        }
      }
      echo $nbinsert . " lignes ajouées dans la table " . Connexion::$tables["import"] . "<br>";
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

/*
//if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) 
if (move_uploaded_file("/tmp/titi.txt", $uploadfile)) 
{
    echo "Le fichier est valide, et a été téléchargé
           avec succès. Voici plus d'informations :\n";
} 
else 
{
    echo "Attaque potentielle par téléchargement de fichiers.
          Voici plus d'informations :\n";
}

echo 'Voici quelques informations de débogage :';
print_r($_FILES);
*/

echo '</pre>';

?>