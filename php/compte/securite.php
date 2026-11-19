<?php

// Auteur: Kevin MEYER - 16/11/2026

// Comptes de la configuration : session, rôles, permissions

require_once __DIR__ . "/../Connexion.php" ;
require_once __DIR__ . "/../cache.php" ;

// Tables ajoutées depuis la base de départ : si un Connexion.php ne les a pas,
// elles prennent le même préfixe que la table personne (fdlc_compte...)
$prefixeTables = substr( Connexion::$tables["personne"], 0, -strlen( "personne" ) ) ;
foreach( ["compte", "role", "permission", "journal", "annonce", "typeexposant", "invite", "parametre"] as $nomTable )
{
    if( !isset( Connexion::$tables[$nomTable] ) ) Connexion::$tables[$nomTable] = $prefixeTables . $nomTable ;
}

const NIVEAU_ROOT = 1000 ;
const DUREE_INACTIVITE = 15 * 60 ;
const DUREE_SESSION_MAX = 8 * 3600 ;
const ESSAIS_MAX = 5 ;

// Mot de passe du compte root à l'installation
const MDP_ROOT_DEFAUT = "fdlc2026" ;
const DUREE_BLOCAGE = 15 * 60 ;

// Le journal est vidé de ses lignes de plus de 6 mois (RGPD)
const JOURS_JOURNAL = 180 ;

// Permissions rangées par groupe
const PERMISSIONS = [
    "Le festival" => [
        "personnes.modifier" => "Créer et modifier les personnes",
        "personnes.supprimer" => "Supprimer des personnes",
        "exposants.modifier" => "Créer et modifier les exposants",
        "exposants.supprimer" => "Supprimer et fusionner des exposants",
        "livres.modifier" => "Créer et modifier les livres",
        "livres.supprimer" => "Supprimer des livres",
        "evenements.modifier" => "Gérer les événements"
    ],
    "Plans et lieux" => [
        "lieux.modifier" => "Gérer les lieux",
        "plans.modifier" => "Dessiner les stands sur les plans"
    ],
    "Pendant le festival" => [
        "annonces.modifier" => "Publier des annonces sur l'accueil",
        "accueil.modifier" => "Choisir la page d'accueil du site",
        "reglages.modifier" => "Modifier les réglages du festival (dates, affiche, plans, textes)",
        "controle.voir" => "Voir le contrôle des données"
    ],
    "Outils" => [
        "imports.lancer" => "Lancer les imports de la base",
        "bnf.lancer" => "Préparer le catalogue BnF"
    ],
    "Administration" => [
        "comptes.gerer" => "Gérer les comptes des rôles inférieurs",
        "roles.gerer" => "Gérer les rôles inférieurs et leurs permissions",
        "journal.voir" => "Voir le journal des actions"
    ]
] ;

function codesPermissions()
{
    $codes = [] ;
    foreach( PERMISSIONS as $groupe ) $codes = array_merge( $codes, array_keys( $groupe ) ) ;
    return $codes ;
}

function bd()
{
    $bd = Connexion::getInstance() ;
    $bd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;
    return $bd ;
}

function table( $nom )
{
    return Connexion::$tables[$nom] ;
}

// Réponse JSON puis arrêt du script
function repond( $donnees, $code = 200 )
{
    http_response_code( $code ) ;
    header( "Content-Type: application/json; charset=utf-8" ) ;
    echo json_encode( $donnees, JSON_UNESCAPED_UNICODE ) ;
    exit ;
}

function refuse( $message, $code = 403 )
{
    repond( ["erreur" => $message], $code ) ;
}

function donneesPost()
{
    return json_decode( file_get_contents( "php://input" ), true ) ?? [] ;
}

// Création des tables au premier lancement
function tableExiste( $nom )
{
    try
    {
        bd()->query( "select 1 from " . table( $nom ) . " limit 1" ) ;
        return true ;
    }
    catch( Exception $erreur )
    {
        return false ;
    }
}

