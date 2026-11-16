// Auteur: Kevin MEYER - 16/11/2026

import {Injectable} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable} from "rxjs" ;
import {Annonce} from "../modeles/Annonce" ;

@Injectable( {
    providedIn: "root"
})
export class AnnonceService
{
    private http: HttpClient ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    // Annonces à afficher maintenant (toutes = true pour la page de config)
    getAnnonces( toutes: boolean = false ): Observable<Annonce[]>
    {
        return this.http.get<Annonce[]>( "php/annonce/annonces.php" + ( toutes ? "?toutes=1" : "" ) ) ;
    }

    majAnnonce( mdp: string, annonce: Annonce ): Observable<any>
    {
        return this.http.post( "php/annonce/maj-annonce.php", { mdp: mdp, annonce: annonce } ) ;
    }

    supprimeAnnonce( mdp: string, id: number ): Observable<any>
    {
        return this.http.post( "php/annonce/supprime-annonce.php", { mdp: mdp, id: id } ) ;
    }
}
