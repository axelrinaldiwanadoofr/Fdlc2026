// Auteur: Kevin MEYER - 05/11/2026

import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  IonButton,
  IonNote,
  IonToast,
  IonModal,
  IonIcon,
  IonBadge,
  IonSpinner,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline, storefrontOutline, bookOutline, calendarOutline, locationOutline, mapOutline, megaphoneOutline,
         checkmarkDoneOutline, libraryOutline, cloudUploadOutline, keyOutline, shieldCheckmarkOutline, listOutline,
         warningOutline } from 'ionicons/icons';

import { ConfigService } from '../../services/config.service';

// Tuile du menu et permission nécessaire pour la voir
class PageConfig
{
  public titre: string ;
  public texte: string ;
  public icone: string ;
  public couleur: string ;
  public lien: string ;
  public permission: string ;
  public alerte: string ;

  constructor( titre: string, texte: string, icone: string, couleur: string, lien: string, permission: string, alerte: string = "" )
  {
    this.titre = titre ;
    this.texte = texte ;
    this.icone = icone ;
    this.couleur = couleur ;
    this.lien = lien ;
    this.permission = permission ;
    this.alerte = alerte ;
  }
}

// Page principale de configuration : connexion puis menu des pages autorisées
@Component({
  selector: 'app-page-config',
  templateUrl: './page-config.page.html',
  styleUrls: ['./page-config.page.scss'],
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
    IonButton,
    IonNote,
    IonToast,
    IonModal,
    IonIcon,
    IonBadge,
    IonSpinner,
    FormsModule,
    RouterLink
  ]
})
export class PageConfigPage
{
  protected serviceConfig: ConfigService ;
  protected router: Router ;

  protected identifiant: string = "" ;
  protected mdp: string = "" ;
  protected erreurConnexion = signal("") ;

  // Changement de son mot de passe
  protected modalMdp = signal(false) ;
  protected ancienMdp: string = "" ;
  protected nouveauMdp: string = "" ;
  protected confirmationMdp: string = "" ;
  protected erreurChangement = signal("") ;
  protected changementObligatoire = computed( () => this.serviceConfig.compte()?.doitChanger ?? false ) ;

  protected message = signal("") ;

  // Nombres de la page de contrôle
  protected controle = signal<any>( null ) ;

  private sections = [
    { titre: "Le festival", pages: [
      new PageConfig( "Personnes", "Auteurs, invités et staff", "people-outline", "#2d3a8c", "/config-personne", "personnes.modifier", "personnesSansPhoto" ),
      new PageConfig( "Exposants", "Stands, éditeurs, doublons", "storefront-outline", "#2a9a6a", "/config-exposant", "exposants.modifier", "exposantsSansStand" ),
      new PageConfig( "Livres", "Titres, auteurs, éditeurs", "book-outline", "#c2569a", "/config-livre", "livres.modifier", "livresSansEditeur" ),
      new PageConfig( "Événements", "Rencontres, ateliers, horaires", "calendar-outline", "#e08a2c", "/config-evenement", "evenements.modifier", "evenementsSansAnimateur" )
    ] },
    { titre: "Plans et lieux", pages: [
      new PageConfig( "Lieux", "Créer les stands et les salles", "location-outline", "#2d3a8c", "/config-lieu", "lieux.modifier" ),
      new PageConfig( "Plans des halls", "Placer les stands sur les plans", "map-outline", "#2a9a6a", "/config-plan", "plans.modifier", "lieuxNonPlaces" )
    ] },
    { titre: "Pendant le festival", pages: [
      new PageConfig( "Annonces", "Bandeau d'info sur l'accueil", "megaphone-outline", "#c2569a", "/config-annonce", "annonces.modifier" ),
      new PageConfig( "Contrôle des données", "Ce qui manque encore", "checkmark-done-outline", "#e08a2c", "/config-controle", "controle.voir" )
    ] },
    { titre: "Outils", pages: [
      new PageConfig( "Catalogue BnF", "Préparer les livres des auteurs", "library-outline", "#6b7280", "php/livre/prepare-cache-bnf.php", "bnf.lancer" ),
      new PageConfig( "Imports de la base", "Fichiers du festival", "cloud-upload-outline", "#6b7280", "php/updatebd/index.php", "imports.lancer" )
    ] },
    { titre: "Administration", pages: [
      new PageConfig( "Comptes", "Qui peut se connecter, avec quel rôle", "key-outline", "#4b5563", "/config-comptes", "comptes.gerer" ),
      new PageConfig( "Rôles et permissions", "Ce que chaque rôle a le droit de faire", "shield-checkmark-outline", "#4b5563", "/config-roles", "roles.gerer" ),
      new PageConfig( "Journal", "Connexions et actions importantes", "list-outline", "#4b5563", "/config-journal", "journal.voir" )
    ] }
  ] ;

