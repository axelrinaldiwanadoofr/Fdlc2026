<?php
require_once __DIR__ . "/../cache.php" ;
cacheDebut() ;

require_once "../Connexion.php" ;
require_once "../colonnes.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

try
{
    $bd = Connexion::getInstance() ;

    $lieu = Connexion::$tables["lieu"] ;
    $sql = "select distinct l.num, l.nom, " . colonneOuVide( $bd, $lieu, "l", "libelle", "libelle" ) . ", l.type, l.hall, l.x1, l.y1, l.x2, l.y2 from " . $lieu . " as l where l.num=:num " ;

    $cursor = $bd->prepare( $sql ) ;

    if( isset($_GET["num"]))
    {
        $cursor->bindValue( ":num", $_GET["num"], PDO::PARAM_INT ) ;
    }

    $cursor->execute() ;

    $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    echo json_encode( $data ) ;

}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    http_response_code( 500 ) ;
    echo json_encode( ["erreur" => "Probleme d'acces à la BD"], JSON_UNESCAPED_UNICODE ) ;
}

?>