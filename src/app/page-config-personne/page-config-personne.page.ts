// Auteur: Kevin MEYER - 16/11/2026

import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonItemDivider,
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
  IonAvatar,
  IonIcon,
  IonNote,
  IonToast,
  IonAlert,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeCircle, personCircleOutline, trashOutline } from 'ionicons/icons';

import { ConfigService } from '../../services/config.service';
import { PersonneService } from '../../services/personne.service';
import { ExposantService } from '../../services/exposant.service';
import { LivreService } from '../../services/livre.service';
import { Personne } from '../../modeles/Personne';
import { PresenceStand } from '../../modeles/PresenceStand';
import { Exposant } from '../../modeles/Exposant';
import { Livre } from '../../modeles/Livre';

// Page de config des personnes : infos, photo, présence sur les stands et livres
@Component({
  selector: 'app-page-config-personne',
  templateUrl: './page-config-personne.page.html',
  styleUrls: ['./page-config-personne.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonItemDivider,
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
    IonAvatar,
    IonIcon,
    IonNote,
    IonToast,
    IonAlert,
    FormsModule
  ]
})
export class PageConfigPersonnePage
{
  protected serviceConfig: ConfigService ;
  protected servicePersonne: PersonneService ;
  protected serviceExposant: ExposantService ;
  protected serviceLivre: LivreService ;
  protected router: Router ;

  protected personnes = signal<Array<Personne>>( [] ) ;
  protected specialites = signal<Array<string>>( [] ) ;
  protected exposants = signal<Array<Exposant>>( [] ) ;
  protected livres = signal<Array<Livre>>( [] ) ;

  // Filtres de la liste
  protected filtre = signal("tous") ;
  protected recherche = signal("") ;

  // Personne en cours de modification (null = on affiche la liste)
  protected personne = signal<Personne | null>( null ) ;
  protected creneaux = signal<Array<PresenceStand>>( [] ) ;
  protected idLivres = signal<Array<number>>( [] ) ;
  protected erreur = signal("") ;
  protected message = signal("") ;
  protected envoiEnCours = signal(false) ;
  protected alerteSupprimer = signal(false) ;

  protected readonly boutonsSupprimer = [
    { text: "Annuler", role: "cancel" },
    { text: "Supprimer", role: "destructive", handler: () => this.onSupprimer() }
  ] ;

  protected readonly champsCreneaux = [
    { champ: "samedi_am", nom: "Sam. matin" },
    { champ: "samedi_pm", nom: "Sam. après-midi" },
    { champ: "dimanche_am", nom: "Dim. matin" },
    { champ: "dimanche_pm", nom: "Dim. après-midi" }
  ] ;

  // Fenetres de choix d'un stand et des livres
  protected modalStand = signal(false) ;
  protected modalLivres = signal(false) ;
  protected rechercheModal = signal("") ;

  protected personnesTrouvees = computed( () =>
  {
    let texte = this.recherche().toLowerCase() ;
    return this.personnes().filter( p =>
    {
      if( this.filtre() == "stand" && !p.stands ) return false ;
      if( this.filtre() == "photo" && p.photo ) return false ;
      return this.nomPersonne( p ).toLowerCase().includes( texte ) ;
    }) ;
  }) ;

  protected exposantsTrouves = computed( () =>
  {
    let texte = this.rechercheModal().toLowerCase() ;
    return this.exposants().filter( x => ( x.numLieu + " " + x.nom ).toLowerCase().includes( texte ) ).slice( 0, 100 ) ;
  }) ;

  protected livresTrouves = computed( () =>
  {
    let texte = this.rechercheModal().toLowerCase() ;
    return this.livres().filter( l => ( l.titre + " " + ( l.nom ?? "" ) ).toLowerCase().includes( texte ) ).slice( 0, 100 ) ;
  }) ;

  constructor( serviceConfig: ConfigService, servicePersonne: PersonneService, serviceExposant: ExposantService,
               serviceLivre: LivreService, router: Router )
  {
    this.serviceConfig = serviceConfig ;
    this.servicePersonne = servicePersonne ;
    this.serviceExposant = serviceExposant ;
    this.serviceLivre = serviceLivre ;
    this.router = router ;
    addIcons( { closeCircle, personCircleOutline, trashOutline } ) ;
  }

  // Sans mot de passe on retourne sur la page principale de config
  ionViewWillEnter()
  {
    if( !this.serviceConfig.connecte() )
    {
      this.router.navigateByUrl( "/config" ) ;
      return ;
    }

    this.chargePersonnes() ;
    this.servicePersonne.getSpecialites().subscribe( specialites => this.specialites.set( specialites ) ) ;
    this.serviceExposant.getTousLesExposants().subscribe( exposants => this.exposants.set( exposants ) ) ;
    this.serviceLivre.getTitresLivres().subscribe( livres => this.livres.set( livres ) ) ;
  }

  chargePersonnes()
  {
    this.servicePersonne.getConfigPersonnes().subscribe( personnes => this.personnes.set( personnes ) ) ;
  }

  onNouveau()
  {
    let personne = new Personne() ;
    personne.specialite = "auteur" ;
    personne.type = "P" ;
    this.ouvre( personne, [], [] ) ;
  }

