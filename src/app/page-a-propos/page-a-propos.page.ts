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
  IonListHeader,
  IonItem,
  IonLabel,
} from '@ionic/angular';

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
    IonListHeader,
    IonItem,
    IonLabel,
  ]
})
export class PageAProposPage
{
  protected professeur: string = "M. Axel RINALDI" ;

  // Etudiants de la classe
  protected etudiants: Array<string> = [
    "Kevin MEYER",
    "Don-Divin KISSANGOU MABIALA",
    "Yannis Benewinde SILGA",
    "Sidi BENHADJEBA",
    "Nadir MAHI",
    "Kenisha HAAS",
    "Élodie VERMOYAL-DESAPHY",
    "Rabbi DZALAMOU",
    "Liam EHRHARD",
    "Ricardo PATTA",
    "Mathieu SIMON",
    "Merve YASAR",
  ] ;
}
