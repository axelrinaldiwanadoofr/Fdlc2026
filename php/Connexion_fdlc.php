<?php
	/** 
    * Classe d'accès aux données de type singleton
    * qui utilise les services de la classe PDO
    */

   class Connexion{   	
	//Attribut statique
        private static PDO | null $connexion = null ;

        // Liste des alias de tables utilisée
        public static $tables = array(
            "stand" => "fdlc_stand",
            "exposant" => "fdlc_exposant",
            "exposer" => "fdlc_exposer",
            "personne" => "fdlc_personne",
            "hall" => "fdlc_hall",
            "import" => "fdlc_import",
            "ecrire" => "fdlc_ecrire",
            "editeur" => "fdlc_editeur",
            "evenement" => "fdlc_evenement",
            "lieu" => "fdlc_lieu",
            "livre" => "fdlc_livre",
            "presenter" => "fdlc_presenter",
            "specialite" => "fdlc_specialite",
            "typelieu" => "fdlc_typelieu",
            "typeevenement" => "fdlc_typeevenement",
            "genre" => "fdlc_genre",
            "PersonneExposantExposer" => "fdlc_PersonneExposantExposer",
            "PersonneExposantExposerLieu" => "fdlc_PersonneExposantExposerLieu",
            "LivreEditeurPersonneExposant" => "fdlc_LivreEditeurPersonneExposant",
            "LivreEditeurPersonneExposantLieu" => "fdlc_LivreEditeurPersonneExposantLieu"
         ) ;

        /**
        * Méthode statique qui renvoie l'unique instance de Connexion
        **/
        public static function getInstance()
        {
            $serveur = 'mysql:host=localhost:3306;';
            $bdd = 'dbname=fdlc;charset=utf8mb4';   		
            $user = 'fdlc' ; 
            $mdp = 'fdlc' ;

            if(!self::$connexion){
                try {
                    self::$connexion = new PDO($serveur.$bdd, $user, $mdp); 
                    self::$connexion->query("SET CHARACTER SET utf8");
                } catch (PDOException $e) {
                        echo " Error connexion: " . $serveur . " " . $bdd . " " . $e->getMessage() ;
                        throw new Exception("Erreur à la connexion \n" . $e->getMessage());
                }
            }
            return self::$connexion;
        }
     }   
?>
