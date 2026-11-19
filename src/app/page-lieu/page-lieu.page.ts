import { Component, OnChanges, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonBackButton,
  IonButton,
  IonIcon,
  IonList,
  IonItemDivider,
  IonLabel,
  IonNote,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { locationOutline, mapOutline, storefrontOutline, chevronForward } from 'ionicons/icons';

import { Lieu } from '../../modeles/Lieu';
import { Exposant } from '../../modeles/Exposant';
import { LieuService } from '../../services/lieu.service' ;
import { ExposantService } from '../../services/exposant.service';
import { PlanHallComponent } from '../../components/plan-hall/plan-hall.component';
import { PersonnesStandComponent } from '../../components/personnes-stand/personnes-stand.component';
import { ListeEvenementsComponent } from '../../components/liste-evenements/liste-evenements.component';
import { AjouterEtapeButtonComponent } from '../../components/ajouter-etape-button/ajouter-etape-button.component';
import { MajusculePipe } from '../../pipes/majuscule.pipe';

// Page d'un lieu : où il est, qui y expose, qui y est présent et ce qui s'y passe
@Component({
  selector: 'app-page-lieu',
  templateUrl: './page-lieu.page.html',
  styleUrls: ['./page-lieu.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonMenuButton, IonBackButton, IonButton, IonIcon,
    IonList, IonItemDivider, IonLabel, IonNote,
    RouterLink, MajusculePipe,
    PlanHallComponent, PersonnesStandComponent, ListeEvenementsComponent, AjouterEtapeButtonComponent
  ],
})
export class PageLieuPage implements OnChanges
{
  public num = input<number>( -1 ) ;

  protected serviceLieu: LieuService ;
  protected serviceExposant: ExposantService ;

  protected lieu = signal<Lieu | null>( null ) ;
  protected introuvable = signal( false ) ;
  protected hall = signal( 1 ) ;
  protected exposants = signal<Exposant[]>( [] ) ;
  protected nbEvenements = signal( 0 ) ;

  constructor( serviceLieu: LieuService, serviceExposant: ExposantService )
  {
    this.serviceLieu = serviceLieu ;
    this.serviceExposant = serviceExposant ;
    addIcons( { locationOutline, mapOutline, storefrontOutline, chevronForward } ) ;
  }

  // la même page sert pour un autre lieu quand on touche un stand du mini plan
  ngOnChanges()
  {
    let num = Number( this.num() ) ;
    this.lieu.set( null ) ;
    this.introuvable.set( false ) ;
    this.exposants.set( [] ) ;
    this.nbEvenements.set( 0 ) ;
    this.hall.set( Math.min( 5, Math.max( 1, Math.floor( num / 100 ) ) ) ) ;

    this.serviceLieu.getLieuByNum( num ).subscribe( {
      next: lieux =>
      {
        if( lieux.length > 0 ) this.lieu.set( lieux[0] ) ;
        else this.introuvable.set( true ) ;
      },
      error: () => this.introuvable.set( true )
    }) ;

    // la liste complète est en cache côté serveur, on garde les exposants du lieu
    this.serviceExposant.getTousLesExposants().subscribe( exposants =>
      this.exposants.set( exposants.filter( x => x.numLieu == num ) ) ) ;
  }

  // "Stand 307" pour un stand sans nom, sinon son nom
  titre( lieu: Lieu ): string
  {
    if( lieu.nom && lieu.nom != String( lieu.num ) ) return lieu.nom ;
    return "Stand " + lieu.num ;
  }

  // couleurs de la DA selon le type de lieu
  couleurType( type: string ): string
  {
    let couleurs: any = {
      "stand": "#2b3990", "éditeurs": "#2b3990", "atelier": "#e08a2c", "exposition": "#c2569a",
      "théatre": "#1f8a5b", "restaurant": "#d64545", "café - bar": "#d64545"
    } ;
    return couleurs[type.trim().toLowerCase()] ?? "#6b6f86" ;
  }
}
