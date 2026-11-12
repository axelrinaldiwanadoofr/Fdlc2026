import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { personOutline, storefrontOutline } from 'ionicons/icons';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonMenuButton,
  IonList,
  IonItemDivider,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon
} from '@ionic/angular';

import { Personne } from '../../modeles/Personne';
import { Exposant } from '../../modeles/Exposant';
import { PersonneService } from '../../services/personne.service';
import { ExposantService } from '../../services/exposant.service';
import { LivresAuteurComponent } from '../../components/livres-auteur/livres-auteur.component';

@Component({
  selector: 'app-page-personne',
  templateUrl: './page-personne.page.html',
  styleUrls: ['./page-personne.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonList,
    IonItemDivider,
    IonItem,
    IonLabel,
    IonNote,
    IonIcon,
    CommonModule,
    RouterLink,
    LivresAuteurComponent
  ]
})
export class PagePersonnePage implements OnInit
{
  // Identifiant de la personne à afficher
  protected id = input<number>( -1 ) ;

  protected personne: Observable<Personne> | null = null ;

  // Stands où la personne est présente avec ses créneaux
  protected exposants: Observable<Exposant[]> | null = null ;

  constructor( private personneService: PersonneService, private exposantService: ExposantService )
  {
    addIcons( { personOutline, storefrontOutline } ) ;
  }

  ngOnInit()
  {
    if( this.id() > -1 )
    {
      this.personne = this.personneService.getPersonneById( this.id() ) ;
      this.exposants = this.exposantService.getExposantsByPersonne( this.id() ) ;
    }
  }
}
