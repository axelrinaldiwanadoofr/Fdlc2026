<?php

// Auteur: Kevin MEYER - 16/11/2026

require_once "securite.php" ;

// Liste des comptes, ou celui d'une personne avec ?idPersonne
try
{
    $moi = exigePermission( "comptes.gerer", false ) ;

    $sql = "select c.id, c.identifiant, c.estRoot, c.idRole, c.idPersonne, c.actif, c.doitChanger, c.derniereConnexion,"
         . " r.nom as role, r.couleur, r.niveau, trim( concat_ws( ' ', p.prenom, p.nom ) ) as nom"
         . " from " . table( "compte" ) . " c"
         . " left join " . table( "role" ) . " r on r.id = c.idRole"
         . " left join " . table( "personne" ) . " p on p.id = c.idPersonne" ;

    $parametres = [] ;
    if( isset( $_GET["idPersonne"] ) )
    {
        $sql .= " where c.idPersonne = :idPersonne" ;
        $parametres["idPersonne"] = (int)$_GET["idPersonne"] ;
    }
    $sql .= " order by c.estRoot desc, r.niveau desc, c.identifiant" ;

    $cursor = bd()->prepare( $sql ) ;
    $cursor->execute( $parametres ) ;
    $comptes = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

    foreach( $comptes as &$compte )
    {
        $compte["estRoot"] = $compte["estRoot"] == 1 ;
        if( $compte["estRoot"] )
        {
            $compte["role"] = "Root" ;
            $compte["couleur"] = "#4b5563" ;
            $compte["niveau"] = NIVEAU_ROOT ;
        }
        $compte["modifiable"] = !$compte["estRoot"] && $compte["id"] != $moi["id"] && ( $moi["estRoot"] || (int)$compte["niveau"] < $moi["niveau"] ) ;
    }

    repond( $comptes ) ;
}
catch( Exception $erreur )
{
    error_log( $erreur->getMessage() ) ;
    refuse( "Probleme d'acces à la BD", 500 ) ;
}

?>
