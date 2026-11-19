<?php

// Auteur: Kevin MEYER - 19/11/2026

// Toutes les bases n'ont pas les mêmes colonnes (libellé et type d'un exposant, libellé d'un lieu) :
// on vérifie qu'une colonne existe avant de s'en servir, sans toucher à la base

function colonneExiste( $bd, $table, $colonne )
{
    static $connues = [] ;

    $cle = $table . "." . $colonne ;
    if( !isset( $connues[$cle] ) )
    {
        $connues[$cle] = $bd->query( "show columns from " . $table . " like " . $bd->quote( $colonne ) )->fetch() !== false ;
    }
    return $connues[$cle] ;
}

// "x.libelle as libelle" si la colonne existe, sinon "'' as libelle"
function colonneOuVide( $bd, $table, $alias, $colonne, $nom )
{
    return colonneExiste( $bd, $table, $colonne ) ? $alias . "." . $colonne . " as " . $nom : "'' as " . $nom ;
}

?>