// Création des tables qui manquent au premier lancement
function creeTables()
{
    $tables = [
        "role" => "id int not null auto_increment primary key, nom varchar(40) not null unique, niveau int not null,"
                . " couleur varchar(7) not null default '#6b7280'",
        "permission" => "idRole int not null, code varchar(40) not null, primary key ( idRole, code )",
        "compte" => "id int not null auto_increment primary key, identifiant varchar(50) not null unique, hash varchar(255) not null,"
                  . " estRoot tinyint(1) not null default 0, idRole int default null, idPersonne int default null unique,"
                  . " actif tinyint(1) not null default 1, doitChanger tinyint(1) not null default 0, version int not null default 1,"
                  . " essais int not null default 0, bloqueJusqua datetime default null, derniereConnexion datetime default null,"
                  . " creeLe datetime not null",
        "journal" => "id int not null auto_increment primary key, date datetime not null, idCompte int default null,"
                   . " identifiant varchar(50) default null, action varchar(60) not null, detail varchar(255) default null,"
                   . " ip varchar(45) default null"
    ] ;

    $bd = bd() ;
    foreach( $tables as $nom => $colonnes )
    {
        if( !tableExiste( $nom ) ) $bd->exec( "create table " . table( $nom ) . " ( " . $colonnes . " ) engine=InnoDB" ) ;
    }

    if( !rootExiste() )
    {
        $bd->prepare( "insert into " . table( "compte" ) . " ( identifiant, hash, estRoot, creeLe ) values ( 'root', :hash, 1, now() )" )
           ->execute( ["hash" => password_hash( MDP_ROOT_DEFAUT, PASSWORD_DEFAULT )] ) ;
    }

    // rôles de départ
    if( $bd->query( "select count(*) from " . table( "role" ) )->fetchColumn() == 0 )
    {
        $tout = codesPermissions() ;
        $moderation = ["personnes.modifier", "exposants.modifier", "livres.modifier", "evenements.modifier", "annonces.modifier", "controle.voir"] ;
        creeRole( "Administrateur", 100, "#2b3990", $tout ) ;
        creeRole( "Modérateur", 50, "#1f8a5b", $moderation ) ;
        creeRole( "Bénévole", 10, "#c2569a", ["annonces.modifier", "controle.voir"] ) ;
    }

    // permissions arrivées après la création des rôles : on les donne aux administrateurs
    foreach( ["accueil.modifier", "reglages.modifier"] as $code )
    {
        $bd->prepare( "insert ignore into " . table( "permission" ) . " ( idRole, code ) select id, :code from " . table( "role" ) . " where nom = 'Administrateur'" )
           ->execute( ["code" => $code] ) ;
    }
}

function creeRole( $nom, $niveau, $couleur, $codes )
{
    $bd = bd() ;
    $bd->prepare( "insert into " . table( "role" ) . " ( nom, niveau, couleur ) values ( :nom, :niveau, :couleur )" )
       ->execute( ["nom" => $nom, "niveau" => $niveau, "couleur" => $couleur] ) ;
    ecritPermissions( (int)$bd->lastInsertId(), $codes ) ;
}

function ecritPermissions( $idRole, $codes )
{
    $bd = bd() ;
    $bd->prepare( "delete from " . table( "permission" ) . " where idRole = :id" )->execute( ["id" => $idRole] ) ;
    $cursor = $bd->prepare( "insert into " . table( "permission" ) . " ( idRole, code ) values ( :id, :code )" ) ;
    foreach( array_unique( array_intersect( $codes, codesPermissions() ) ) as $code ) $cursor->execute( ["id" => $idRole, "code" => $code] ) ;
}

function rootExiste()
{
    try
    {
        return bd()->query( "select count(*) from " . table( "compte" ) . " where estRoot = 1" )->fetchColumn() > 0 ;
    }
    catch( Exception $erreur )
    {
        return false ;
    }
}

// Cookie de session HttpOnly, SameSite Strict, Secure en https
function demarreSession()
{
    if( session_status() == PHP_SESSION_ACTIVE ) return ;

    session_name( "fdlc2026" ) ;
    // cookie limité au dossier de l'appli (ex : /fdlc/), pas aux autres sites du domaine
    $script = $_SERVER["SCRIPT_NAME"] ?? "/" ;
    $position = strpos( $script, "/php/" ) ;

    session_set_cookie_params( [
        "path" => $position === false ? "/" : substr( $script, 0, $position + 1 ),
        "httponly" => true,
        "samesite" => "Strict",
        "secure" => ( $_SERVER["HTTPS"] ?? "" ) == "on" || ( $_SERVER["HTTP_X_FORWARDED_PROTO"] ?? "" ) == "https"
    ] ) ;
    session_start() ;
}

