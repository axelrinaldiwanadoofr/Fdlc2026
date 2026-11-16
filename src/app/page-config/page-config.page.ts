// Auteur: Kevin MEYER - 05/11/2026

import { Component, signal } from '@angular/core';
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
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline, storefrontOutline, bookOutline, calendarOutline, locationOutline, mapOutline,
         megaphoneOutline, checkmarkDoneOutline, libraryOutline, cloudUploadOutline } from 'ionicons/icons';

import { ConfigService } from '../../services/config.service';

// Page principale de configuration (pas dans le menu) : on se connecte une fois
// avec le mot de passe puis on accède aux autres pages de config
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
    FormsModule,
    RouterLink
  ]
})
export class PageConfigPage
{
  protected serviceConfig: ConfigService ;
  protected router: Router ;

  protected mdp: string = "" ;
  protected erreurMdp = signal("") ;

  // Changement du mot de passe
  protected modalMdp = signal(false) ;
  protected changementObligatoire = signal(false) ;
  protected ancienMdp: string = "" ;
  protected nouveauMdp: string = "" ;
  protected confirmationMdp: string = "" ;
  protected erreurChangement = signal("") ;

  protected message = signal("") ;

  // Nombres de la page de contrôle, pour signaler ce qui manque sur chaque tuile
  protected controle = signal<any>( null ) ;

  // Les pages de config rangées par thème. alerte = compteur du contrôle à afficher
  protected readonly sections = [
    { titre: "Le festival", pages: [
      { titre: "Personnes", texte: "Auteurs, invités et staff", icone: "people-outline", couleur: "#2d3a8c", lien: "/config-personne", href: "", alerte: "personnesSansPhoto" },
      { titre: "Exposants", texte: "Stands, éditeurs, doublons", icone: "storefront-outline", couleur: "#2a9a6a", lien: "/config-exposant", href: "", alerte: "exposantsSansStand" },
      { titre: "Livres", texte: "Titres, auteurs, éditeurs", icone: "book-outline", couleur: "#c2569a", lien: "/config-livre", href: "", alerte: "livresSansEditeur" },
      { titre: "Événements", texte: "Rencontres, ateliers, horaires", icone: "calendar-outline", couleur: "#e08a2c", lien: "/config-evenement", href: "", alerte: "evenementsSansAnimateur" }
    ] },
    { titre: "Plans et lieux", pages: [
      { titre: "Lieux", texte: "Créer les stands et les salles", icone: "location-outline", couleur: "#2d3a8c", lien: "/config-lieu", href: "", alerte: "" },
      { titre: "Plans des halls", texte: "Placer les stands sur les plans", icone: "map-outline", couleur: "#2a9a6a", lien: "/config-plan", href: "", alerte: "lieuxNonPlaces" }
    ] },
    { titre: "Pendant le festival", pages: [
      { titre: "Annonces", texte: "Bandeau d'info sur l'accueil", icone: "megaphone-outline", couleur: "#c2569a", lien: "/config-annonce", href: "", alerte: "" },
      { titre: "Contrôle des données", texte: "Ce qui manque encore", icone: "checkmark-done-outline", couleur: "#e08a2c", lien: "/config-controle", href: "", alerte: "" }
    ] },
    { titre: "Outils", pages: [
      { titre: "Catalogue BnF", texte: "Préparer les livres des auteurs", icone: "library-outline", couleur: "#6b7280", lien: "", href: "php/livre/prepare-cache-bnf.php", alerte: "" },
      { titre: "Imports de la base", texte: "Fichiers du festival", icone: "cloud-upload-outline", couleur: "#6b7280", lien: "", href: "php/updatebd/index.php", alerte: "" }
    ] }
  ] ;

  constructor( serviceConfig: ConfigService, router: Router )
  {
    this.serviceConfig = serviceConfig ;
    this.router = router ;
    addIcons( { peopleOutline, storefrontOutline, bookOutline, calendarOutline, locationOutline, mapOutline,
                megaphoneOutline, checkmarkDoneOutline, libraryOutline, cloudUploadOutline } ) ;
  }

  // Les compteurs sont rechargés à chaque retour sur la page
  ionViewWillEnter()
  {
    if( this.serviceConfig.connecte() ) this.chargeControle() ;
  }

  chargeControle()
  {
    this.serviceConfig.getControle().subscribe( controle => this.controle.set( controle ) ) ;
  }

  // Les pages PHP (outils) s'ouvrent dans un nouvel onglet
  ouvre( lien: string, href: string )
  {
    if( href ) window.open( href, "_blank" ) ;
    else this.router.navigateByUrl( lien ) ;
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

  onConnexion()
  {
    this.serviceConfig.verifieMotDePasse( this.mdp ).subscribe( reponse =>
    {
      if( reponse.ok ) this.erreurMdp.set( "" ) ;
      else if( reponse.bloque ) this.erreurMdp.set( "Trop d'essais, réessayez dans 5 minutes" ) ;
      else this.erreurMdp.set( "Mot de passe incorrect" ) ;

      if( reponse.ok )
      {
        this.serviceConfig.connexion( this.mdp ) ;
        this.chargeControle() ;
      }

      // le mot de passe fdlc2026 du dépôt doit être changé avant d'aller plus loin
      if( reponse.ok && reponse.parDefaut )
      {
        this.ouvreChangementMdp() ;
        this.changementObligatoire.set( true ) ;
        this.ancienMdp = this.mdp ;
      }
      this.mdp = "" ;
    }) ;
  }

  onDeconnexion()
  {
    this.serviceConfig.deconnexion() ;
  }

  ouvreChangementMdp()
  {
    this.ancienMdp = this.nouveauMdp = this.confirmationMdp = "" ;
    this.erreurChangement.set( "" ) ;
    this.modalMdp.set( true ) ;
  }

  // fermer sans changer le mot de passe par défaut = déconnexion
  onFermeChangementMdp()
  {
    this.modalMdp.set( false ) ;
    if( this.changementObligatoire() )
    {
      this.changementObligatoire.set( false ) ;
      this.serviceConfig.deconnexion() ;
    }
  }

  onChangerMdp()
  {
    if( this.nouveauMdp != this.confirmationMdp )
    {
      this.erreurChangement.set( "Les deux nouveaux mots de passe sont différents" ) ;
      return ;
    }

    this.serviceConfig.changeMotDePasse( this.ancienMdp, this.nouveauMdp ).subscribe( {
      next: () =>
      {
        // le nouveau mot de passe sert pour les prochains enregistrements
        this.serviceConfig.connexion( this.nouveauMdp ) ;
        this.changementObligatoire.set( false ) ;
        this.modalMdp.set( false ) ;
        this.message.set( "Mot de passe modifié" ) ;
      },
      error: erreur => this.erreurChangement.set( erreur.error?.erreur ?? "Erreur lors du changement" )
    }) ;
  }
}
