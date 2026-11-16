
import {Injectable} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable} from "rxjs" ;
import {Lieu} from "../modeles/Lieu" ;

@Injectable( {
    providedIn: "root" 
})
export class LieuService
{
    private http: HttpClient ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    getTousLesLieux( nom: string="", type: string = "", avecExposant: boolean = false ): Observable<Lieu[]>
    {
        let first = true ;
        let url: string = "php/lieu/tous-les-lieux.php" ;

        if( nom != "" )
        {
            url += (first)? "?" : "&" ;
            url += "nom=" + encodeURIComponent( nom ) ;
            first = false ;
        }

        if( type != "" )
        {
            url += (first)? "?" : "&" ;
            url += "type=" + encodeURIComponent( type ) ;
            first = false ;
        }

        if( avecExposant )
        {
            url += (first)? "?" : "&" ;
            url += "avecExposant=1" ;
            first = false ;
        }

        return this.http.get<Lieu[]>( url ) ;
    }

    // Types de lieu (table typelieu) commençant par debut ("" = tous)
    getTousLesTypesLieu( debut: string = "" ): Observable<{type: string}[]>
    {
        let url: string = "php/lieu/tous-les-types-lieu.php" ;

        if( debut != "" )
        {
            url += "?type=" + encodeURIComponent( debut ) ;
        }

        return this.http.get<{type: string}[]>( url ) ;
    }

    // Tous les lieux d'un hall avec leur zone sur le plan
    getLieuxDuHall( hall: number ): Observable<Lieu[]>
    {
        return this.http.get<Lieu[]>( "php/lieu/lieux-hall.php?hall=" + hall ) ;
    }

    // Enregistre la zone d'un lieu sur le plan, x1 = null pour la supprimer
    majZoneLieu( lieu: Lieu ): Observable<any>
    {
        return this.http.post( "php/lieu/maj-zone-lieu.php", {
            num: lieu.num,
            hall: lieu.hall,
            x1: lieu.x1,
            y1: lieu.y1,
            x2: lieu.x2,
            y2: lieu.y2
        } ) ;
    }

    // Lieux pour la page de config, avec le nombre d'exposants et d'événements
    getConfigLieux(): Observable<Lieu[]>
    {
        return this.http.get<Lieu[]>( "php/lieu/config-lieux.php" ) ;
    }

    // Crée (nouveau = true) ou modifie un lieu
    majLieu( lieu: Lieu, nouveau: boolean ): Observable<any>
    {
        return this.http.post( "php/lieu/maj-lieu.php", { lieu: lieu, nouveau: nouveau } ) ;
    }

    supprimeLieu( num: number ): Observable<any>
    {
        return this.http.post( "php/lieu/supprime-lieu.php", { num: num } ) ;
    }

    getLieuByNum( num: number ): Observable<Lieu[]>
    {
        let first = true ;
        let url: string = "php/lieu/lieu-num.php" ;

        if( num != -1 )
        {
            url += (first)? "?" : "&" ;
            url += "num=" + num ;
            first = false ;
        }

        return this.http.get<Lieu[]>( url ) ;
    }
    
}
