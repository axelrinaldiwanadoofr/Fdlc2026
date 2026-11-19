
import {Injectable} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable} from "rxjs" ;
import {Exposant} from "../modeles/Exposant" ;
import {PersonneStand} from "../modeles/PersonneStand" ;
import {simplifie} from "../outils/recherche" ;

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

    getTousLesExposants( nom: string = "", nomLieu: string = "" ): Observable<Exposant[]>
    {
        let first = true ;
        let url = "php/exposant/tous-les-exposants.php" ;

        if( nom != "" ) 
        {
            url += (first)? "?" : "&" ;
            url += "nom=" + encodeURIComponent( nom ) ;
            first = false ;
        }

        if( nomLieu != "" ) 
        {
            url += (first)? "?" : "&" ;
            url += "nomLieu=" + encodeURIComponent( nomLieu ) ;
            first = false ;
        }

        return this.http.get<Exposant[]>( url ) ;
        
    }

    // Type affiché dans les filtres : "editeur" et "éditeur", "libraire" et "librairie" sont le même
    nomType( type: string ): string
    {
        let simple = simplifie( type ) ;
        if( simple == "" ) return "Autre" ;
        if( simple.startsWith( "edit" ) ) return "Éditeur" ;
        if( simple.startsWith( "librair" ) ) return "Librairie" ;
        return type.trim().charAt( 0 ).toUpperCase() + type.trim().slice( 1 ).toLowerCase() ;
    }

    getExposantById( id: number = -1 ): Observable<Exposant[]>
    {
        let first = true ;
        let url = "php/exposant/exposant-id.php" ;

        if( id != -1 ) 
        {
            url += (first)? "?" : "&"  
            url += "id=" + id ;
        }

        return this.http.get<Exposant[]>( url ) ;
    }

    // Personnes du stand avec leurs créneaux de présence
    getPersonnesExposant( id: number ): Observable<PersonneStand[]>
    {
        return this.http.get<PersonneStand[]>( "php/exposant/personnes-exposant.php?id=" + id ) ;
    }

    // Autres exposants qui partagent le stand
    getExposantsStand( id: number ): Observable<Exposant[]>
    {
        return this.http.get<Exposant[]>( "php/exposant/exposants-stand.php?id=" + id ) ;
    }

    // Récupérer les exposants associés à une personne
    // ainsi que ses créneaux de présence chez chaque exposant
    getExposantsByPersonne(idPersonne: number): Observable<Exposant[]>
    {
        // Construire l'URL avec l'identifiant de la personne
        const url = "php/exposant/tous-les-exposants.php?idPersonne="
                    + idPersonne;

        // Récupérer les informations depuis le fichier PHP
        return this.http.get<Exposant[]>(url);
    }

    // Page de config des exposants

    getConfigExposants(): Observable<Exposant[]>
    {
        return this.http.get<Exposant[]>( "php/exposant/config-exposants.php" ) ;
    }

    getTypesExposant(): Observable<string[]>
    {
        return this.http.get<string[]>( "php/exposant/types-exposant.php" ) ;
    }

    majExposant( exposant: Exposant ): Observable<any>
    {
        return this.http.post( "php/exposant/maj-exposant.php", { exposant: exposant } ) ;
    }

    // Avec idGarde, les personnes et les livres passent sur cet exposant avant la suppression
    supprimeExposant( id: number, idGarde: number = -1 ): Observable<any>
    {
        return this.http.post( "php/exposant/supprime-exposant.php", { id: id, idGarde: idGarde } ) ;
    }
}
