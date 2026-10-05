<?php

require_once "../Connexion.php" ;

require_once "Importation.php" ;

class ImportExposant extends Importation
{
    public function __construct( string $nomTable, bool $afficheErreurBd = false )
    {
        parent::__construct( $nomTable, $afficheErreurBd ) ;
    }

    public function ajouteDonnees()
    {
        try
        {
            $bd = Connexion::getInstance() ;

            $this->afficheAjoutDebut() ;

            $this->resetNbInsert() ;

            $sql = "SELECT distinct `COL 3`,`COL 4` from import" ;

            $cursor = $bd->prepare( $sql ) ;
            $cursor->execute() ;

            $sqlId = "select max(id) as nid from " . $this->nomTable ;
            $cursorId = $bd->prepare( $sqlId ) ;
            $cursorId->execute() ;
            $id = $cursorId->fetchAll(PDO::FETCH_ASSOC)[0]["nid"] ;
            $id++ ;

            $sqlInsert = "INSERT INTO " . $this->nomTable . "(id, nom, numStand) values(:id, :nom, :numStand )" ;
            $cursorInsert = $bd->prepare( $sqlInsert ) ;

            while( $row = $cursor->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) 
            {
                $noms = explode( "|", $row["COL 3"] ) ;
                $numStands = explode( "|", $row["COL 4"] ) ;
                for( $i=0 ; $i < count($noms) ; $i++ )
                {
                    $cursorInsert->bindValue( ":id", $id++, PDO::PARAM_INT ) ;
                    $cursorInsert->bindValue( ":nom", $noms[$i], PDO::PARAM_STR ) ;
                    $cursorInsert->bindValue( ":numStand", intval($numStands[$i]), PDO::PARAM_INT ) ;
                    try
                    {
                        $cursorInsert->execute() ;
                        $this->incrementeInsertCompteur() ;
                    }
                    catch( PDOException $erreur )
                    {
                        $this->afficheErreurDb( $noms[$i], $erreur ) ;
                    }
                }
            }
            $this->afficheAjoutFin() ;
        }
        catch( PDOException $erreur )
        {
            $this->afficheErreurConnexionDb( $erreur ) ;
        }
    }

    public function supprimeDonnees()
    {
        try
        {
            $bd = Connexion::getInstance() ;

            $this->afficheSuppressionDebut() ;

            $this->resetNbDelete() ;

            $sqlCherche = "SELECT * from import where `COL 3` like :nom" ;
            $cursorCherche = $bd->prepare( $sqlCherche ) ;

            $sqlDelete = "DELETE FROM " . $this->nomTable . " WHERE nom = :nom" ;
            $cursorDelete = $bd->prepare( $sqlDelete ) ;

            $sql = "SELECT nom from " . $this->nomTable ;
            $cursor = $bd->prepare( $sql ) ;
            $cursor->execute() ;
            
            while( $row = $cursor->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) 
            {
                try
                {
                    $cursorCherche->bindValue( ":nom", "%" . $row["nom"] . "%" ) ;
                    $cursorCherche->execute() ;

                    if( !$cursorCherche->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT) )
                    {
                        // Supprime le stand
                        $cursorDelete->bindValue( ":nom", $row["nom"], PDO::PARAM_STR ) ;
                        $cursorDelete->execute() ;
                        $this->incrementeDeleteCompteur() ;
                    }    
                }
                catch( PDOException $erreur )
                {
                    $this->afficheErreurDb( $row["nom"], $erreur ) ;
                }
            }
            $this->afficheSuppressionFin() ;
        }
        catch( PDOException $erreur )
        {
            $this->afficheErreurConnexionDb( $erreur ) ;
        }
    }
}

?>