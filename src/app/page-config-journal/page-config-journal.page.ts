// Auteur: Kevin MEYER - 16/11/2026

import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonSearchbar,
} from '@ionic/angular';

import { ConfigService } from '../../services/config.service';

// Journal des actions de la configuration
@Component({
  selector: 'app-page-config-journal',
  templateUrl: './page-config-journal.page.html',
  styleUrls: ['./page-config-journal.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonSearchbar
  ]
})
export class PageConfigJournalPage
{
  protected serviceConfig: ConfigService ;
  protected router: Router ;

  protected lignes = signal<Array<{ date: string, identifiant: string, action: string, detail: string, ip: string }>>( [] ) ;
  protected recherche = signal("") ;

  protected lignesTrouvees = computed( () =>
  {
    let texte = this.recherche().toLowerCase() ;
    return this.lignes().filter( l => ( l.action + " " + ( l.identifiant ?? "" ) + " " + ( l.detail ?? "" ) ).toLowerCase().includes( texte ) ) ;
  }) ;

  constructor( serviceConfig: ConfigService, router: Router )
  {
    this.serviceConfig = serviceConfig ;
    this.router = router ;
  }

  ionViewWillEnter()
  {
    if( !this.serviceConfig.peut( "journal.voir" ) )
    {
      this.router.navigateByUrl( "/config" ) ;
      return ;
    }
    this.serviceConfig.getJournal().subscribe( lignes => this.lignes.set( lignes ) ) ;
  }

  // "2026-11-21 14:30:05" => "21/11 14:30"
  date( date: string ): string
  {
    return date.substring( 8, 10 ) + "/" + date.substring( 5, 7 ) + " " + date.substring( 11, 16 ) ;
  }

  estEchec( action: string ): boolean
  {
    return action.startsWith( "Échec" ) ;
  }
}
