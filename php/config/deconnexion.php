<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "mot-de-passe.php" ;

header( "Content-Type: application/json; charset=utf-8" ) ;

fermeSessionConfig() ;
echo json_encode( ["ok" => true] ) ;

?>
