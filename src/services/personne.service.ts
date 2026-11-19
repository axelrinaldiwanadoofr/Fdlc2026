
import {Injectable} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Observable} from "rxjs" ;
import {Personne} from "../modeles/Personne" ;
import {PresenceStand} from "../modeles/PresenceStand" ;

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
            url += "nom=" + encodeURIComponent( nom ) ;
            first = false ;
        }

        return this.http.get<Personne[]>( url ) ;
    }
        
    // Renvoie la personne d'id donné (null si elle n'existe pas)
    getPersonneById( id: number ): Observable<Personne>
    {
        return this.http.get<Personne>( "php/personne/personne-by-id.php?id=" + id ) ;
    }

    // Renvoie les personnes correspondant aux critères renseignés.
    // Les critères vides ("" ou -1) sont ignorés, les autres se cumulent (AND).
    getToutesLesPersonnesK(
        id: number = -1,
        specialite: string = "",
        idExposant: number = -1,
        nom: string = "",
        titreLivre: string = "",
        titreEvenement: string = "",
        nomExposant: string = "",
        numLieu: number = -1 ): Observable<Personne[]>
    {
        let first = true ;
        let url: string = "php/personne/liste-personnes.php" ;

        // Liste des critères à transmettre au script PHP
        let criteres: [string, string | number, boolean][] = [
            [ "id", id, id != -1 ],
            [ "specialite", specialite, specialite != "" ],
            [ "idExposant", idExposant, idExposant != -1 ],
            [ "nom", nom, nom != "" ],
            [ "titreLivre", titreLivre, titreLivre != "" ],
            [ "titreEvenement", titreEvenement, titreEvenement != "" ],
            [ "nomExposant", nomExposant, nomExposant != "" ],
            [ "numLieu", numLieu, numLieu != -1 ]
        ] ;

        for( let [nomCritere, valeur, renseigne] of criteres )
        {
            if( renseigne )
            {
                url += (first)? "?" : "&" ;
                url += nomCritere + "=" + encodeURIComponent( valeur ) ;
                first = false ;
            }
        }

        return this.http.get<Personne[]>( url ) ;
    }

    // Page de config des personnes

    getConfigPersonnes(): Observable<Personne[]>
    {
        return this.http.get<Personne[]>( "php/personne/config-personnes.php" ) ;
    }

    getConfigPersonne( id: number ): Observable<{ personne: Personne, creneaux: PresenceStand[], idLivres: number[], protege: boolean }>
    {
        return this.http.get<{ personne: Personne, creneaux: PresenceStand[], idLivres: number[], protege: boolean }>( "php/personne/config-personne.php?id=" + id ) ;
    }

    getSpecialites(): Observable<string[]>
    {
        return this.http.get<string[]>( "php/personne/specialites.php" ) ;
    }

    majPersonne( personne: Personne, creneaux: PresenceStand[], idLivres: number[] ): Observable<any>
    {
        return this.http.post( "php/personne/maj-personne.php", { personne: personne, creneaux: creneaux, idLivres: idLivres } ) ;
    }

    supprimePersonne( id: number ): Observable<any>
    {
        return this.http.post( "php/personne/supprime-personne.php", { id: id } ) ;
    }

    // Ajoute une spécialité, ou la supprime si supprimer = true
    // Spécialités qui ont l'étiquette STAFF
    getSpecialitesStaff(): Observable<string[]>
    {
        return this.http.get<string[]>( "php/personne/specialites.php?staff=1" ) ;
    }

    majStaff( specialite: string, staff: boolean ): Observable<any>
    {
        return this.http.post( "php/personne/maj-specialite.php", { specialite: specialite, staff: staff } ) ;
    }

    majSpecialite( specialite: string, supprimer: boolean ): Observable<any>
    {
        return this.http.post( "php/personne/maj-specialite.php", { specialite: specialite, supprimer: supprimer } ) ;
    }

    // Envoie le fichier de la photo, renvoie son chemin (assets/photos/...)
    envoiePhoto( fichier: File ): Observable<{ photo: string }>
    {
        let formulaire = new FormData() ;
        formulaire.append( "photo", fichier ) ;
        return this.http.post<{ photo: string }>( "php/personne/photo-personne.php", formulaire ) ;
    }
}
