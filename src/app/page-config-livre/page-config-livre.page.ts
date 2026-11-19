// Auteur: Kevin MEYER - 16/11/2026

import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonCheckbox,
  IonChip,
  IonIcon,
  IonNote,
  IonToast,
  IonAlert,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeCircle, addOutline } from 'ionicons/icons';

import { ConfigService } from '../../services/config.service';
import { LivreService } from '../../services/livre.service';
import { ExposantService } from '../../services/exposant.service';
import { PersonneService } from '../../services/personne.service';
import { Livre } from '../../modeles/Livre';
import { Exposant } from '../../modeles/Exposant';
import { Personne } from '../../modeles/Personne';
import { MajusculePipe } from '../../pipes/majuscule.pipe';

// Page de config des livres : titre, résumé, genre, éditeur et auteurs
@Component({
  selector: 'app-page-config-livre',
  templateUrl: './page-config-livre.page.html',
  styleUrls: ['./page-config-livre.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonModal,
    IonButton,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonCheckbox,
    IonChip,
    IonIcon,
    IonNote,
    IonToast,
    IonAlert,
    FormsModule,
    MajusculePipe
  ]
})
export class PageConfigLivrePage
{
  protected serviceConfig: ConfigService ;
  protected serviceLivre: LivreService ;
  protected serviceExposant: ExposantService ;
  protected servicePersonne: PersonneService ;
  protected router: Router ;
  protected route: ActivatedRoute ;

  protected livres = signal<Array<Livre>>( [] ) ;
  protected genres = signal<Array<string>>( [] ) ;
  protected exposants = signal<Array<Exposant>>( [] ) ;
  protected personnes = signal<Array<Personne>>( [] ) ;

  protected filtre = signal("tous") ;
  protected recherche = signal("") ;

  // Livre en cours de modification (null = on affiche la liste)
  protected livre = signal<Livre | null>( null ) ;
  protected idPersonnes = signal<Array<number>>( [] ) ;
  protected erreur = signal("") ;
  protected message = signal("") ;
  protected alerteSupprimer = signal(false) ;

  protected boutonsSupprimer = [
    { text: "Annuler", role: "cancel" },
    { text: "Supprimer", role: "destructive", handler: () => this.onSupprimer() }
  ] ;

  // Fenetres de choix de l'éditeur et des auteurs
  protected modalEditeur = signal(false) ;
  protected modalAuteurs = signal(false) ;
  protected rechercheModal = signal("") ;

  protected livresTrouves = computed( () =>
  {
    let texte = this.recherche().toLowerCase() ;
    return this.livres().filter( l =>
    {
      if( this.filtre() == "editeur" && l.idEditeur ) return false ;
      if( this.filtre() == "auteur" && l.nom ) return false ;
      return ( l.titre + " " + ( l.nom ?? "" ) + " " + ( l.editeur ?? "" ) ).toLowerCase().includes( texte ) ;
    }) ;
  }) ;

  protected exposantsTrouves = computed( () =>
  {
    let texte = this.rechercheModal().toLowerCase() ;
    return this.exposants().filter( x => x.nom.toLowerCase().includes( texte ) ).slice( 0, 100 ) ;
  }) ;

  protected personnesTrouvees = computed( () =>
  {
    let texte = this.rechercheModal().toLowerCase() ;
    return this.personnes().filter( p => this.nomPersonne( p ).toLowerCase().includes( texte ) ).slice( 0, 100 ) ;
  }) ;

  constructor( serviceConfig: ConfigService, serviceLivre: LivreService, serviceExposant: ExposantService,
               servicePersonne: PersonneService, router: Router, route: ActivatedRoute )
  {
    this.serviceConfig = serviceConfig ;
    this.serviceLivre = serviceLivre ;
    this.serviceExposant = serviceExposant ;
    this.servicePersonne = servicePersonne ;
    this.router = router ;
    this.route = route ;
    addIcons( { closeCircle, addOutline } ) ;
  }

