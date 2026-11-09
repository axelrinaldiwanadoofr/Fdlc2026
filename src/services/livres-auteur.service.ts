import { Injectable } from "@angular/core" ;
import { HttpClient } from "@angular/common/http" ;
import { Observable, forkJoin, of } from "rxjs" ;
import { catchError, map } from "rxjs/operators" ;

import { LivreAuteur } from "../modeles/LivreAuteur" ;

// Notice de la BnF (une edition d'un livre)
class Notice
{
    public ark: string = "" ;
    public titre: string = "" ;
    public annee: string = "" ;
    public editeur: string = "" ;
    public isbn: string = "" ;
}

// Livres d'un auteur : base du festival + catalogue de la BnF
@Injectable({
    providedIn: "root"
})
export class LivresAuteurService
{
    private http: HttpClient ;

    private espaceDc = "http://purl.org/dc/elements/1.1/" ;
    private espaceOaiDc = "http://www.openarchives.org/OAI/2.0/oai_dc/" ;

    // roles acceptés pour l'auteur
    private roles = ["auteur", "scenariste", "dessinateur", "illustrateur"] ;

    // éditeurs de rééditions (clubs, gros caractères)
    private reeditions = ["grand livre du mois", "france loisirs", "noyelles", "fl editions", "loupe", "feryane", "gabelire", "a vue d oeil", "voir de pres", "libra diffusio"] ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    getLivresAuteur( idPersonne: number, prenom: string, nom: string, rechercheBnf: boolean ): Observable<LivreAuteur[]>
    {
        let livresBd = this.http.get<any[]>( "php/livre/livres-auteur.php?id=" + idPersonne ).pipe( catchError( () => of( [] ) ) ) ;
        let xmlBnf = rechercheBnf ? this.getXmlBnf( prenom, nom ) : of( "" ) ;

        return forkJoin( [livresBd, xmlBnf] ).pipe(
            map( ( [bd, xml] ) => this.fusionne( bd, xml, prenom, nom ) )
        ) ;
    }

    // XML de la BnF (via le php qui garde la réponse en cache)
    private getXmlBnf( prenom: string, nom: string ): Observable<string>
    {
        let url = "php/livre/livres-bnf.php?prenom=" + encodeURIComponent( prenom.trim() ) + "&nom=" + encodeURIComponent( nom.trim() ) ;

        return this.http.get( url, { responseType: "text" } ).pipe( catchError( () => of( "" ) ) ) ;
    }

    private fusionne( bd: any[], xml: string, prenom: string, nom: string ): LivreAuteur[]
    {
        let livres: LivreAuteur[] = [] ;
        for( let l of bd )
        {
            livres.push( new LivreAuteur( l.id, this.nettoie( l.titre ), "", l.editeur ?? "", true ) ) ;
        }

        let titresBd = livres.map( l => l.titre ) ;
        let livresBnf = xml != "" ? this.livresBnf( xml, prenom, nom, titresBd ) : [] ;

        // livres de la base trouvés à la BnF
        for( let livre of livres )
        {
            let i = livresBnf.findIndex( l => this.titresProches( l.titre, livre.titre ) ) ;
            if( i == -1 ) continue ;

            livre.couvertures = livresBnf[i].couvertures ;
            livre.annee = livresBnf[i].annee ;
            if( livre.editeur == "" ) livre.editeur = livresBnf[i].editeur ;
            livresBnf.splice( i, 1 ) ;
        }

        livresBnf.sort( ( a, b ) => b.annee.localeCompare( a.annee ) ) ;
        return livres.concat( livresBnf ) ;
    }

