

<?php

require_once( "../Connexion.php" ) ;

echo "Nombre occurence import<br>" ;

try
{
  $db = Connexion::getInstance() ;

  $sql = "select count(*) from " . Connexion::$tables["import"] ;
  $cursor = $db->prepare( $sql ) ;
  $cursor->execute() ;
  
  echo json_encode($cursor->fetchAll()) ;
}
catch( PDOException $error )
{
  echo "Erreur: " . $error ;
}

?>