  // Tuiles autorisées par le rôle
  protected sectionsVisibles = computed( () =>
  {
    let compte = this.serviceConfig.compte() ;
    if( !compte ) return [] ;
    return this.sections
      .map( s => ( { titre: s.titre, pages: s.pages.filter( p => compte.permissions.includes( p.permission ) ) } ) )
      .filter( s => s.pages.length > 0 ) ;
  }) ;

  constructor( serviceConfig: ConfigService, router: Router )
  {
    this.serviceConfig = serviceConfig ;
    this.router = router ;
    addIcons( { peopleOutline, storefrontOutline, bookOutline, calendarOutline, locationOutline, mapOutline, megaphoneOutline,
                checkmarkDoneOutline, libraryOutline, cloudUploadOutline, keyOutline, shieldCheckmarkOutline, listOutline,
                warningOutline } ) ;

    effect( () =>
    {
      let compte = this.serviceConfig.compte() ;
      if( compte && this.serviceConfig.peut( "controle.voir" ) && !compte.doitChanger ) this.chargeControle() ;
      if( compte?.doitChanger ) this.ouvreChangementMdp() ;
    }) ;
  }

  ionViewWillEnter()
  {
    if( this.serviceConfig.peut( "controle.voir" ) ) this.chargeControle() ;
  }

  chargeControle()
  {
    this.serviceConfig.getControle().subscribe( controle => this.controle.set( controle ) ) ;
  }

  onConnexion()
  {
    if( this.identifiant.trim() == "" || this.mdp == "" ) return ;

    this.serviceConfig.connexion( this.identifiant, this.mdp ).subscribe( {
      next: () =>
      {
        this.ancienMdp = this.mdp ;
        this.erreurConnexion.set( "" ) ;
        this.mdp = "" ;
      },
      error: erreur =>
      {
        this.erreurConnexion.set( erreur.error?.erreur ?? "Connexion impossible" ) ;
        this.mdp = "" ;
      }
    }) ;
  }

  onDeconnexion()
  {
    this.serviceConfig.deconnexion() ;
    this.controle.set( null ) ;
  }

  ouvreChangementMdp()
  {
    if( !this.changementObligatoire() ) this.ancienMdp = "" ;
    this.nouveauMdp = this.confirmationMdp = "" ;
    this.erreurChangement.set( "" ) ;
    this.modalMdp.set( true ) ;
  }

  // Fermer sans changer un mot de passe obligatoire déconnecte
  onFermeChangementMdp()
  {
    this.modalMdp.set( false ) ;
    if( this.changementObligatoire() ) this.onDeconnexion() ;
  }

  onChangerMdp()
  {
    if( this.nouveauMdp != this.confirmationMdp )
    {
      this.erreurChangement.set( "Les deux nouveaux mots de passe sont différents" ) ;
      return ;
    }

    this.serviceConfig.changeMonMotDePasse( this.ancienMdp, this.nouveauMdp ).subscribe( {
      next: () =>
      {
        this.ancienMdp = this.nouveauMdp = this.confirmationMdp = "" ;
        this.modalMdp.set( false ) ;
        this.message.set( "Mot de passe modifié" ) ;
      },
      error: erreur => this.erreurChangement.set( erreur.error?.erreur ?? "Erreur lors du changement" )
    }) ;
  }

  // Les pages PHP s'ouvrent dans un nouvel onglet
  ouvre( page: PageConfig )
  {
    if( page.lien.startsWith( "php/" ) ) window.open( page.lien, "_blank" ) ;
    else this.router.navigateByUrl( page.lien ) ;
  }

  nombre( code: string ): number
  {
    return this.controle()?.[code] ?? 0 ;
  }

  totalAFaire(): number
  {
    let controle = this.controle() ;
    if( !controle ) return 0 ;
    return Object.values( controle ).reduce( ( total: number, nb: any ) => total + nb, 0 ) ;
  }

  initiale( nom: string ): string
  {
    return ( nom ?? "?" ).trim().charAt( 0 ).toUpperCase() ;
  }
}
