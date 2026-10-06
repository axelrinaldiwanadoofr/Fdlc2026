
import {Injectable} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable} from "rxjs" ;
import {Exposant} from "../modeles/Exposant" ;

@Injectable( {
    providedIn: "root" 
})
export class ExposantService
{
    private http: HttpClient ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    getTousLesExposants(): Observable<Exposant[]>
    {
        return this.http.get<Exposant[]>( "php/exposant/tous-les-exposants.php" ) ;
    }

    getExposantParId( id: number ): Observable<Exposant|null>
    {
        return this.http.get<Exposant|null>( "php/exposant/exposant-id.php?id" + id ) ;
    }

    /*
    rechercheParTitre( titre: string ): Observable<Film[]>
    {
        return this.http.get<Film[]>( "http://localhost/myApp/php/films/rechercheParTitre.php?r-titre=" + titre ) ;
    }*/
}