function ouvreSession( $compte )
{
    demarreSession() ;
    session_regenerate_id( true ) ;
    $_SESSION = [
        "idCompte" => (int)$compte["id"],
        "version" => (int)$compte["version"],
        "jeton" => bin2hex( random_bytes( 32 ) ),
        "debut" => time(),
        "activite" => time()
    ] ;
}

function fermeSession()
{
    demarreSession() ;
    $_SESSION = [] ;
    session_destroy() ;
}

// Compte avec son niveau et ses permissions
function chargeCompte( $id )
{
    $cursor = bd()->prepare( "select c.id, c.identifiant, c.estRoot, c.idRole, c.idPersonne, c.actif, c.doitChanger, c.version,"
                           . " r.nom as role, r.couleur, r.niveau, trim( concat_ws( ' ', p.prenom, p.nom ) ) as nom"
                           . " from " . table( "compte" ) . " c"
                           . " left join " . table( "role" ) . " r on r.id = c.idRole"
                           . " left join " . table( "personne" ) . " p on p.id = c.idPersonne"
                           . " where c.id = :id" ) ;
    $cursor->execute( ["id" => $id] ) ;
    $compte = $cursor->fetch( PDO::FETCH_ASSOC ) ;
    if( !$compte ) return null ;

    $compte["estRoot"] = $compte["estRoot"] == 1 ;
    if( $compte["estRoot"] )
    {
        $compte["niveau"] = NIVEAU_ROOT ;
        $compte["role"] = "Root" ;
        $compte["couleur"] = "#4b5563" ;
        $compte["permissions"] = codesPermissions() ;
    }
    else
    {
        $compte["niveau"] = (int)( $compte["niveau"] ?? 0 ) ;
        $cursor = bd()->prepare( "select code from " . table( "permission" ) . " where idRole = :id" ) ;
        $cursor->execute( ["id" => (int)$compte["idRole"]] ) ;
        $compte["permissions"] = $cursor->fetchAll( PDO::FETCH_COLUMN ) ;
    }
    return $compte ;
}

// Compte connecté, relu dans la base à chaque appel
function compteConnecte()
{
    static $compte = false ;
    if( $compte !== false ) return $compte ;

    $compte = null ;
    // visiteur sans cookie : pas de session a ouvrir
    if( session_status() != PHP_SESSION_ACTIVE && !isset( $_COOKIE["fdlc2026"] ) ) return null ;
    demarreSession() ;
    if( !isset( $_SESSION["idCompte"] ) ) return null ;

    $maintenant = time() ;
    if( $maintenant - $_SESSION["activite"] > DUREE_INACTIVITE || $maintenant - $_SESSION["debut"] > DUREE_SESSION_MAX )
    {
        fermeSession() ;
        return null ;
    }

    $lu = chargeCompte( $_SESSION["idCompte"] ) ;
    if( !$lu || $lu["actif"] != 1 || (int)$lu["version"] != $_SESSION["version"] )
    {
        fermeSession() ;
        return null ;
    }

    $_SESSION["activite"] = $maintenant ;
    $compte = $lu ;
    return $compte ;
}

// Jeton de session envoyé par l'appli dans l'en-tête X-Jeton
function verifieJeton()
{
    $jeton = $_SERVER["HTTP_X_JETON"] ?? "" ;
    if( !isset( $_SESSION["jeton"] ) || !is_string( $jeton ) || !hash_equals( $_SESSION["jeton"], $jeton ) ) refuse( "Session expirée, reconnectez-vous", 401 ) ;
}

function peut( $compte, $code )
{
    return $compte && in_array( $code, $compte["permissions"] ) ;
}

// En haut de chaque script qui modifie la base
function exigePermission( $code, $avecJeton = true )
{
    $compte = compteConnecte() ;
    if( !$compte ) refuse( "Session expirée, reconnectez-vous", 401 ) ;
    if( $avecJeton ) verifieJeton() ;
    if( $compte["doitChanger"] == 1 ) refuse( "Changez d'abord le mot de passe qu'on vous a donné" ) ;
    if( !peut( $compte, $code ) ) refuse( "Vous n'avez pas la permission de faire ça" ) ;
    if( $avecJeton ) register_shutdown_function( "videCache" ) ;
    return $compte ;
}

