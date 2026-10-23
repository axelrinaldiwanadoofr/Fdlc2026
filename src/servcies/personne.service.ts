
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

    getToutesLesPersonnes(): Observable<Personne[]>
    {
        return this.http.get<Personne[]>( "php/personne/toutes-les-personnes.php" ) ;
    }

    /*
    rechercheParTitre( titre: string ): Observable<Film[]>
    {
        return this.http.get<Film[]>( "http://localhost/myApp/php/films/rechercheParTitre.php?r-titre=" + titre ) ;
    }*/
}