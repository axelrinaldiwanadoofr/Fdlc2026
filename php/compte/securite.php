<?php

// Auteur: Kevin MEYER - 16/11/2026

// Comptes de connexion à la configuration : session, rôles, permissions et hiérarchie.
// Le compte root est au-dessus de tous les rôles, il ne peut être ni supprimé ni désactivé.

require_once __DIR__ . "/../Connexion.php" ;

const NIVEAU_ROOT = 1000 ;
const DUREE_INACTIVITE = 15 * 60 ;
const DUREE_SESSION_MAX = 8 * 3600 ;
const ESSAIS_MAX = 5 ;

// Mot de passe du compte root à l'installation, la page config prévient tant qu'il n'est pas changé
const MDP_ROOT_DEFAUT = "fdlc2026" ;
const DUREE_BLOCAGE = 15 * 60 ;

// Liste des permissions, rangées par groupe pour la page des rôles
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

// Tables créées au premier lancement (on n'a pas accès à la base du serveur)
function creeTables()
{
    $bd = bd() ;
    $bd->exec( "create table if not exists " . table( "role" ) . " ( id int not null auto_increment primary key,"
             . " nom varchar(40) not null unique, niveau int not null, couleur varchar(7) not null default '#6b7280' ) engine=InnoDB" ) ;
    $bd->exec( "create table if not exists " . table( "permission" ) . " ( idRole int not null, code varchar(40) not null,"
             . " primary key ( idRole, code ), foreign key ( idRole ) references " . table( "role" ) . " ( id ) on delete cascade ) engine=InnoDB" ) ;
    $bd->exec( "create table if not exists " . table( "compte" ) . " ( id int not null auto_increment primary key,"
             . " identifiant varchar(50) not null unique, hash varchar(255) not null, estRoot tinyint(1) not null default 0,"
             . " idRole int default null, idPersonne int default null unique, actif tinyint(1) not null default 1,"
             . " doitChanger tinyint(1) not null default 0, version int not null default 1, essais int not null default 0,"
             . " bloqueJusqua datetime default null, derniereConnexion datetime default null, creeLe datetime not null,"
             . " foreign key ( idRole ) references " . table( "role" ) . " ( id ),"
             . " foreign key ( idPersonne ) references " . table( "personne" ) . " ( id ) on delete cascade ) engine=InnoDB" ) ;
    $bd->exec( "create table if not exists " . table( "journal" ) . " ( id int not null auto_increment primary key,"
             . " date datetime not null, idCompte int default null, identifiant varchar(50) default null,"
             . " action varchar(60) not null, detail varchar(255) default null, ip varchar(45) default null ) engine=InnoDB" ) ;

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

// Session : cookie HttpOnly, SameSite Strict, Secure en https
function demarreSession()
{
    if( session_status() == PHP_SESSION_ACTIVE ) return ;

    session_name( "fdlc2026" ) ;
    session_set_cookie_params( [
        "path" => "/",
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
        $compte["couleur"] = "#111827" ;
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

// Compte connecté, relu dans la base à chaque appel : une désactivation
// ou un changement de mot de passe coupe la session tout de suite
function compteConnecte()
{
    static $compte = false ;
    if( $compte !== false ) return $compte ;

    $compte = null ;
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

// Toute modification doit venir de l'appli : jeton de session dans l'en-tête X-Jeton
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

// On ne touche pas à une personne dont le rôle est égal ou supérieur au sien
// (sa propre fiche peut être modifiée si soiMeme = true, jamais supprimée)
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
    }
    catch( Exception $erreur )
    {
        error_log( $erreur->getMessage() ) ;
    }
}

// Mot de passe : 10 caractères minimum, pas l'identifiant dedans
function verifieMotDePasse( $mdp, $identifiant )
{
    if( !is_string( $mdp ) || mb_strlen( $mdp ) < 10 ) refuse( "Le mot de passe doit faire au moins 10 caractères", 400 ) ;
    if( mb_strlen( $mdp ) > 200 ) refuse( "Mot de passe trop long", 400 ) ;
    if( $identifiant != "" && str_contains( mb_strtolower( $mdp ), mb_strtolower( $identifiant ) ) ) refuse( "Le mot de passe ne doit pas contenir l'identifiant", 400 ) ;
}

// Mot de passe donné à une personne : 12 caractères sans les lettres qui se confondent (l, 1, O, 0...)
function motDePasseAleatoire()
{
    $caracteres = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789" ;
    $mdp = "" ;
    for( $i = 0 ; $i < 12 ; $i++ ) $mdp .= $caracteres[random_int( 0, strlen( $caracteres ) - 1 )] ;
    return $mdp ;
}

// Essais ratés par adresse IP, en plus du blocage de chaque compte
function fichierEssais()
{
    return sys_get_temp_dir() . "/fdlc2026-essais-ip.json" ;
}

function essaisIp()
{
    $essais = [] ;
    if( is_file( fichierEssais() ) ) $essais = json_decode( file_get_contents( fichierEssais() ), true ) ?? [] ;
    foreach( $essais as $ip => $essai ) if( time() - $essai["debut"] >= DUREE_BLOCAGE ) unset( $essais[$ip] ) ;
    return $essais ;
}

function ipBloquee()
{
    $essais = essaisIp() ;
    $ip = $_SERVER["REMOTE_ADDR"] ?? "" ;
    return isset( $essais[$ip] ) && $essais[$ip]["nb"] >= 3 * ESSAIS_MAX ;
}

function noteEssaiIp( $reussi )
{
    $essais = essaisIp() ;
    $ip = $_SERVER["REMOTE_ADDR"] ?? "" ;
    if( $reussi ) unset( $essais[$ip] ) ;
    else
    {
        if( !isset( $essais[$ip] ) ) $essais[$ip] = ["nb" => 0, "debut" => time()] ;
        $essais[$ip]["nb"]++ ;
    }
    file_put_contents( fichierEssais(), json_encode( $essais ), LOCK_EX ) ;
}

function rootParDefaut()
{
    $hash = bd()->query( "select hash from " . table( "compte" ) . " where estRoot = 1" )->fetchColumn() ;
    return $hash && password_verify( MDP_ROOT_DEFAUT, $hash ) ;
}

// Ce que l'appli a besoin de savoir sur le compte connecté
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
