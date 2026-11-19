// Auteur: Kevin MEYER - 19/11/2026

import {Injectable, signal} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable, tap} from "rxjs" ;

// Réglages communs à tout le site (choix de la page d'accueil)
@Injectable( {
    providedIn: "root"
})
export class ParametreService
{
    private http: HttpClient ;

    // "ancien" ou "nouveau", vide tant que ce n'est pas chargé
    public accueil = signal( "" ) ;

    constructor( http: HttpClient )
    {
        this.http = http ;
        this.charge() ;
    }

    charge()
    {
        this.http.get<any>( "php/parametre/parametres.php" ).subscribe( {
            next: parametres => this.accueil.set( parametres.accueil ?? "ancien" ),
            error: () => this.accueil.set( "ancien" )
        }) ;
    }

    changeAccueil( valeur: string ): Observable<any>
    {
        return this.http.post( "php/parametre/maj-parametre.php", { cle: "accueil", valeur: valeur } )
            .pipe( tap( () => this.accueil.set( valeur ) ) ) ;
    }
}
