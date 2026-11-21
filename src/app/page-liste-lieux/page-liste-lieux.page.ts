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
import { AppListeLieuxComponent } from '../../components/app-liste-lieux/app-liste-lieux.component';
import { Lieu } from '../../modeles/Lieu';
import { MajusculePipe } from '../../pipes/majuscule.pipe';

@Component({
  selector: 'app-page-liste-lieux',
  templateUrl: './page-liste-lieux.page.html',
  styleUrls: ['./page-liste-lieux.page.scss'],
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
    AppListeLieuxComponent,
    MajusculePipe
  ],
})
export class PageListeLieuxPage
{
  // Filtres ("" / -1 = pas de filtre)
  protected recherche = signal( "" ) ;
  protected type = signal( "" ) ;
  protected hall = signal( -1 ) ;

  // Choix des listes déroulantes, pris dans les lieux chargés
  protected types = signal<string[]>( [] ) ;
  protected halls = signal<number[]>( [] ) ;

  // Nombre de lieux trouvés (renvoyé par la liste)
  protected total = signal( 0 ) ;

  protected filtreActif = computed( () => this.recherche().trim() != "" || this.type() != "" || this.hall() != -1 ) ;

  constructor()
  {
    addIcons( { closeCircleOutline } ) ;
  }

  onRecherche( event: any )
  {
    this.recherche.set( event.detail.value ?? "" ) ;
  }

  onCharge( lieux: Lieu[] )
  {
    let types = new Set<string>() ;
    let halls = new Set<number>() ;
    for( let lieu of lieux )
    {
      if( lieu.type ) types.add( lieu.type ) ;
      if( lieu.hall > 0 ) halls.add( lieu.hall ) ;
    }
    this.types.set( Array.from( types ).sort( ( a, b ) => a.localeCompare( b ) ) ) ;
    this.halls.set( Array.from( halls ).sort( ( a, b ) => a - b ) ) ;
  }

  effacer()
  {
    this.recherche.set( "" ) ;
    this.type.set( "" ) ;
    this.hall.set( -1 ) ;
  }
}
