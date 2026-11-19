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
  protected professeur: string = "M. Axel RINALDI" ;

  constructor()
  {
    addIcons( { settingsOutline, shieldCheckmarkOutline } ) ;
  }

  // Etudiants de la classe, ranges par ordre alphabetique du prenom
  protected etudiants: Array<string> = [
    "Don-Divin KISSANGOU MABIALA",
    "Élodie VERMOYAL-DESAPHY",
    "Kevin MEYER",
    "Kenisha HAAS",
    "Liam EHRHARD",
    "Mathieu SIMON",
    "Merve YASAR",
    "Nadir MAHI",
    "Rabbi DZALAMOU",
    "Ricardo PATTA",
    "Sidi BENHADJEBA",
    "Yannis Benewinde SILGA",
  ] ;
}
