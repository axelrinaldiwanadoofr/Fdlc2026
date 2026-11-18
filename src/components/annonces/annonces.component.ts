// Auteur: Kevin MEYER - 16/11/2026

import { Component, OnInit, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { megaphoneOutline } from 'ionicons/icons';

import { AnnonceService } from '../../services/annonce.service';
import { Annonce } from '../../modeles/Annonce';

// Bandeau des annonces en cours (rien s'il n'y en a pas)
@Component({
  selector: 'app-annonces',
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.scss'],
  imports: [
    IonIcon
  ],
})
export class AnnoncesComponent implements OnInit
{
  protected annonces = signal<Annonce[]>( [] ) ;
  protected serviceAnnonce: AnnonceService ;

  constructor( serviceAnnonce: AnnonceService )
  {
    this.serviceAnnonce = serviceAnnonce ;
    addIcons( { megaphoneOutline } ) ;
  }

  ngOnInit()
  {
    this.serviceAnnonce.getAnnonces().subscribe( annonces => this.annonces.set( annonces ) ) ;
  }
}
