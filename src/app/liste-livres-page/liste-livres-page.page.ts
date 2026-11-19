import { Component, computed, signal, viewChild } from '@angular/core';
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
import { ListeLivresComponent } from '../../components/liste-livres/liste-livres.component';
import { Livre } from '../../modeles/Livre';

@Component({
  selector: 'app-liste-livres-page',
  templateUrl: './liste-livres-page.page.html',
  styleUrls: ['./liste-livres-page.page.scss'],
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
    ListeLivresComponent
  ]
})
export class ListeLivresPagePage
{
  protected listeLivres = viewChild( ListeLivresComponent ) ;

  // Filtres ("" = pas de filtre)
  protected recherche = signal( "" ) ;
  protected auteur = signal( "" ) ;
  protected editeur = signal( "" ) ;

  // Choix des listes déroulantes, pris dans les livres chargés
  protected auteurs = signal<string[]>( [] ) ;
  protected editeurs = signal<string[]>( [] ) ;

  // Nombre de livres trouvés (renvoyé par la liste)
  protected total = signal( 0 ) ;

  protected filtreActif = computed( () => this.recherche().trim() != "" || this.auteur() != "" || this.editeur() != "" ) ;

  constructor()
  {
    addIcons( { closeCircleOutline } ) ;
  }

  onRecherche( event: any )
  {
    this.recherche.set( event.detail.value ?? "" ) ;
  }

  onCharge( livres: Livre[] )
  {
    let auteurs = new Set<string>() ;
    let editeurs = new Set<string>() ;
    for( let livre of livres )
    {
      let auteur = this.listeLivres()?.nomAuteurLivre( livre ) ?? "" ;
      if( auteur != "" ) auteurs.add( auteur ) ;
      if( ( livre.editeur ?? "" ).trim() != "" ) editeurs.add( livre.editeur.trim() ) ;
    }
    this.auteurs.set( Array.from( auteurs ).sort( ( a, b ) => a.localeCompare( b ) ) ) ;
    this.editeurs.set( Array.from( editeurs ).sort( ( a, b ) => a.localeCompare( b ) ) ) ;
  }

  effacer()
  {
    this.recherche.set( "" ) ;
    this.auteur.set( "" ) ;
    this.editeur.set( "" ) ;
  }
}
