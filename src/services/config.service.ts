// Auteur: Kevin MEYER - 05/11/2026

import {Injectable, computed, signal} from "@angular/core" ;
import {HttpClient} from "@angular/common/http" ;
import {Router} from "@angular/router" ;
import {Observable, tap} from "rxjs" ;
import {CompteConnecte} from "../modeles/CompteConnecte" ;
import {Compte} from "../modeles/Compte" ;
import {Role} from "../modeles/Role" ;

// Connexion aux pages de configuration avec un compte (session PHP).
// Le serveur vérifie les permissions à chaque appel, ici on s'en sert seulement pour l'affichage.
@Injectable( {
    providedIn: "root"
})
export class ConfigService
{
    private http: HttpClient ;
    private router: Router ;

    public compte = signal<CompteConnecte | null>( null ) ;
    public connecte = computed( () => this.compte() != null ) ;

    // la session PHP a été relue au démarrage de l'appli
    public pret = signal(false) ;

    // Deconnexion automatique apres 15 minutes sans rien faire
    private readonly dureeInactivite = 15 * 60 * 1000 ;
    private minuteur: any = null ;
    public deconnecteParInactivite = signal(false) ;

    // evenements qui comptent comme une activite de l'utilisateur
    private readonly evenementsActivite = [ "click", "keydown", "pointermove", "touchstart", "scroll" ] ;
    private onActivite = () => this.relanceMinuteur() ;

    constructor( http: HttpClient, router: Router )
    {
        this.http = http ;
        this.router = router ;

        // reprend la session si la page a été rechargée (après la création du service,
        // l'intercepteur du jeton a besoin de lui)
        setTimeout( () => this.relitSession() ) ;
    }

    relitSession()
    {
        this.http.get<{ compte: CompteConnecte | null }>( "php/compte/moi.php" ).subscribe( {
            next: reponse =>
            {
                if( reponse.compte ) this.ouvre( reponse.compte ) ;
                else this.compte.set( null ) ;
                this.pret.set( true ) ;
            },
            error: () => this.pret.set( true )
        }) ;
    }

    peut( permission: string ): boolean
    {
        return this.compte()?.permissions.includes( permission ) ?? false ;
    }

    jeton(): string
    {
        return this.compte()?.jeton ?? "" ;
    }

    connexion( identifiant: string, mdp: string ): Observable<CompteConnecte>
    {
        return this.http.post<CompteConnecte>( "php/compte/connexion.php", { identifiant: identifiant, mdp: mdp } )
            .pipe( tap( compte => this.ouvre( compte ) ) ) ;
    }

    changeMonMotDePasse( ancien: string, nouveau: string ): Observable<CompteConnecte>
    {
        return this.http.post<CompteConnecte>( "php/compte/mon-mot-de-passe.php", { ancien: ancien, nouveau: nouveau } )
            .pipe( tap( compte => this.compte.set( compte ) ) ) ;
    }

    deconnexion()
    {
        if( this.connecte() ) this.http.post( "php/compte/deconnexion.php", {} ).subscribe() ;
        this.compte.set( null ) ;

        clearTimeout( this.minuteur ) ;
        for( let evenement of this.evenementsActivite )
        {
            document.removeEventListener( evenement, this.onActivite, { capture: true } ) ;
        }
    }

    private ouvre( compte: CompteConnecte )
    {
        this.compte.set( compte ) ;
        this.deconnecteParInactivite.set( false ) ;

        for( let evenement of this.evenementsActivite )
        {
            document.addEventListener( evenement, this.onActivite, { passive: true, capture: true } ) ;
        }
        this.relanceMinuteur() ;
    }

    private relanceMinuteur()
    {
        clearTimeout( this.minuteur ) ;
        this.minuteur = setTimeout( () =>
        {
            this.deconnexion() ;
            this.deconnecteParInactivite.set( true ) ;

            // si on est sur une page de config on revient a la connexion
            if( this.router.url.startsWith( "/config" ) ) this.router.navigateByUrl( "/config" ) ;
        }, this.dureeInactivite ) ;
    }

    // Nombre d'éléments incomplets dans la base (page de contrôle)
    getControle(): Observable<any>
    {
        return this.http.get( "php/config/controle.php" ) ;
    }

    // Comptes et rôles

    getComptes( idPersonne: number = -1 ): Observable<Compte[]>
    {
        return this.http.get<Compte[]>( "php/compte/comptes.php" + ( idPersonne > 0 ? "?idPersonne=" + idPersonne : "" ) ) ;
    }

    // Renvoie le mot de passe tiré au hasard à la création ou si nouveauMdp = true
    majCompte( compte: Compte, nouveauMdp: boolean = false ): Observable<{ id: number, mdp: string, identifiant: string }>
    {
        return this.http.post<{ id: number, mdp: string, identifiant: string }>( "php/compte/maj-compte.php", { compte: compte, nouveauMdp: nouveauMdp } ) ;
    }

    supprimeCompte( id: number ): Observable<any>
    {
        return this.http.post( "php/compte/supprime-compte.php", { id: id } ) ;
    }

    getRoles(): Observable<{ roles: Role[], groupes: Array<{ nom: string, permissions: Array<{ code: string, texte: string }> }>, monNiveau: number }>
    {
        return this.http.get<any>( "php/compte/roles.php" ) ;
    }

    majRole( role: Role ): Observable<{ id: number }>
    {
        return this.http.post<{ id: number }>( "php/compte/maj-role.php", { role: role } ) ;
    }

    supprimeRole( id: number ): Observable<any>
    {
        return this.http.post( "php/compte/supprime-role.php", { id: id } ) ;
    }

    getJournal(): Observable<Array<{ date: string, identifiant: string, action: string, detail: string, ip: string }>>
    {
        return this.http.get<any>( "php/compte/journal.php" ) ;
    }
}
