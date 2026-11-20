// Auteur: Kevin MEYER - 20/11/2026

import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonList, IonItemDivider, IonLabel, IonNote, IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mapOutline } from 'ionicons/icons';

import { PlanHallComponent } from '../plan-hall/plan-hall.component';

// Bloc "Où le trouver" des fiches auteur et livre : le stand sur un petit plan
@Component({
  selector: 'app-ou-trouver',
  templateUrl: './ou-trouver.component.html',
  styleUrls: ['./ou-trouver.component.scss'],
  imports: [IonList, IonItemDivider, IonLabel, IonNote, IonButton, IonIcon, RouterLink, PlanHallComponent],
})
export class OuTrouverComponent
{
  public numLieu = input<number>( -1 ) ;
  public titre = input<string>( "Où le trouver" ) ;

  // 302 -> hall 3
  protected hall = computed( () => Math.min( 5, Math.max( 1, Math.floor( this.numLieu() / 100 ) ) ) ) ;

  constructor()
  {
    addIcons( { mapOutline } ) ;
  }
}
