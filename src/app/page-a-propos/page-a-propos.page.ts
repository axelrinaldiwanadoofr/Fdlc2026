// Auteur: Kevin MEYER - 09/11/2026

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  IonNote,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { settingsOutline, shieldCheckmarkOutline } from 'ionicons/icons';

import { ParametreService } from '../../services/parametre.service';

// Page A propos : les etudiants et le professeur qui ont fait le projet
@Component({
  selector: 'app-page-a-propos',
  templateUrl: './page-a-propos.page.html',
  styleUrls: ['./page-a-propos.page.scss'],
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
    IonNote,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    RouterLink
  ]
})
export class PageAProposPage
{
  protected serviceParametre: ParametreService ;

  constructor( serviceParametre: ParametreService )
  {
    this.serviceParametre = serviceParametre ;
    addIcons( { settingsOutline, shieldCheckmarkOutline } ) ;
  }
}
