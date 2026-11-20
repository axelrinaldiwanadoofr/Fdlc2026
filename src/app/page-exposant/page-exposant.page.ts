import { Component, OnChanges, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { locationOutline, mapOutline, bookOutline, chevronForward } from 'ionicons/icons';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonBackButton,
  IonList,
  IonItemDivider,
  IonLabel,
  IonNote,
  IonButton,
  IonIcon,
 } from '@ionic/angular';
import { Exposant } from '../../modeles/Exposant';
import { ExposantService } from '../../services/exposant.service';
import { AjouterEtapeButtonComponent } from '../../components/ajouter-etape-button/ajouter-etape-button.component';
import { PersonnesStandComponent } from '../../components/personnes-stand/personnes-stand.component';
import { PlanHallComponent } from '../../components/plan-hall/plan-hall.component';

// Page d'un exposant : son stand sur le plan, ses livres et les auteurs présents
@Component({
  selector: 'app-page-exposant',
  templateUrl: './page-exposant.page.html',
  styleUrls: ['./page-exposant.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonList,
    IonItemDivider,
    IonLabel,
    IonNote,
    IonButton,
    IonIcon,
    RouterLink,
    AjouterEtapeButtonComponent,
    PersonnesStandComponent,
    PlanHallComponent]
})
export class PageExposantPage implements OnChanges
{
  public id = input<number>( -1 ) ;

  protected serviceExposant: ExposantService ;

  protected exposant = signal<Exposant | null>( null ) ;
  protected introuvable = signal( false ) ;
  protected livres = signal<any[]>( [] ) ;

  constructor( serviceExposant: ExposantService )
  {
    this.serviceExposant = serviceExposant ;
    addIcons( { locationOutline, mapOutline, bookOutline, chevronForward } ) ;
  }

  ngOnChanges()
  {
    this.exposant.set( null ) ;
    this.introuvable.set( false ) ;
    this.livres.set( [] ) ;

    this.serviceExposant.getExposantById( this.id() ).subscribe( {
      next: exposants =>
      {
        if( exposants.length > 0 ) this.exposant.set( exposants[0] ) ;
        else this.introuvable.set( true ) ;
      },
      error: () => this.introuvable.set( true )
    }) ;
    this.serviceExposant.getLivresExposant( this.id() ).subscribe( livres => this.livres.set( livres ) ) ;
  }

  // couleurs de la DA selon le type d'exposant
  couleurType( type: string ): string
  {
    let nom = this.serviceExposant.nomType( type ) ;
    if( nom == "Éditeur" ) return "#2b3990" ;
    if( nom == "Librairie" ) return "#1f8a5b" ;
    return "#c2569a" ;
  }
}