// Niveau du compte d'une personne (0 si elle n'a pas de compte)
function niveauPersonne( $idPersonne )
{
    $cursor = bd()->prepare( "select c.estRoot, r.niveau from " . table( "compte" ) . " c left join " . table( "role" ) . " r on r.id = c.idRole"
                           . " where c.idPersonne = :id" ) ;
    $cursor->execute( ["id" => $idPersonne] ) ;
    $ligne = $cursor->fetch( PDO::FETCH_ASSOC ) ;
    if( !$ligne ) return 0 ;
    return $ligne["estRoot"] == 1 ? NIVEAU_ROOT : (int)$ligne["niveau"] ;
}

// Refuse si la personne a un rôle égal ou supérieur au sien
function verifieHierarchiePersonne( $compte, $idPersonne, $soiMeme = false )
{
    if( $compte["estRoot"] || $idPersonne <= 0 ) return ;
    if( $soiMeme && (int)$compte["idPersonne"] == $idPersonne ) return ;
    if( niveauPersonne( $idPersonne ) >= $compte["niveau"] ) refuse( "Cette personne a un rôle égal ou supérieur au vôtre" ) ;
}

function journal( $action, $detail = "", $compte = null )
{
    try
    {
        $compte = $compte ?? compteConnecte() ;
        bd()->prepare( "insert into " . table( "journal" ) . " ( date, idCompte, identifiant, action, detail, ip ) values ( now(), :id, :identifiant, :action, :detail, :ip )" )
            ->execute( [
                "id" => $compte["id"] ?? null,
                "identifiant" => $compte["identifiant"] ?? null,
                "action" => $action,
                "detail" => mb_substr( $detail, 0, 255 ),
                "ip" => $_SERVER["REMOTE_ADDR"] ?? null
            ] ) ;
        bd()->exec( "delete from " . table( "journal" ) . " where date < now() - interval " . JOURS_JOURNAL . " day" ) ;
    }
    catch( Exception $erreur )
    {
        error_log( $erreur->getMessage() ) ;
    }
}

// 10 caractères minimum, sans l'identifiant dedans
function verifieMotDePasse( $mdp, $identifiant )
{
    if( !is_string( $mdp ) || mb_strlen( $mdp ) < 10 ) refuse( "Le mot de passe doit faire au moins 10 caractères", 400 ) ;
    if( mb_strlen( $mdp ) > 200 ) refuse( "Mot de passe trop long", 400 ) ;
    if( $identifiant != "" && str_contains( mb_strtolower( $mdp ), mb_strtolower( $identifiant ) ) ) refuse( "Le mot de passe ne doit pas contenir l'identifiant", 400 ) ;
}

// 12 caractères, sans l, 1, O, 0 qui se confondent
function motDePasseAleatoire()
{
    $caracteres = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789" ;
    $mdp = "" ;
    for( $i = 0 ; $i < 12 ; $i++ ) $mdp .= $caracteres[random_int( 0, strlen( $caracteres ) - 1 )] ;
    return $mdp ;
}

// Vrai si root a encore le mot de passe d'installation
function rootParDefaut()
{
    $hash = bd()->query( "select hash from " . table( "compte" ) . " where estRoot = 1" )->fetchColumn() ;
    return $hash && password_verify( MDP_ROOT_DEFAUT, $hash ) ;
}

// Compte renvoyé à l'appli
function compteAppli( $compte )
{
    return [
        "id" => (int)$compte["id"],
        "identifiant" => $compte["identifiant"],
        "nom" => $compte["nom"] ?: $compte["identifiant"],
        "estRoot" => $compte["estRoot"],
        "role" => $compte["role"],
        "couleur" => $compte["couleur"],
        "niveau" => (int)$compte["niveau"],
        "doitChanger" => $compte["doitChanger"] == 1,
        "permissions" => $compte["permissions"],
        "rootParDefaut" => rootParDefaut(),
        "jeton" => $_SESSION["jeton"] ?? ""
    ] ;
}

?>
