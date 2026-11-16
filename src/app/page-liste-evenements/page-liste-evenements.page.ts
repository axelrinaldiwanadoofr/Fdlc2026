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
  IonList,
  IonItemDivider,
  IonLabel
} from '@ionic/angular';
import { ListeEvenementsComponent } from '../../components/liste-evenements/liste-evenements.component';

@Component({
  selector: 'page-liste-evenements',
  templateUrl: './page-liste-evenements.page.html',
  styleUrls: ['./page-liste-evenements.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonList,
    IonItemDivider,
    IonLabel,
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonMenuButton, 
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
}