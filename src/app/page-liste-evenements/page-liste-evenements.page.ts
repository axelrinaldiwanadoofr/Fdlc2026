import { Component, OnInit, signal } from '@angular/core';
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
  IonSearchbar,
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
    CommonModule, 
    FormsModule,
    ListeEvenementsComponent,
    IonBackButton,
    IonSearchbar
  ]
})
export class PageListeEvenementsPage implements OnInit {
  // Texte de la barre de recherche (filtre fait dans app-liste-evenements, sans recharger)
  protected recherche = signal('');

  titreFiltre: string = '';
  debutFiltre: string = '';
  animateurFiltre: string = '';
  livreFiltre: string = '';

  constructor() {}

  ngOnInit() {}
}