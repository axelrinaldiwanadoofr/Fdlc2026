
import {Injectable} from "@angular/core" ;
import {HttpClient, HttpParams} from "@angular/common/http" ;
import {Observable} from "rxjs" ;
import { Evenement } from '../modeles/Evenement';


@Injectable( {
    providedIn: "root"
})
export class EvenementService
{
    private http: HttpClient ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    // Liste des themes qui commencent par theme
    getThemesEvenements( theme: string = "" ): Observable<string[]>
    {
        let params = new HttpParams() ;

        if( theme != "" ) params = params.set( "theme", theme ) ;

        return this.http.get<string[]>( "php/evenement/themes-evenements.php", { params } ) ;
    }

    getTousLesEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(
        'php/evenement/tous-les-evenements.php'
    );
    }



}
