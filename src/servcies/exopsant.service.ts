
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
        return this.http.get<Exposant[]>(
            "http://localhost/Fdlc2026/php/exposant/tous-les-exposants.php"
        );
    }

    /*permet de récupérer un exposant précis grâce à son identifiant.*/
    getExposantParId(id: number): Observable<Exposant[]>
    {
        return this.http.get<Exposant[]>(
            "http://localhost/Fdlc2026/php/exposant/exposant-id.php?id=" + id
        );
    }

    /*
    rechercheParTitre( titre: string ): Observable<Film[]>
    {
        return this.http.get<Film[]>( "http://localhost/myApp/php/films/rechercheParTitre.php?r-titre=" + titre ) ;
    }*/
}