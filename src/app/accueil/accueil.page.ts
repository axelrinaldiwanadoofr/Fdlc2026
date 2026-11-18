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
 } from '@ionic/angular';
import { AnnoncesComponent } from '../../components/annonces/annonces.component';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons,
    IonMenuButton,
    CommonModule, 
    FormsModule,
    AnnoncesComponent]
})
export class AccueilPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
