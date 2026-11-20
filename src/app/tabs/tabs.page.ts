import { Component, AfterViewInit, ElementRef, computed, effect, input, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonBackButton,
  IonMenuButton,
  IonContent,
  IonSearchbar,
  IonIcon,
  IonModal,
  GestureController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { helpCircleOutline, locationOutline, storefrontOutline, personOutline, restaurantOutline, cafeOutline, pintOutline,
         micOutline, brushOutline, imageOutline, cameraOutline, diceOutline, peopleOutline, maleFemaleOutline, medkitOutline,
         shirtOutline, informationOutline, cashOutline, swapHorizontalOutline } from 'ionicons/icons';
import { forkJoin } from 'rxjs';

import { PlanHallComponent } from '../../components/plan-hall/plan-hall.component';
import { LieuService } from '../../services/lieu.service';
import { ExposantService } from '../../services/exposant.service';
import { PersonneService } from '../../services/personne.service';
import { ParametreService } from '../../services/parametre.service';
import { correspond, simplifie } from '../../outils/recherche';

// Ce qu'on peut chercher sur le plan : un lieu, un exposant ou une personne sur un stand
interface ElementPlan
{
  titre: string ;
  detail: string ;
  num: number ;
  icone: string ;
}

// Page des plans : un hall à la fois, recherche d'un stand, légende des pictos.
// On change de hall avec les pastilles ou en glissant le doigt à gauche / à droite
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonBackButton,
    IonMenuButton,
    IonContent,
    IonSearchbar,
    IonIcon,
    IonModal,
    PlanHallComponent
  ],
})
export class TabsPage implements AfterViewInit
{
  // Paramètres de la route : /plans/3?numLieu=302
  public numHall = input<number>( -1 ) ;
  public numLieu = input<number>( -1 ) ;

  // 0 = plan général du salon
  protected halls = [1, 2, 3, 4, 5] ;
  protected hallCourant = signal( 0 ) ;

  // Lieu choisi dans la recherche, sinon celui de la route
  protected numLieuCherche = signal( -1 ) ;
  protected numLieuAffiche = computed( () => this.numLieuCherche() != -1 ? this.numLieuCherche() : Number( this.numLieu() ) ) ;

  protected recherche = signal( "" ) ;
  protected elements = signal<ElementPlan[]>( [] ) ;
  protected resultats = computed( () => this.elements().filter( e => correspond( e.titre + " " + e.num, this.recherche() ) ).slice( 0, 8 ) ) ;
  private rechercheChargee: boolean = false ;

  protected legendeOuverte = signal( false ) ;

  // Pictos dessinés sur les plans
  protected pictos = [
    { nom: "Accueil et informations", icone: "information-outline" },
    { nom: "Rencontres et lectures", icone: "mic-outline" },
    { nom: "Spectacle", icone: "people-outline" },
    { nom: "Atelier", icone: "brush-outline" },
    { nom: "Exposition", icone: "image-outline" },
    { nom: "Animation photo", icone: "camera-outline" },
    { nom: "Jeux", icone: "dice-outline" },
    { nom: "Restauration", icone: "restaurant-outline" },
    { nom: "Café", icone: "cafe-outline" },
    { nom: "Buvette", icone: "pint-outline" },
    { nom: "Vestiaire", icone: "shirt-outline" },
    { nom: "Paiement", icone: "cash-outline" },
    { nom: "Toilettes", icone: "male-female-outline" },
    { nom: "Premiers secours", icone: "medkit-outline" }
  ] ;

  // Pas de swipe quand le plan est zoomé, sinon on ne peut plus le faire défiler
  protected zoomActif: boolean = false ;

  protected element: ElementRef ;
  protected gestureCtrl: GestureController ;
  protected serviceLieu: LieuService ;
  protected serviceExposant: ExposantService ;
  protected servicePersonne: PersonneService ;
  protected serviceParametre: ParametreService ;

