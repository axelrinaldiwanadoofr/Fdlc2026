<?php

require_once "../Connexion.php" ;

require_once "Importation.php" ;

class ImportExposer extends Importation
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

            $sql = "SELECT `COL 1` as prenom, `COL 2` as nom, `COL 3` as exposant, `COL 5` as sam, `COL 6` as spm, `COL 7` as dam, `COL 8` as dpm from " . Connexion::$tables["import"] ;

            $cursor = $bd->prepare( $sql ) ;
            $cursor->execute() ;

            $sqlAuteur = "select id from " . Connexion::$tables["auteur"] . " where prenom = :prenom and nom = :nom";
            $cursorAuteur = $bd->prepare( $sqlAuteur ) ;

            $sqlExposant = "select id from " . Connexion::$tables["exposant"] . " where nom = :exposant";
            $cursorExposant = $bd->prepare( $sqlExposant ) ;

            $sqlInsert = "INSERT INTO " . $this->nomTable . "(idExposant, idAuteur, samedi_am, samedi_pm, dimanche_am, dimanche_pm) values(:idExposant, :idAuteur, :samedi_am, :samedi_pm, :dimanche_am, :dimanche_pm )" ;
            $cursorInsert = $bd->prepare( $sqlInsert ) ;

            while( $row = $cursor->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT)) 
            {
                $idAuteur = -1 ;
                try
                {
                    $cursorAuteur->bindValue( ":prenom", $row["prenom"], PDO::PARAM_STR ) ;
                    $cursorAuteur->bindValue( ":nom", $row["nom"], PDO::PARAM_STR ) ;
                    $cursorAuteur->execute() ;
                    $rowsAuteur = $cursorAuteur->fetchAll( PDO::FETCH_ASSOC ) ;
                    $idAuteur = $rowsAuteur[0]["id"] ; 
                }
                catch( PDOException $erreur )
                {
                    $this->afficheErreurDb( $row["prenom"] . " " . $row["nom"], $erreur ) ;
                }

                $exposans = explode( "|", $row["exposant"] ) ;
                for( $i=0 ; $i < count($exposans) ; $i++ )
                {
                    $samedi_am = 0 ;
                    $samedi_pm = 0 ;
                    $dimanche_am = 0 ;
                    $dimanche_pm = 0 ;

                    $idExposant = -1 ;
                    try
                    {
                        $cursorExposant->bindValue( ":exposant", $exposans[$i], PDO::PARAM_STR ) ;
                        $cursorExposant->execute() ;
                        $rowsExposant = $cursorExposant->fetchAll( PDO::FETCH_ASSOC ) ;
                        $idExposant = $rowsExposant[0]["id"] ; 
                    }
                    catch( PDOException $erreur )
                    {
                        $this->afficheErreurDb( $exposans[$i], $erreur ) ;
                    }

                    $cursorInsert->bindValue( ":idExposant", $idExposant, PDO::PARAM_INT ) ;
                    $cursorInsert->bindValue( ":idAuteur", $idAuteur, PDO::PARAM_INT ) ;

                    if( $row["sam"] == "X" ) $samedi_am = 1 ;
                    if( $row["spm"] == "X" ) $samedi_pm = 1 ;
                    if( $row["dam"] == "X" ) $dimanche_am = 1 ;
                    if( $row["dpm"] == "X" ) $dimanche_pm = 1 ;

                    $cursorInsert->bindValue( ":samedi_am", $samedi_am, PDO::PARAM_INT ) ;
                    $cursorInsert->bindValue( ":samedi_pm", $samedi_pm, PDO::PARAM_INT ) ;
                    $cursorInsert->bindValue( ":dimanche_am", $dimanche_am, PDO::PARAM_INT ) ;
                    $cursorInsert->bindValue( ":dimanche_pm", $dimanche_pm, PDO::PARAM_INT ) ;

                    try
                    {
                        $cursorInsert->execute() ;
                        $this->incrementeInsertCompteur() ;
                    }
                    catch( PDOException $erreur )
                    {
                        $this->afficheErreurDb( $idExposant . " " . $idExposant , $erreur ) ;
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
        /*
        try
        {
            $bd = Connexion::getInstance() ;

            $this->afficheSuppressionDebut() ;

            $this->resetNbDelete() ;

            $sqlCherche = "SELECT * from " . Connexion::$tables["import"] . " where `COL 3` like :nom" ;
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
            */
    }
}

?>