  onModifier( personne: Personne )
  {
    this.servicePersonne.getConfigPersonne( personne.id ).subscribe( reponse =>
      this.ouvre( Object.assign( new Personne(), reponse.personne ), reponse.creneaux, reponse.idLivres ) ) ;
  }

  private ouvre( personne: Personne, creneaux: Array<PresenceStand>, idLivres: Array<number> )
  {
    this.erreur.set( "" ) ;
    this.creneaux.set( creneaux ) ;
    this.idLivres.set( idLivres ) ;
    this.personne.set( personne ) ;
  }

  onAnnuler()
  {
    this.personne.set( null ) ;
  }

  onEnregistrer()
  {
    let personne = this.personne() ;
    if( !personne ) return ;

    if( !personne.nom || personne.nom.trim() == "" )
    {
      this.erreur.set( "Le nom est obligatoire" ) ;
      return ;
    }

    this.servicePersonne.majPersonne( this.serviceConfig.mdp, personne, this.creneaux(), this.idLivres() ).subscribe( {
      next: () => this.ferme( "Personne enregistrée" ),
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  onSupprimer()
  {
    let personne = this.personne() ;
    if( !personne ) return ;

    this.servicePersonne.supprimePersonne( this.serviceConfig.mdp, personne.id ).subscribe( {
      next: () => this.ferme( "Personne supprimée" ),
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  private ferme( message: string )
  {
    this.message.set( message ) ;
    this.personne.set( null ) ;
    this.chargePersonnes() ;
  }

  private erreurServeur( erreur: any )
  {
    // 403 : mot de passe refusé par le serveur
    if( erreur.status == 403 )
    {
      this.serviceConfig.deconnexion() ;
      this.router.navigateByUrl( "/config" ) ;
    }
    this.erreur.set( erreur.error?.erreur ?? "Erreur lors de l'enregistrement" ) ;
  }

  // Photo

  onPhotoChoisie( event: Event )
  {
    let input = event.target as HTMLInputElement ;
    let personne = this.personne() ;
    if( !input.files || input.files.length == 0 || !personne ) return ;

    this.envoiEnCours.set( true ) ;
    this.servicePersonne.envoiePhoto( this.serviceConfig.mdp, input.files[0] ).subscribe( {
      next: reponse =>
      {
        personne.photo = reponse.photo ;
        this.envoiEnCours.set( false ) ;
      },
      error: erreur =>
      {
        this.envoiEnCours.set( false ) ;
        this.erreurServeur( erreur ) ;
      }
    }) ;
    input.value = "" ;
  }

  onRetirerPhoto()
  {
    let personne = this.personne() ;
    if( personne ) personne.photo = "" ;
  }

  // Stands et créneaux

  ouvreChoix( modal: "stand" | "livres" )
  {
    this.rechercheModal.set( "" ) ;
    if( modal == "stand" ) this.modalStand.set( true ) ;
    else this.modalLivres.set( true ) ;
  }

  onChoisirStand( exposant: Exposant )
  {
    this.modalStand.set( false ) ;
    if( this.creneaux().some( c => c.idExposant == exposant.id ) ) return ;

    // par defaut présent tout le week-end
    let creneau = new PresenceStand() ;
    creneau.idExposant = exposant.id ;
    creneau.nomExposant = exposant.nom ;
    creneau.numLieu = exposant.numLieu ;
    creneau.samedi_am = 1 ;
    creneau.samedi_pm = 1 ;
    creneau.dimanche_am = 1 ;
    creneau.dimanche_pm = 1 ;
    this.creneaux.set( this.creneaux().concat( creneau ) ) ;
  }

  retireStand( idExposant: number )
  {
    this.creneaux.set( this.creneaux().filter( c => c.idExposant != idExposant ) ) ;
  }

  estPresent( creneau: PresenceStand, champ: string ): boolean
  {
    if( champ == "samedi_am" ) return creneau.samedi_am == 1 ;
    if( champ == "samedi_pm" ) return creneau.samedi_pm == 1 ;
    if( champ == "dimanche_am" ) return creneau.dimanche_am == 1 ;
    return creneau.dimanche_pm == 1 ;
  }

  onCocheCreneau( creneau: PresenceStand, champ: string, coche: boolean )
  {
    let valeur = coche ? 1 : 0 ;
    if( champ == "samedi_am" ) creneau.samedi_am = valeur ;
    else if( champ == "samedi_pm" ) creneau.samedi_pm = valeur ;
    else if( champ == "dimanche_am" ) creneau.dimanche_am = valeur ;
    else creneau.dimanche_pm = valeur ;
  }

  // Livres écrits

  estChoisi( livre: Livre ): boolean
  {
    return this.idLivres().includes( livre.id ) ;
  }

  onCocheLivre( livre: Livre, coche: boolean )
  {
    if( coche ) this.idLivres.set( this.idLivres().concat( livre.id ) ) ;
    else this.retireLivre( livre.id ) ;
  }

  retireLivre( id: number )
  {
    this.idLivres.set( this.idLivres().filter( i => i != id ) ) ;
  }

  titreLivre( id: number ): string
  {
    return this.livres().find( l => l.id == id )?.titre ?? "Livre " + id ;
  }

  nomPersonne( personne: Personne ): string
  {
    return ( ( personne.prenom ?? "" ) + " " + ( personne.nom ?? "" ) ).trim() ;
  }
}
