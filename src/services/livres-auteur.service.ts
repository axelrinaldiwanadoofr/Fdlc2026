import { Injectable } from "@angular/core" ;
import { HttpClient } from "@angular/common/http" ;
import { Observable, forkJoin, of } from "rxjs" ;
import { catchError, map } from "rxjs/operators" ;

import { LivreAuteur } from "../modeles/LivreAuteur" ;

// Une edition d'un livre dans le catalogue de la BnF
class Notice
{
    public ark: string = "" ;
    public titre: string = "" ;
    public annee: string = "" ;
    public editeur: string = "" ;
    public isbn: string = "" ;
}

// Livres d'un auteur : ceux de la base + ceux du catalogue de la BnF
@Injectable({
    providedIn: "root"
})
export class LivresAuteurService
{
    private http: HttpClient ;

    // espaces de noms des balises du XML de la BnF
    private espaceDc = "http://purl.org/dc/elements/1.1/" ;
    private espaceOaiDc = "http://www.openarchives.org/OAI/2.0/oai_dc/" ;

    // la personne doit etre auteur du livre, pas traducteur ou prefacier
    private roles = ["auteur", "scenariste", "dessinateur", "illustrateur"] ;

    // editeurs de reeditions (clubs, gros caracteres)
    private reeditions = ["grand livre du mois", "france loisirs", "noyelles", "fl editions", "loupe", "feryane", "gabelire", "a vue d oeil", "voir de pres", "libra diffusio"] ;

    constructor( http: HttpClient )
    {
        this.http = http ;
    }

    // rechercheBnf = false pour un animateur : seulement les livres de la base
    getLivresAuteur( idPersonne: number, prenom: string, nom: string, rechercheBnf: boolean ): Observable<LivreAuteur[]>
    {
        let livresBd = this.http.get<any[]>( "php/livre/livres-auteur.php?id=" + idPersonne ).pipe( catchError( () => of( [] ) ) ) ;
        let xmlBnf = rechercheBnf ? this.getXmlBnf( prenom, nom ) : of( "" ) ;

        return forkJoin( [livresBd, xmlBnf] ).pipe(
            map( ( [bd, xml] ) => this.fusionne( bd, xml, prenom, nom ) )
        ) ;
    }

    // Le PHP interroge la BnF et garde la reponse dans un fichier
    private getXmlBnf( prenom: string, nom: string ): Observable<string>
    {
        let url = "php/livre/livres-bnf.php?prenom=" + encodeURIComponent( prenom.trim() ) + "&nom=" + encodeURIComponent( nom.trim() ) ;

        // si la BnF ne repond pas on a quand meme les livres de la base
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

        // un livre de la base trouve a la BnF prend sa couverture et son annee
        for( let livre of livres )
        {
            let i = livresBnf.findIndex( l => this.titresProches( l.titre, livre.titre ) ) ;
            if( i == -1 ) continue ;

            livre.couvertures = livresBnf[i].couvertures ;
            livre.annee = livresBnf[i].annee ;
            if( livre.editeur == "" ) livre.editeur = livresBnf[i].editeur ;
            livresBnf.splice( i, 1 ) ;
        }

        // livres du festival en premier puis du plus recent au plus ancien
        livresBnf.sort( ( a, b ) => b.annee.localeCompare( a.annee ) ) ;
        return livres.concat( livresBnf ) ;
    }

    private livresBnf( xml: string, prenom: string, nom: string, titresBd: string[] ): LivreAuteur[]
    {
        let doc = new DOMParser().parseFromString( xml, "text/xml" ) ;
        let elements = doc.getElementsByTagNameNS( this.espaceOaiDc, "dc" ) ;

        // notices rangees par homonyme (meme nom mais pas les memes dates)
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

        // on garde celui qui a ecrit les livres du festival
        // sinon celui qui a sorti le plus de livres depuis 2000
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

        // une seule fiche par livre (grand format, poche...), les notices sans date a la fin
        let livres = new Map<string, LivreAuteur>() ;
        notices.sort( ( a, b ) => ( a.annee || "9999" ).localeCompare( b.annee || "9999" ) ) ;

        for( let notice of notices )
        {
            // il y a des coffrets qui ont le nom de l'auteur comme titre
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
                // la 1ere notice etait une reedition, on prend le vrai editeur
                livre.annee = notice.annee ;
                livre.editeur = notice.editeur ;
            }

            // les editions recentes ont plus souvent une couverture donc on les met devant
            livre.couvertures.unshift( "https://catalogue.bnf.fr/couverture?&appName=NE&idArk=" + notice.ark + "&couverture=1" ) ;
            if( notice.isbn != "" ) livre.couvertures.push( "https://covers.openlibrary.org/b/isbn/" + notice.isbn + "-M.jpg?default=false" ) ;
        }

        return Array.from( livres.values() ) ;
    }

    // Auteur de la BnF : "Malzieu, Mathias (1974-....). Auteur du texte"
    // renvoie les dates si c'est la personne, null sinon
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

        // "Flammarion (Paris)" : on enleve la ville
        notice.editeur = ( this.valeurs( element, "publisher" )[0] ?? "" ).replace( / \(.*$/, "" ) ;
        return notice ;
    }

    // Textes des balises dc:xxx d'une notice
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

    // Titre sans auteur, sans sous titre et sans ce qui est entre () ou []
    // ex : "Une sirène à Paris : roman / Mathias Malzieu" donne "Une sirène à Paris"
    private titreCourt( titre: string ): string
    {
        titre = titre.split( " / " )[0] ;
        titre = titre.split( / : | ; | - |\(|\[| ?suivi de /i )[0] ;
        return this.nettoie( titre ) ;
    }

    // la base a des espaces insecables et des espaces en trop
    private nettoie( texte: string ): string
    {
        return ( texte ?? "" ).replace( /\u00a0/g, " " ).replace( /\s+/g, " " ).trim() ;
    }

    // pour comparer : minuscules, sans accents et sans ponctuation
    private normalise( texte: string ): string
    {
        texte = ( texte ?? "" ).normalize( "NFD" ).replace( /[\u0300-\u036f]/g, "" ).toLowerCase() ;
        return texte.replace( /[^a-z0-9]+/g, " " ).trim() ;
    }

    // Titres proches : egaux, l'un commence par l'autre ou 60% de mots en commun
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
