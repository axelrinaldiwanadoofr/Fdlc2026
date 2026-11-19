// Auteur: Kevin MEYER - 18/11/2026

import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonNote,
} from '@ionic/angular';

import { ConfigService } from '../../services/config.service';

// Ce qui est enregistré sur le compte connecté
@Component({
  selector: 'app-page-config-mes-donnees',
  templateUrl: './page-config-mes-donnees.page.html',
  styleUrls: ['./page-config-mes-donnees.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonNote,
    RouterLink
  ]
})
export class PageConfigMesDonneesPage
{
  protected serviceConfig: ConfigService ;
  protected router: Router ;

  protected donnees = signal<any>( null ) ;

  constructor( serviceConfig: ConfigService, router: Router )
  {
    this.serviceConfig = serviceConfig ;
    this.router = router ;
  }

  ionViewWillEnter()
  {
    if( !this.serviceConfig.connecte() )
    {
      this.router.navigateByUrl( "/config" ) ;
      return ;
    }
    this.serviceConfig.getMesDonnees().subscribe({
      next: donnees => this.donnees.set( donnees ),
      error: erreur => { if( erreur.status == 401 ) this.serviceConfig.deconnexion() ; }
    }) ;
  }

  // "2026-11-21 14:30:05" => "21/11/2026 14:30"
  date( date: string ): string
  {
    if( !date ) return "Jamais" ;
    return date.substring( 8, 10 ) + "/" + date.substring( 5, 7 ) + "/" + date.substring( 0, 4 ) + " " + date.substring( 11, 16 ) ;
  }
}
