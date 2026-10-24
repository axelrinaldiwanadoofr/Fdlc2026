
import {Injectable} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable} from "rxjs" ;
import {Personne} from "../modeles/Personne" ;

@Injectable( {
    providedIn: "root" 
})
export class PersonneService
{
    private http: HttpClient ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    getToutesLesPersonnes( nom: string="" ): Observable<Personne[]>
    {
        let first = true ;
        let url: string = "php/personne/toutes-les-personnes.php" ;

        if( nom != "" )
        {
            url += (first)? "?" : "&" ;
            url += "nom=" + nom ;
            first = false ;
        }

        return this.http.get<Personne[]>( url ) ;
    }

    /*
    rechercheParTitre( titre: string ): Observable<Film[]>
    {
        return this.http.get<Film[]>( "http://localhost/myApp/php/films/rechercheParTitre.php?r-titre=" + titre ) ;
    }*/
}