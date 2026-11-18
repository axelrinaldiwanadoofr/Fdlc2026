import { Component, OnInit, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Observable} from "rxjs" ;
import { ExposantService } from '../../services/exposant.service';
import {Exposant} from "../../modeles/Exposant" ;
import {ListeExposantComponent} from "../../components/liste-exposant/liste-exposant.component"
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton, 
  IonBackButton, 
  IonAccordion, 
  IonList,
  IonItem, 
  IonLabel, 
  IonButton,
  IonAccordionGroup,
} from '@ionic/angular';

import {NomLieuComboComponent} from "../../components/nom-lieu-combo/nom-lieu-combo.component" ;
import { NomPersonneComboComponent } from '../../components/nom-personne-combo/nom-personne-combo.component';
import {NomExposantComboComponent} from "../../components/nom-exposant-combo/nom-exposant-combo.component" ;

@Component({
  selector: 'app-liste-exposants-page',
  templateUrl: './liste-exposants-page.page.html',
  styleUrls: ['./liste-exposants-page.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonAccordion,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    CommonModule,
    ListeExposantComponent,
    FormsModule,
    IonAccordionGroup,
    NomLieuComboComponent,
    NomPersonneComboComponent,
    NomExposantComboComponent
]
})
export class ListeExposantsPagePage implements OnInit 
{
  // Recupère les références de web component fils
  protected listeExposant = viewChild(ListeExposantComponent);
  protected nomLieuCombo = viewChild(NomLieuComboComponent);
  protected nomPersonneCombo = viewChild(NomPersonneComboComponent);
  protected nomExposantCombo = viewChild(NomExposantComboComponent);

  // Valeurs récupérées des web component de filtration
  public flt_nomAuteur: string = "" ;
  public flt_nomLieu: string = "" ;
  public flt_nomExposant: string = "" ;

  // Critères de rechercher d'un ensemble d'exposant
  public nomAuteur: string = "" ;
  public nomLieu: string = "" ;
  public nomExposant: string = "" ;

  constructor() 
  { 
  }

  ngOnInit() 
  {
  }

  onAuteurSelected( nom: string )
  {
    this.flt_nomAuteur = nom ;
  }

  onLieuSelected( nom: string )
  {
    this.flt_nomLieu = nom ;
  }

  onExposantSelected( nom: string )
  {
    this.flt_nomExposant = nom ;
  }

  fermeRechercherFiltrer()
  {
    // Referme l'accordion group
    let accordionGroup = document.getElementById( "liste-exposants-page-accordion" ) ;
    if( accordionGroup ) (accordionGroup as HTMLInputElement).value = "" ;
  }

  onFiltrer()
  {
    this.nomAuteur = this.flt_nomAuteur ;
    this.nomLieu = this.flt_nomLieu ;
    this.nomExposant = this.flt_nomExposant ;
    // Masque les listes de recherche 
    this.nomLieuCombo()?.masqueListe() ;
    this.nomPersonneCombo()?.masqueListe() ;
    this.nomExposantCombo()?.masqueListe() ;
  }
}
