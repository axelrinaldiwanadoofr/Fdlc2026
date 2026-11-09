import { Injectable } from "@angular/core" ;
import { HttpClient } from "@angular/common/http" ;
import { Observable } from "rxjs" ;

@Injectable( {
    providedIn: "root"
})
export class DebutEvenementService
{
    private http: HttpClient ;

    constructor( http: HttpClient )
    {
        this.http = http ; 
    }

    getDebuts( debutMin: string = "", texte: string = "" ): Observable<string[]>
    {
        return this.http.get<string[]>( "php/evenement/debuts-evenements.php",
            { params: { debut: debutMin, texte: texte } } ) ;
    }
}