  constructor( element: ElementRef, gestureCtrl: GestureController, serviceLieu: LieuService, serviceExposant: ExposantService,
               servicePersonne: PersonneService, serviceParametre: ParametreService )
  {
    this.element = element ;
    this.gestureCtrl = gestureCtrl ;
    this.serviceLieu = serviceLieu ;
    this.serviceExposant = serviceExposant ;
    this.servicePersonne = servicePersonne ;
    this.serviceParametre = serviceParametre ;
    addIcons( { helpCircleOutline, locationOutline, storefrontOutline, personOutline, restaurantOutline, cafeOutline, pintOutline,
                micOutline, brushOutline, imageOutline, cameraOutline, diceOutline, peopleOutline, maleFemaleOutline, medkitOutline,
                shirtOutline, informationOutline, cashOutline, swapHorizontalOutline } ) ;

    // Hall demandé, sinon on le devine avec le numero du lieu (302 -> hall 3), sinon le plan général
    effect( () =>
    {
      let hall = Number( this.numHall() ) ;
      if( !this.halls.includes( hall ) ) hall = Number( this.numLieu() ) > 0 ? this.hallDuLieu( Number( this.numLieu() ) ) : 0 ;
      this.numLieuCherche.set( -1 ) ;
      this.afficheHall( hall ) ;
    }) ;
  }

  ngAfterViewInit()
  {
    let gesture = this.gestureCtrl.create( {
      el: this.element.nativeElement.querySelector( "app-plan-hall" ),
      gestureName: "swipe-hall",
      direction: "x",
      threshold: 20,
      onEnd: detail =>
      {
        // le plan général défile de côté sur téléphone : pas de swipe dessus
        if( this.zoomActif || this.hallCourant() == 0 || Math.abs( detail.deltaX ) < 80 ) return ;

        if( detail.deltaX < 0 ) this.afficheHall( this.hallCourant() + 1 ) ;
        else this.afficheHall( this.hallCourant() - 1 ) ;
      }
    } ) ;
    gesture.enable() ;
  }

  afficheHall( hall: number )
  {
    if( hall != 0 && !this.halls.includes( hall ) ) return ;
    this.hallCourant.set( hall ) ;
    this.zoomActif = false ;

    // la pastille du hall reste visible quand la barre défile sur téléphone
    setTimeout( () => this.element.nativeElement.querySelector( ".halls .actif" )?.scrollIntoView( { inline: "center", block: "nearest" } ) ) ;
  }

  private hallDuLieu( num: number ): number
  {
    let hall = Math.floor( num / 100 ) ;
    return this.halls.includes( hall ) ? hall : 1 ;
  }

  onRecherche( event: any )
  {
    this.recherche.set( event.detail.value ?? "" ) ;
  }

  // Lieux, exposants et personnes chargés à la première recherche seulement, sans les doublons de la base
  chargeRecherche()
  {
    if( this.rechercheChargee ) return ;
    this.rechercheChargee = true ;

    forkJoin( [this.serviceLieu.getTousLesLieux(), this.serviceExposant.getTousLesExposants(), this.servicePersonne.getConfigPersonnes()] )
      .subscribe( {
        next: ( [lieux, exposants, personnes] ) =>
        {
          let elements: ElementPlan[] = [] ;
          for( let lieu of lieux )
          {
            let titre = lieu.nom && lieu.nom != String( lieu.num ) ? lieu.nom : "Stand " + lieu.num ;
            elements.push( { titre: titre, detail: "n° " + lieu.num + " | Hall " + this.hallDuLieu( lieu.num ), num: lieu.num, icone: "location-outline" } ) ;
          }
          for( let exposant of exposants )
          {
            if( exposant.numLieu > 0 )
              elements.push( { titre: exposant.nom, detail: "Stand " + exposant.numLieu + " | Hall " + this.hallDuLieu( exposant.numLieu ), num: exposant.numLieu, icone: "storefront-outline" } ) ;
          }
          for( let personne of personnes )
          {
            for( let stand of ( personne.stands ?? "" ).split( "," ) )
            {
              let num = Number( stand ) ;
              if( num > 0 )
                elements.push( { titre: ( personne.prenom + " " + personne.nom ).trim(), detail: "Stand " + num + " | Hall " + this.hallDuLieu( num ), num: num, icone: "person-outline" } ) ;
            }
          }
          let vus = new Set<string>() ;
          this.elements.set( elements.filter( e =>
          {
            let cle = simplifie( e.titre ) + "|" + e.num ;
            if( vus.has( cle ) ) return false ;
            vus.add( cle ) ;
            return true ;
          }) ) ;
        },
        error: () => this.rechercheChargee = false
      }) ;
  }

  // Va sur le hall du résultat et montre le stand avec la bulle ICI
  onChoix( resultat: ElementPlan )
  {
    this.recherche.set( "" ) ;
    ( document.activeElement as HTMLElement )?.blur() ;
    this.afficheHall( this.hallDuLieu( resultat.num ) ) ;
    this.numLieuCherche.set( resultat.num ) ;
  }
}
