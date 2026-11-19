<?php

// Auteur: Kevin MEYER - 19/11/2026

// Colonne staff de la table specialite : créée au premier appel,
// avec les spécialités qui étaient marquées staff dans le code
function colonneStaff( $bd )
{
    $table = Connexion::$tables["specialite"] ;
    if( $bd->query( "show columns from " . $table . " like 'staff'" )->fetch() ) return ;

    $bd->exec( "alter table " . $table . " add staff tinyint(1) not null default 0" ) ;
    $bd->exec( "update " . $table . " set staff = 1 where specialite in ( 'animateur', 'modérateur', 'présentateur', 'organisateur', 'bénévole' )" ) ;
}

?>
