// Auteur: Kevin MEYER - 18/11/2026

import { Component } from '@angular/core';
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
} from '@ionic/angular';

// Page RGPD : quelles données l'application garde et pourquoi
@Component({
  selector: 'app-page-donnees-personnelles',
  templateUrl: './page-donnees-personnelles.page.html',
  styleUrls: ['./page-donnees-personnelles.page.scss'],
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
    IonLabel
  ]
})
export class PageDonneesPersonnellesPage
{
}