    private livresBnf( xml: string, prenom: string, nom: string, titresBd: string[] ): LivreAuteur[]
    {
        let doc = new DOMParser().parseFromString( xml, "text/xml" ) ;
        let elements = doc.getElementsByTagNameNS( this.espaceOaiDc, "dc" ) ;

        // notices par homonyme (dates différentes)
        let homonymes = new Map<string, Notice[]>() ;
        for( let i = 0 ; i < elements.length ; i++ )
        {
            let element = elements[i] ;
            if( this.valeurs( element, "language" )[0] != "fre" ) continue ;
            if( !this.valeurs( element, "type" ).includes( "texte imprimé" ) ) continue ;

            let dates = this.datesAuteur( this.valeurs( element, "creator" ), prenom, nom ) ;
            if( dates == null ) continue ;

            let liste = homonymes.get( dates ) ?? [] ;
            liste.push( this.lisNotice( element ) ) ;
            homonymes.set( dates, liste ) ;
        }

        // choix de l'homonyme : livres du festival puis livres depuis 2000
        let notices: Notice[] = [] ;
        let meilleurScore = -1 ;
        for( let liste of homonymes.values() )
        {
            let score = 0 ;
            for( let titre of titresBd )
            {
                if( liste.some( n => this.titresProches( n.titre, titre ) ) ) score += 1000 ;
            }
            score += liste.filter( n => n.annee >= "2000" ).length ;

            if( score > meilleurScore )
            {
                meilleurScore = score ;
                notices = liste ;
            }
        }

        // regroupe les éditions d'un même livre
        let livres = new Map<string, LivreAuteur>() ;
        notices.sort( ( a, b ) => ( a.annee || "9999" ).localeCompare( b.annee || "9999" ) ) ;

        for( let notice of notices )
        {
            let cle = this.normalise( notice.titre ) ;
            if( cle == "" || cle == this.normalise( prenom + " " + nom ) || cle == this.normalise( nom + " " + prenom ) ) continue ;

            let livre = livres.get( cle ) ;
            if( !livre )
            {
                livre = new LivreAuteur( -1, notice.titre, notice.annee, notice.editeur ) ;
                livres.set( cle, livre ) ;
            }
            else if( this.estReedition( livre.editeur ) && !this.estReedition( notice.editeur ) )
            {
                livre.annee = notice.annee ;
                livre.editeur = notice.editeur ;
            }

            // images en cache sur notre serveur, les 2 editions les plus recentes + 1 isbn
            let bnf = livre.couvertures.filter( c => c.includes( "ark=" ) ) ;
            bnf.unshift( "php/livre/couverture.php?ark=" + encodeURIComponent( notice.ark ) ) ;
            let isbn = livre.couvertures.filter( c => c.includes( "isbn=" ) ) ;
            if( notice.isbn != "" ) isbn = ["php/livre/couverture.php?isbn=" + notice.isbn] ;
            livre.couvertures = bnf.slice( 0, 2 ).concat( isbn ) ;
        }

        return Array.from( livres.values() ) ;
    }

    // ex : "Malzieu, Mathias (1974-....). Auteur du texte"
    private datesAuteur( auteurs: string[], prenom: string, nom: string ): string | null
    {
        for( let auteur of auteurs )
        {
            let morceaux = auteur.match( /^(.*?), (.*?)(?: \((.*?)\))?\. (.*)$/ ) ;
            if( morceaux == null ) continue ;

            let memeNom = this.normalise( morceaux[1] ) == this.normalise( nom ) && this.normalise( morceaux[2] ) == this.normalise( prenom ) ;
            let role = this.normalise( morceaux[4] ) ;

            if( memeNom && this.roles.some( r => role.startsWith( r ) ) ) return morceaux[3] ?? "" ;
        }
        return null ;
    }

    private lisNotice( element: Element ): Notice
    {
        let notice = new Notice() ;
        let identifiants = this.valeurs( element, "identifier" ) ;

        let ark = identifiants.find( i => i.includes( "ark:" ) ) ?? "" ;
        notice.ark = ark.substring( ark.indexOf( "ark:" ) ) ;

        let isbn = identifiants.find( i => i.startsWith( "ISBN" ) ) ?? "" ;
        notice.isbn = isbn.replace( /[^0-9X]/g, "" ) ;

        notice.titre = this.titreCourt( this.valeurs( element, "title" )[0] ?? "" ) ;
        notice.annee = ( this.valeurs( element, "date" )[0] ?? "" ).substring( 0, 4 ) ;

        notice.editeur = ( this.valeurs( element, "publisher" )[0] ?? "" ).replace( / \(.*$/, "" ) ;
        return notice ;
    }

    private valeurs( element: Element, balise: string ): string[]
    {
        let liste = element.getElementsByTagNameNS( this.espaceDc, balise ) ;
        let valeurs: string[] = [] ;
        for( let i = 0 ; i < liste.length ; i++ )
        {
            valeurs.push( ( liste[i].textContent ?? "" ).trim() ) ;
        }
        return valeurs ;
    }

    private estReedition( editeur: string ): boolean
    {
        let e = this.normalise( editeur ) ;
        return this.reeditions.some( r => e.includes( r ) ) ;
    }

    // Titre sans sous-titre ni auteur
    private titreCourt( titre: string ): string
    {
        titre = titre.split( " / " )[0] ;
        titre = titre.split( / : | ; | - |\(|\[| ?suivi de /i )[0] ;
        return this.nettoie( titre ) ;
    }

    private nettoie( texte: string ): string
    {
        return ( texte ?? "" ).replace( /\u00a0/g, " " ).replace( /\s+/g, " " ).trim() ;
    }

    // minuscules sans accents
    private normalise( texte: string ): string
    {
        texte = ( texte ?? "" ).normalize( "NFD" ).replace( /[\u0300-\u036f]/g, "" ).toLowerCase() ;
        return texte.replace( /[^a-z0-9]+/g, " " ).trim() ;
    }

    // Titres égaux ou presque (60% de mots en commun)
    private titresProches( a: string, b: string ): boolean
    {
        a = this.normalise( a ) ;
        b = this.normalise( b ) ;
        if( a == "" || b == "" ) return false ;
        if( a == b || a.startsWith( b + " " ) || b.startsWith( a + " " ) ) return true ;

        let motsA = a.split( " " ) ;
        let motsB = b.split( " " ) ;
        let communs = motsA.filter( m => motsB.includes( m ) ).length ;
        let total = new Set( motsA.concat( motsB ) ).size ;
        return communs / total >= 0.6 ;
    }
}
