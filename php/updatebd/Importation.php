<?php

require_once "../Connexion.php" ;

class Importation
{
    protected string $nomTable ;
    protected int    $nbInsert ;
    protected int    $nbDelete ;
    protected int    $nbUpdate ;
    protected Array  $afficheErreurDb ;

    public function __construct( string $nomTable, bool $afficheErreurDb = false )
    {
        $this->nomTable = $nomTable ;
        $this->afficheErreurDb = [] ;
        array_push( $this->afficheErreurDb, $afficheErreurDb ) ;

        $this->initialiseCompteur() ;
    }

    public function initialiseCompteur()
    {
        $this->nbInsert = 0 ;
        $this->nbDelete = 0 ;
        $this->nbUpdate = 0 ;
    }

    public function pushAfficheErreurDb( bool $value )
    {
        array_push( $this->afficheErreurDb, $value ) ;
    }

    public function restoreAfficheErreurDb()
    {
        if( count($this->afficheErreurDb ) > 1 )
            array_pop( $this->afficheErreurDb ) ;
    }

    public function getAfficheErreurDb()
    {
        $i = count($this->afficheErreurDb ) - 1 ;
        $value = $this->afficheErreurDb[$i] ;
        return $value ;
    }

    public function resetNbInsert( int $nb = 0 )
    {
        $this->nbInsert = $nb ;
    }

    public function resetNbUpdate( int $nb = 0 )
    {
        $this->nbUpdate = $nb ;
    }

    public function resetNbDelete( int $nb = 0 )
    {
        $this->nbDelete = $nb ;
    }

    public function incrementeInsertCompteur() 
    {
        $this->nbInsert++ ;
    }

    public function incrementeUpdateCompteur() 
    {
        $this->nbUpdate++ ;
    }

    public function incrementeDeleteCompteur() 
    {
        $this->nbDelete++ ;
    }

    public function afficheErreurDb( string $valeur, PDOException $erreur )
    {
        if( $this->getAfficheErreurDb() )
        {
            echo "   Erreur!!! table: " . $this->nomTable . " erreur sur: " . $valeur . " : " . $erreur->getMessage() . "<br><br>" ;
        }
    }

    public function afficheErreurConnexionDb( PDOException $erreur )
    {
        echo "Erreur!!! Probleme de connexion à la base de données " . $erreur->getMessage() ;
    }

    public function afficheDebutTraitement()
    {
        echo "===== Début du traitement des données pour la table <b>" . $this->nomTable . "</b> à partir de la table import =====<br>" ;
    }

    public function afficheFinTraitement()
    {
        echo "===== Fin du traitement des données pour la table " . $this->nomTable . " à partir de la table import =====<br><br>" ;
    }

    public function afficheAjoutDebut()
    {
        echo ">     Ajout d'occurences dans la table " . $this->nomTable . " à partir de la table import <br>" ;
    }
    
    public function afficheAjoutFin()
    {
        echo ">     " . $this->nbInsert . " occurences ajoutées dans la table " . $this->nomTable . "<br><br>" ;
    }

    public function afficheSuppressionDebut()
    {
        echo ">     Supprime dans la table " . $this->nomTable . " les occurences manquant dans la table import <br>" ;
    }
    
    public function afficheSuppressionFin()
    {
        echo ">     " . $this->nbDelete . " occurences supprimées dans la table " . $this->nomTable . "<br><br>" ;
    }

    public function afficheDonnes( $data )
    {
        echo ">     Données:" . json_encode( $data ) . "<br>" ;
    }

    public function afficheExecSQL( string $sql, $result=null )
    {
        echo ">     Exécute requete SQL <b> " . $sql . "</b> resultat: " . json_encode($result) . "<br><br>" ;
    }

    public function executeSql( string $sql )
    {
        try
        {
            $bd = Connexion::getInstance() ;

            $this->pushAfficheErreurDb( true ) ;

            $cursor = $bd->prepare( $sql ) ;
            try
            {
                $cursor->execute() ;
                $data = $cursor->fetchAll() ;
                $this->restoreAfficheErreurDb() ;

                $this->afficheExecSQL( $sql, $data ) ;

                return $data ;
            }
            catch( PDOException $erreur )
            {
                $this->afficheExecSQL( $sql, null ) ;
                $this->afficheErreurDb( $sql, $erreur ) ;
            }
            $this->restoreAfficheErreurDb() ;
        }
        catch( PDOException $erreur )
        {
            $this->afficheErreurConnexionDb( $erreur ) ;
        }
        return null ;
    }

    public function afficheContenuTable()
    {
        try
        {
            $bd = Connexion::getInstance() ;

            $sql = "select * from " . $this->nomTable ;

            $cursor = $bd->prepare( $sql ) ;
            $numRecord = 0 ;

            try
            {
                $cursor->execute() ;
                $data = $cursor->fetchAll( PDO::FETCH_ASSOC ) ;

                echo "<table>" ;
                foreach( $data as $record )
                {
                    if( !$numRecord )
                    {
                        echo "<th>" ;
                        foreach( $record as $field => $value )
                        {
                            echo "<th scope='col'>" ;
                            echo $field ;
                            echo "</th>" ;
                        }
                        echo "</tr>" ;                        
                    }

                    echo "<tr>" ;
                    foreach( $record as $field => $value )
                    {
                        echo "<td scope='row'>" ;
                        echo $value ;
                        echo "</td>" ;
                    }
                    echo "</tr>" ;
                    $numRecord++ ;
                }
                echo "</table><br>" . $numRecord . " lignes <br>" ;
            }
            catch( PDOException $erreur )
            {
                $this->afficheExecSQL( $sql, null ) ;
                $this->afficheErreurDb( $sql, $erreur ) ;
            }
            $this->restoreAfficheErreurDb() ;
        }
        catch( PDOException $erreur )
        {
            $this->afficheErreurConnexionDb( $erreur ) ;
        }
        return null ;
    }

    public function importeDonnees()
    {
        $this->afficheDebutTraitement() ;
        $this->ajouteDonnees() ;
        $this->supprimeDonnees() ;
        $this->modifieDonnees() ;
        $this->afficheFinTraitement() ;
    }

    public function ajouteDonnees()
    {
    }

    public function supprimeDonnees()
    {
    }

    public function modifieDonnees()
    {
    }
}

?>