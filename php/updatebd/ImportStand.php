<?php

require_once "../Connexion.php" ;
require_once "Importation.php" ;

class ImportStand extends Importation
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

            $sql = "SELECT distinct `COL 4` from " . Connexion::$tables["import"] ;

            $cursor = $bd->prepare( $sql ) ;
            $cursor->execute() ;

            $sqlInsert = "INSERT INTO " . $this->nomTable . "(num) values( :num )" ;
            $cursorInsert = $bd->prepare( $sqlInsert ) ;

            while( $row = $cursor->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) 
            {
                $valeurs = explode( "|", $row["COL 4"] ) ;
                foreach( $valeurs as $valeur )
                {
                    if( is_numeric($valeur) )
                    {
                        $cursorInsert->bindValue( ":num", intval($valeur), PDO::PARAM_INT ) ;
                        try
                        {
                            $cursorInsert->execute() ;
                            $this->incrementeInsertCompteur() ;
                        }
                        catch( PDOException $erreur )
                        {
                            $this->afficheErreurDb( $valeur, $erreur ) ;
                        }
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

            $sqlCherche = "SELECT * from " . Connexion::$tables["import"] . " where `COL 4` like :strnum" ;
            $cursorCherche = $bd->prepare( $sqlCherche ) ;

            $sqlDelete = "DELETE FROM " . $this->nomTable . " WHERE num = :num" ;
            $cursorDelete = $bd->prepare( $sqlDelete ) ;

            $sql = "SELECT num from " . $this->nomTable ;
            $cursor = $bd->prepare( $sql ) ;
            $cursor->execute() ;
            
            while( $row = $cursor->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) 
            {
                try
                {
                    $cursorCherche->bindValue( ":strnum", "%" . $row["num"] . "%" ) ;
                    $cursorCherche->execute() ;

                    if( !$cursorCherche->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT) )
                    {
                        // Supprime le stand
                        $cursorDelete->bindValue( ":num", $row["num"], PDO::PARAM_INT ) ;
                        $cursorDelete->execute() ;
                        $this->incrementeDeleteCompteur() ;
                    }    
                }
                catch( PDOException $erreur )
                {
                    $this->afficheErreurDb( $row["num"], $erreur ) ;
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