  // Sans mot de passe on retourne sur la page principale de config
  ionViewWillEnter()
  {
    if( !this.serviceConfig.connecte() )
    {
      this.router.navigateByUrl( "/config" ) ;
      return ;
    }

    // ?filtre=... depuis la page de contrôle
    let filtre = this.route.snapshot.queryParamMap.get( "filtre" ) ;
    if( filtre ) this.filtre.set( filtre ) ;

    this.chargeLivres() ;
    this.serviceLivre.getGenres().subscribe( genres => this.genres.set( genres.map( g => g.genre ) ) ) ;
    this.serviceExposant.getConfigExposants().subscribe( exposants => this.exposants.set( exposants ) ) ;
    this.servicePersonne.getConfigPersonnes().subscribe( personnes => this.personnes.set( personnes ) ) ;
  }

  chargeLivres()
  {
    this.serviceLivre.getConfigLivres().subscribe( livres => this.livres.set( livres ) ) ;
  }

  onNouveau()
  {
    this.ouvre( new Livre(), [] ) ;
  }

  onModifier( livre: Livre )
  {
    this.serviceLivre.getConfigLivre( livre.id ).subscribe( reponse =>
    {
      let copie = Object.assign( new Livre(), reponse.livre ) ;
      copie.idEditeur = reponse.livre.idEditeur ?? -1 ;
      this.ouvre( copie, reponse.idPersonnes ) ;
    }) ;
  }

  private ouvre( livre: Livre, idPersonnes: Array<number> )
  {
    this.erreur.set( "" ) ;
    this.idPersonnes.set( idPersonnes ) ;
    this.livre.set( livre ) ;
  }

  onAnnuler()
  {
    this.livre.set( null ) ;
  }

  onEnregistrer()
  {
    let livre = this.livre() ;
    if( !livre ) return ;

    if( !livre.titre || livre.titre.trim() == "" )
    {
      this.erreur.set( "Le titre est obligatoire" ) ;
      return ;
    }

    this.serviceLivre.majLivre( livre, this.idPersonnes() ).subscribe( {
      next: () => this.ferme( "Livre enregistré" ),
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  onSupprimer()
  {
    let livre = this.livre() ;
    if( !livre ) return ;

    this.serviceLivre.supprimeLivre( livre.id ).subscribe( {
      next: () => this.ferme( "Livre supprimé" ),
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  private ferme( message: string )
  {
    this.message.set( message ) ;
    this.livre.set( null ) ;
    this.chargeLivres() ;
  }

  private erreurServeur( erreur: any )
  {
    // 401 : session expirée, on revient à la connexion
    if( erreur.status == 401 )
    {
      this.serviceConfig.deconnexion() ;
      this.router.navigateByUrl( "/config" ) ;
    }
    this.erreur.set( erreur.error?.erreur ?? "Erreur lors de l'enregistrement" ) ;
  }

  ouvreChoix( modal: "editeur" | "auteurs" )
  {
    this.rechercheModal.set( "" ) ;
    if( modal == "editeur" ) this.modalEditeur.set( true ) ;
    else this.modalAuteurs.set( true ) ;
  }

  // Editeur

  onChoisirEditeur( id: number )
  {
    let livre = this.livre() ;
    if( livre ) livre.idEditeur = id ;
    this.modalEditeur.set( false ) ;
  }

  nomEditeur( id: number ): string
  {
    if( id == null || id < 0 ) return "Aucun" ;
    return this.exposants().find( x => x.id == id )?.nom ?? "Exposant " + id ;
  }

  // Auteurs

  estAuteur( personne: Personne ): boolean
  {
    return this.idPersonnes().includes( personne.id ) ;
  }

  onCocheAuteur( personne: Personne, coche: boolean )
  {
    if( coche ) this.idPersonnes.set( this.idPersonnes().concat( personne.id ) ) ;
    else this.retireAuteur( personne.id ) ;
  }

  retireAuteur( id: number )
  {
    this.idPersonnes.set( this.idPersonnes().filter( i => i != id ) ) ;
  }

  nomAuteur( id: number ): string
  {
    let personne = this.personnes().find( p => p.id == id ) ;
    return personne ? this.nomPersonne( personne ) : "Personne " + id ;
  }

  nomPersonne( personne: Personne ): string
  {
    return ( ( personne.prenom ?? "" ) + " " + ( personne.nom ?? "" ) ).trim() ;
  }
}
