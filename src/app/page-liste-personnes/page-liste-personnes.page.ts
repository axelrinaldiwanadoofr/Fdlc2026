import { Component, viewChild } from '@angular/core';
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
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
} from '@ionic/angular';
import { ListePersonnesComponent } from '../../components/liste-personnes/liste-personnes.component';

@Component({
  selector: 'app-page-liste-personnes',
  templateUrl: './page-liste-personnes.page.html',
  styleUrls: ['./page-liste-personnes.page.scss'],
  imports: [
    CommonModule,
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
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonList,
    ListePersonnesComponent,
  ],
})
export class PageListePersonnesPage {
  protected listePersonnes = viewChild(ListePersonnesComponent);
  public saisieNom = '';
  public saisieSpecialite = '';
  public saisieNomExposant = '';
  public saisieTitreEvenement = '';

  public nom = '';
  public specialite = '';
  public exposant = '';
  public evenement = '';

  onFiltrer() {
    this.nom = this.saisieNom.trim();
    this.evenement = this.saisieTitreEvenement.trim();
    this.exposant = this.saisieNomExposant.trim();
    this.specialite = this.saisieSpecialite.trim();
  }

  reinitialiser() {
    this.saisieNom = '';
    this.saisieSpecialite = '';
    this.saisieNomExposant = '';
    this.saisieTitreEvenement = '';
    this.nom = '';
    this.specialite = '';
    this.exposant = '';
    this.evenement = '';
  }
}
