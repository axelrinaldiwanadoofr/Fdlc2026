import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton, 
  IonBackButton, 
  IonAccordion, 
  IonAccordionGroup, 
  IonItem, 
  IonItemDivider,
  IonLabel, 
  IonInput, 
  IonButton, 
  IonList 
} from '@ionic/angular';
import { ListeEvenementsComponent } from '../../components/liste-evenements/liste-evenements.component';

@Component({
  selector: 'page-liste-evenements',
  templateUrl: './page-liste-evenements.page.html',
  styleUrls: ['./page-liste-evenements.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonMenuButton, 
    IonBackButton, 
    IonAccordion, 
    IonAccordionGroup, 
    IonItem, 
    IonItemDivider,
    IonLabel, 
    IonInput, 
    IonButton, 
    IonList, 
    CommonModule, 
    FormsModule,
    ListeEvenementsComponent
  ]
})
export class PageListeEvenementsPage implements OnInit {
  titreFiltre: string = '';
  debutFiltre: string = '';
  animateurFiltre: string = '';
  livreFiltre: string = '';

  constructor() {}

  ngOnInit() {}

  onFiltrer()
  {

  }

  onReinitialiser()
  {

  }
}