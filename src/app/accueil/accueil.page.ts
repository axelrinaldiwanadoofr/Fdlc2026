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
import { AccueilNouveauComponent } from '../../components/accueil-nouveau/accueil-nouveau.component';
import { ParametreService } from '../../services/parametre.service';

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
    AnnoncesComponent,
    AccueilNouveauComponent]
})
export class AccueilPage implements OnInit {

  protected serviceParametre: ParametreService ;

  // l'ancienne ou la nouvelle page selon le reglage choisi dans la config
  constructor( serviceParametre: ParametreService )
  {
    this.serviceParametre = serviceParametre ;
  }

  ngOnInit() {
  }

}
