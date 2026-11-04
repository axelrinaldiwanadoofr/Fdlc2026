
import { Component, OnInit } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular';

//++ 04/11/26

import { TitreLivreComboComponent } from '../../components/titre-livre-combo/titre-livre-combo.component';

//

@Component({
  selector: 'app-page-evenement',
  templateUrl: './page-evenement.component.html',
  styleUrls: ['./page-evenement.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    TitreLivreComboComponent
  ],
})

export class PageEvenementComponent implements OnInit {

  titreChoisi: string = '';
  
  constructor() { }

  ngOnInit() { }

}
