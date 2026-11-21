// Auteur: Kevin MEYER - 19/11/2026

import {Injectable, computed, signal} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable, tap} from "rxjs" ;

// Réglages communs à tout le site : page d'accueil et réglages du festival
@Injectable( {
    providedIn: "root"
})
export class ParametreService
{
    private http: HttpClient ;

    // valeurs utilisées tant que rien n'a été changé dans la page Réglages
    public defauts: any = {
        titre: "Festival du livre de Colmar 2026",
        debut: "2026-11-21",
        fin: "2026-11-22",
        lieu: "Parc des Expositions de Colmar",
        lienLycee: "https://lyceecamilleseecolmar.fr",
        siteFestival: "",
        nomHall1: "", nomHall2: "", nomHall3: "", nomHall4: "", nomHall5: "",
        contact: "Le lycée Camille Sée de Colmar, qui héberge l'application",
        professeur: "M. Axel RINALDI",
        etudiants: "Don-Divin KISSANGOU MABIALA\nÉlodie VERMOYAL-DESAPHY\nKevin MEYER\nKenisha HAAS\nLiam EHRHARD\nMathieu SIMON\n"
                  + "Merve YASAR\nNadir MAHI\nRabbi DZALAMOU\nRicardo PATTA\nSidi BENHADJEBA\nYannis Benewinde SILGA",
        affiche: "",
        plan0: ""
    } ;

    // "ancien" ou "nouveau", vide tant que ce n'est pas chargé
    public accueil = signal( "" ) ;
    public reglages = signal<any>( this.defauts ) ;

    public dates = computed( () => this.texteDates( this.reglages().debut, this.reglages().fin ) ) ;
    public affiche = computed( () => this.reglages().affiche || "assets/afficheFdlc2026.jpg" ) ;
    public jours = computed( () => this.listeJours( this.reglages().debut, this.reglages().fin ) ) ;
    public etudiants = computed( () => this.reglages().etudiants.split( "\n" ).map( ( e: string ) => e.trim() ).filter( ( e: string ) => e != "" ) ) ;

    constructor( http: HttpClient )
    {
        this.http = http ;
        this.charge() ;
    }

    charge()
    {
        this.http.get<any>( "php/parametre/parametres.php" ).subscribe( {
            next: parametres =>
            {
                let reglages = Object.assign( {}, this.defauts ) ;
                for( let cle in parametres ) if( cle != "accueil" && parametres[cle] != "" ) reglages[cle] = parametres[cle] ;
                this.reglages.set( reglages ) ;
                this.accueil.set( parametres.accueil ?? "ancien" ) ;
            },
            error: () => this.accueil.set( "ancien" )
        }) ;
    }

    changeAccueil( valeur: string ): Observable<any>
    {
        return this.http.post( "php/parametre/maj-parametre.php", { cle: "accueil", valeur: valeur } )
            .pipe( tap( () => this.accueil.set( valeur ) ) ) ;
    }

    majReglages( valeurs: any ): Observable<any>
    {
        return this.http.post( "php/parametre/maj-parametre.php", { valeurs: valeurs } )
            .pipe( tap( () => this.charge() ) ) ;
    }

    envoieImage( pour: string, fichier: File ): Observable<any>
    {
        let donnees = new FormData() ;
        donnees.append( "pour", pour ) ;
        donnees.append( "image", fichier ) ;
        return this.http.post( "php/parametre/image-reglage.php", donnees ) ;
    }

    // image du plan d'un hall (0 = plan général), celle d'origine si aucune n'a été envoyée
    plan( hall: number ): string
    {
        if( this.reglages()["plan" + hall] ) return this.reglages()["plan" + hall] ;
        return hall == 0 ? "assets/plans/global.png" : "assets/plans/hall" + hall + ".png" ;
    }

    // "2026-11-21" => date locale à minuit
    date( texte: string ): Date
    {
        let morceaux = texte.split( "-" ) ;
        return new Date( Number( morceaux[0] ), Number( morceaux[1] ) - 1, Number( morceaux[2] ) ) ;
    }

    // jours du festival pour les listes de choix : [{ date: "2026-11-21", nom: "Samedi 21" }...]
    listeJours( debut: string, fin: string ): any[]
    {
        let jours = [] ;
        let format = new Intl.DateTimeFormat( "fr-FR", { weekday: "long", day: "numeric" } ) ;
        let jour = this.date( debut ) ;
        let dernier = this.date( fin ) ;

        while( jour <= dernier && jours.length < 10 )
        {
            let nom = format.format( jour ) ;
            let date = jour.getFullYear() + "-" + String( jour.getMonth() + 1 ).padStart( 2, "0" ) + "-" + String( jour.getDate() ).padStart( 2, "0" ) ;
            jours.push( { date: date, nom: nom.charAt( 0 ).toUpperCase() + nom.slice( 1 ) } ) ;
            jour.setDate( jour.getDate() + 1 ) ;
        }
        return jours ;
    }

    // "21 et 22 novembre 2026", "21 novembre 2026" ou "30 novembre au 2 décembre 2026"
    texteDates( debut: string, fin: string ): string
    {
        let format = new Intl.DateTimeFormat( "fr-FR", { day: "numeric", month: "long", year: "numeric" } ) ;
        let d = this.date( debut ) ;
        let f = this.date( fin ) ;
        let jours = Math.round( ( f.getTime() - d.getTime() ) / 86400000 ) ;

        if( jours <= 0 ) return format.format( d ) ;
        if( d.getMonth() == f.getMonth() && d.getFullYear() == f.getFullYear() )
            return d.getDate() + ( jours == 1 ? " et " : " au " ) + format.format( f ) ;
        return new Intl.DateTimeFormat( "fr-FR", { day: "numeric", month: "long" } ).format( d ) + " au " + format.format( f ) ;
    }
}
