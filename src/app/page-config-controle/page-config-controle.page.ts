// Auteur: Kevin MEYER - 16/11/2026

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
  IonLabel,
  IonBadge,
} from '@ionic/angular';

import { ConfigService } from '../../services/config.service';

// une ligne de la page : ce qu'on compte et la page où le corriger
class Controle
{
  public code: string ;
  public texte: string ;
  public page: string ;
  public filtre: string ;

  constructor( code: string, texte: string, page: string, filtre: string = "" )
  {
    this.code = code ;
    this.texte = texte ;
    this.page = page ;
    this.filtre = filtre ;
  }
}

// Page de contrôle : ce qui manque encore dans la base avant le festival
@Component({
  selector: 'app-page-config-controle',
  templateUrl: './page-config-controle.page.html',
  styleUrls: ['./page-config-controle.page.scss'],
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
    IonBadge,
    RouterLink
  ]
})
export class PageConfigControlePage
{
  protected serviceConfig: ConfigService ;
  protected router: Router ;

  protected nombres = signal<any>( null ) ;

  protected controles: Controle[] = [
    new Controle( "personnesSansPhoto", "Personnes sans photo", "/config-personne", "photo" ),
    new Controle( "personnesSansBio", "Personnes sans biographie", "/config-personne" ),
    new Controle( "personnesSansStand", "Auteurs sur aucun stand", "/config-personne" ),
    new Controle( "exposantsSansStand", "Exposants sans stand", "/config-exposant", "stand" ),
    new Controle( "livresSansEditeur", "Livres sans éditeur", "/config-livre", "editeur" ),
    new Controle( "livresSansAuteur", "Livres sans auteur", "/config-livre", "auteur" ),
    new Controle( "lieuxNonPlaces", "Stands occupés pas placés sur le plan", "/config-plan" ),
    new Controle( "evenementsSansAnimateur", "Événements sans animateur", "/config-evenement" ),
  ] ;

  constructor( serviceConfig: ConfigService, router: Router )
  {
    this.serviceConfig = serviceConfig ;
    this.router = router ;
  }

  // Sans mot de passe on retourne sur la page principale de config
  ionViewWillEnter()
  {
    if( !this.serviceConfig.connecte() )
    {
      this.router.navigateByUrl( "/config" ) ;
      return ;
    }

    this.serviceConfig.getControle().subscribe( nombres => this.nombres.set( nombres ) ) ;
  }

  nombre( controle: Controle ): number
  {
    return this.nombres()?.[controle.code] ?? 0 ;
  }

  parametres( controle: Controle ): any
  {
    return controle.filtre ? { filtre: controle.filtre } : {} ;
  }
}
