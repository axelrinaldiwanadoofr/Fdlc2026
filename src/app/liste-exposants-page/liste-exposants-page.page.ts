import { Component, computed, signal } from '@angular/core';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton, 
  IonBackButton, 
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';
import { ExposantService } from '../../services/exposant.service';
import {Exposant} from "../../modeles/Exposant" ;
import {ListeExposantComponent} from "../../components/liste-exposant/liste-exposant.component"

@Component({
  selector: 'app-liste-exposants-page',
  templateUrl: './liste-exposants-page.page.html',
  styleUrls: ['./liste-exposants-page.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    ListeExposantComponent
  ]
})
export class ListeExposantsPagePage
{
  protected serviceExposant: ExposantService ;

  // Filtres ("" = pas de filtre)
  protected recherche = signal( "" ) ;
  protected type = signal( "" ) ;
  protected espace = signal( "" ) ;

  // Choix des listes déroulantes, pris dans les exposants chargés
  protected types = signal<string[]>( [] ) ;
  protected espaces = signal<string[]>( [] ) ;

  // Nombre d'exposants trouvés (renvoyé par la liste)
  protected total = signal( 0 ) ;

  protected filtreActif = computed( () => this.recherche().trim() != "" || this.type() != "" || this.espace() != "" ) ;

  constructor( serviceExposant: ExposantService ) 
  { 
    this.serviceExposant = serviceExposant ;
    addIcons( { closeCircleOutline } ) ;
  }

  onRecherche( event: any )
  {
    this.recherche.set( event.detail.value ?? "" ) ;
  }

  // Types et espaces différents, rangés par ordre alphabétique
  onCharge( exposants: Exposant[] )
  {
    let types = new Set<string>() ;
    let espaces = new Set<string>() ;
    for( let exposant of exposants )
    {
      types.add( this.serviceExposant.nomType( exposant.type ) ) ;
      if( exposant.nomLieu && exposant.nomLieu != String( exposant.numLieu ) ) espaces.add( exposant.nomLieu ) ;
    }
    this.types.set( Array.from( types ).sort( ( a, b ) => a.localeCompare( b ) ) ) ;
    this.espaces.set( Array.from( espaces ).sort( ( a, b ) => a.localeCompare( b ) ) ) ;
  }

  effacer()
  {
    this.recherche.set( "" ) ;
    this.type.set( "" ) ;
    this.espace.set( "" ) ;
  }
}
