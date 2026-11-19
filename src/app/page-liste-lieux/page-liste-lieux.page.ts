import { Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonBackButton,
  IonAccordion,
  IonAccordionGroup,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
} from '@ionic/angular';
import { AppListeLieuxComponent } from '../../components/app-liste-lieux/app-liste-lieux.component';
import { NomLieuComboComponent } from '../../components/nom-lieu-combo/nom-lieu-combo.component';
import { NomExposantComboComponent } from '../../components/nom-exposant-combo/nom-exposant-combo.component';
import { NomPersonneComboComponent } from '../../components/nom-personne-combo/nom-personne-combo.component';

@Component({
  selector: 'app-page-liste-lieux',
  templateUrl: './page-liste-lieux.page.html',
  styleUrls: ['./page-liste-lieux.page.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonAccordion,
    IonAccordionGroup,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    AppListeLieuxComponent,
    NomLieuComboComponent,
    NomExposantComboComponent,
    NomPersonneComboComponent
  ],
})
export class PageListeLieuxPage
{
  // Recupère les références des web component de filtration
  protected nomLieuCombo = viewChild(NomLieuComboComponent);
  protected nomExposantCombo = viewChild(NomExposantComboComponent);
  protected nomPersonneCombo = viewChild(NomPersonneComboComponent);

  // Valeurs récupérées des web component de filtration
  public flt_nom: string = "" ;
  public flt_nomExposant: string = "" ;
  public flt_nomPersonne: string = "" ;
  public flt_titreEvenement: string = "" ;

  // Critères de recherche transmis à la liste des lieux
  public nom: string = "" ;
  public nomExposant: string = "" ;
  public nomPersonne: string = "" ;
  public titreEvenement: string = "" ;

  onLieuSelected( nom: string )
  {
    this.flt_nom = nom ;
  }

  onExposantSelected( nom: string )
  {
    this.flt_nomExposant = nom ;
  }

  onPersonneSelected( nom: string )
  {
    this.flt_nomPersonne = nom ;
  }

  onFiltrer()
  {
    this.nom = this.flt_nom.trim() ;
    this.nomExposant = this.flt_nomExposant.trim() ;
    this.nomPersonne = this.flt_nomPersonne.trim() ;
    this.titreEvenement = this.flt_titreEvenement.trim() ;
    // Masque les listes de recherche
    this.nomLieuCombo()?.masqueListe() ;
    this.nomExposantCombo()?.masqueListe() ;
    this.nomPersonneCombo()?.masqueListe() ;
  }

  // Vide tous les filtres et réaffiche tous les lieux
  onReinitialiser()
  {
    this.flt_nom = "" ;
    this.flt_nomExposant = "" ;
    this.flt_nomPersonne = "" ;
    this.flt_titreEvenement = "" ;
    this.nomLieuCombo()?.vider() ;
    this.nomExposantCombo()?.vider() ;
    this.nomPersonneCombo()?.vider() ;
    this.onFiltrer() ;
  }
}
