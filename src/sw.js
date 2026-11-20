// Auteur: Kevin MEYER - 20/11/2026

// Garde le site et les données du festival sur le téléphone :
// si le réseau du salon sature, l'appli marche avec les dernières infos chargées
const CACHE = "fdlc" ;
const ATTENTE_RESEAU = 4000 ;

// listes et images gardées dès la première visite, pour les pages pas encore ouvertes
const A_PREPARER = [
    "php/evenement/programme.php", "php/evenement/filtres-evenements.php", "php/annonce/annonces.php",
    "php/exposant/tous-les-exposants.php", "php/lieu/tous-les-lieux.php", "php/livre/tous-les-livres.php",
    "php/personne/toutes-les-personnes.php", "php/personne/specialites.php", "php/parametre/parametres.php",
    "php/lieu/lieux-hall.php?hall=1", "php/lieu/lieux-hall.php?hall=2", "php/lieu/lieux-hall.php?hall=3",
    "php/lieu/lieux-hall.php?hall=4", "php/lieu/lieux-hall.php?hall=5",
    "assets/plans/global.png", "assets/plans/hall1.png", "assets/plans/hall2.png", "assets/plans/hall3.png",
    "assets/plans/hall4.png", "assets/plans/hall5.png", "assets/afficheFdlc2026.jpg"
] ;

self.addEventListener( "install", evenement =>
{
    self.skipWaiting() ;
    evenement.waitUntil( prepare().catch( () => {} ) ) ;
}) ;
self.addEventListener( "activate", evenement => evenement.waitUntil( self.clients.claim() ) ) ;

self.addEventListener( "fetch", evenement =>
{
    let requete = evenement.request ;
    let url = new URL( requete.url ) ;

    // comptes, config et imports ne sont jamais gardés
    if( requete.method != "GET" || url.origin != location.origin ) return ;
    if( /\/php\/(compte|config|updatebd)\/|prepare-cache-bnf/.test( url.pathname ) ) return ;

    if( requete.mode == "navigate" ) evenement.respondWith( reseauPuisCache( requete, new URL( "index.html", self.registration.scope ).href ) ) ;
    else if( url.pathname.includes( "/php/" ) && !url.pathname.endsWith( "couverture.php" ) ) evenement.respondWith( reseauPuisCache( requete, requete.url ) ) ;
    else evenement.respondWith( cachePuisReseau( requete ) ) ;
}) ;

// Au premier passage : toute l'appli (en suivant les fichiers cités par index.html et les scripts) et les données
async function prepare()
{
    let cache = await caches.open( CACHE ) ;
    let base = self.registration.scope ;
    let aVoir = ["index.html"] ;
    let vus = new Set() ;

    while( aVoir.length > 0 )
    {
        let fichier = aVoir.pop() ;
        if( vus.has( fichier ) ) continue ;
        vus.add( fichier ) ;

        let reponse = await fetch( base + fichier ) ;
        if( !reponse.ok ) continue ;
        await cache.put( base + fichier, reponse.clone() ) ;
        if( !/\.(html|js|css)$/.test( fichier ) ) continue ;

        let texte = await reponse.text() ;
        for( let trouve of texte.matchAll( /(?:chunk|main|polyfills|styles)-[\w-]+\.(?:js|css)|media\/[\w.-]+\.\w+/g ) ) aVoir.push( trouve[0] ) ;
    }

    for( let url of A_PREPARER ) await cache.add( base + url ).catch( () => {} ) ;
}

// Données et pages : le réseau d'abord, la copie gardée s'il ne répond pas assez vite
async function reseauPuisCache( requete, cle )
{
    let cache = await caches.open( CACHE ) ;
    try
    {
        let reponse = await Promise.race( [
            fetch( requete ),
            new Promise( ( resolve, reject ) => setTimeout( reject, ATTENTE_RESEAU ) )
        ] ) ;
        if( reponse.ok ) cache.put( cle, reponse.clone() ) ;
        return reponse ;
    }
    catch( erreur )
    {
        return ( await cache.match( cle ) ) ?? Response.error() ;
    }
}

// Fichiers de l'appli, images et couvertures : la copie gardée tout de suite, mise à jour en fond
async function cachePuisReseau( requete )
{
    let cache = await caches.open( CACHE ) ;
    let garde = await cache.match( requete ) ;
    let reseau = fetch( requete ).then( reponse =>
    {
        if( reponse.ok ) cache.put( requete, reponse.clone() ) ;
        return reponse ;
    }).catch( () => garde ?? Response.error() ) ;

    return garde ?? reseau ;
}
