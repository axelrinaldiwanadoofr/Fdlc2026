<?php

// Auteur: Kevin MEYER - 04/11/2026

// Mot de passe des pages de config (plans, evenements), on garde seulement le hash.
// Quand on le change, le hash est mis dans mot-de-passe.hash.php
//
// Pour le reset : supprimer mot-de-passe.hash.php (retour a fdlc2026) ou faire
// php -r "file_put_contents('mot-de-passe.hash.php', '<?php return ' . var_export(password_hash('nouveau', PASSWORD_DEFAULT), true) . ';');"

$hashParDefaut = '$2y$10$TeU61z314J7aeOz9nvUVKubTurNyDkHQqm6oSpzc5rwzJHG0GP9eC' ;
$fichierHash = __DIR__ . "/mot-de-passe.hash.php" ;

// Contre les essais en boucle : apres 5 erreurs l'adresse IP est bloquee 5 minutes
$fichierEssais = sys_get_temp_dir() . "/fdlc2026-essais-mdp.json" ;
$nbEssaisMax = 5 ;
$dureeBlocage = 300 ;

function hashMotDePasse()
{
    global $hashParDefaut, $fichierHash ;

    if( file_exists( $fichierHash ) ) return include $fichierHash ;
    return $hashParDefaut ;
}

// Essais ratés de chaque adresse IP : [ ip => [ "nb" => ..., "debut" => ... ] ]
function lisEssais()
{
    global $fichierEssais, $dureeBlocage ;

    $essais = [] ;
    if( file_exists( $fichierEssais ) ) $essais = json_decode( file_get_contents( $fichierEssais ), true ) ?? [] ;

    // on oublie les anciens essais
    foreach( $essais as $ip => $essai )
    {
        if( time() - $essai["debut"] >= $dureeBlocage ) unset( $essais[$ip] ) ;
    }
    return $essais ;
}

function estBloque()
{
    global $nbEssaisMax ;

    $essais = lisEssais() ;
    $ip = $_SERVER["REMOTE_ADDR"] ?? "" ;
    return isset( $essais[$ip] ) && $essais[$ip]["nb"] >= $nbEssaisMax ;
}

// Le mot de passe fdlc2026 est écrit dans le dépôt : sur le vrai serveur il faut le changer
function motDePasseParDefaut()
{
    global $fichierHash ;
    return !file_exists( $fichierHash ) ;
}

function estLocal()
{
    return in_array( $_SERVER["REMOTE_ADDR"] ?? "", ["127.0.0.1", "::1"] ) ;
}

// accepteParDefaut : seulement pour se connecter et changer le mot de passe
function motDePasseOk( $mdp, $accepteParDefaut = false )
{
    global $fichierEssais ;

    if( estBloque() ) return false ;

    $ok = is_string( $mdp ) && password_verify( $mdp, hashMotDePasse() ) ;
    if( $ok && !$accepteParDefaut && motDePasseParDefaut() && !estLocal() ) return false ;

    $essais = lisEssais() ;
    $ip = $_SERVER["REMOTE_ADDR"] ?? "" ;

    if( $ok ) unset( $essais[$ip] ) ;
    else
    {
        if( !isset( $essais[$ip] ) ) $essais[$ip] = [ "nb" => 0, "debut" => time() ] ;
        $essais[$ip]["nb"]++ ;
    }

    file_put_contents( $fichierEssais, json_encode( $essais ), LOCK_EX ) ;
    return $ok ;
}

// Session PHP ouverte à la connexion, pour les pages PHP (imports de la base, cache BnF)
// elle se ferme après 15 minutes sans activité comme la page de config
function demarreSession()
{
    if( session_status() == PHP_SESSION_ACTIVE ) return ;

    session_name( "fdlc2026" ) ;
    session_set_cookie_params( [
        "httponly" => true,
        "samesite" => "Strict",
        "secure" => ( $_SERVER["HTTPS"] ?? "" ) == "on" || ( $_SERVER["HTTP_X_FORWARDED_PROTO"] ?? "" ) == "https"
    ] ) ;
    session_start() ;
}

function ouvreSessionConfig()
{
    demarreSession() ;
    session_regenerate_id( true ) ;
    $_SESSION["config"] = time() ;
}

function fermeSessionConfig()
{
    demarreSession() ;
    $_SESSION = [] ;
    session_destroy() ;
}

function sessionConfigOk()
{
    demarreSession() ;
    if( !isset( $_SESSION["config"] ) || time() - $_SESSION["config"] > 15 * 60 ) return false ;

    $_SESSION["config"] = time() ;
    return true ;
}

function changeMotDePasse( $nouveau )
{
    global $fichierHash ;

    $contenu = "<?php return " . var_export( password_hash( $nouveau, PASSWORD_DEFAULT ), true ) . ";" ;
    return file_put_contents( $fichierHash, $contenu ) !== false ;
}

?>
