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
import { NomPersonneComboComponent } from '../../components/nom-personne-combo/nom-personne-combo.component';
import { NomExposantComboComponent } from '../../components/nom-exposant-combo/nom-exposant-combo.component';

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
    NomPersonneComboComponent,
    NomExposantComboComponent,
  ],
})
export class PageListePersonnesPage {
  protected listePersonnes = viewChild(ListePersonnesComponent);
  protected nomPersonneCombo = viewChild(NomPersonneComboComponent);
  protected nomExposantCombo = viewChild(NomExposantComboComponent);

  public saisieNom: any = '';
  public saisieSpecialite = '';
  public saisieNomExposant: any = '';
  public saisieTitreEvenement = '';

  public nom = '';
  public specialite = '';
  public exposant = '';
  public evenement = '';

  private enTexte(valeur: any): string {
    if (valeur == null) return '';
    if (typeof valeur === 'string') return valeur.trim();
    return String(valeur.nom ?? '').trim();
  }

  onFiltrer() {
    console.log('saisieNom =', this.saisieNom, '| saisieNomExposant =', this.saisieNomExposant);

    this.nom = this.enTexte(this.saisieNom);
    this.exposant = this.enTexte(this.saisieNomExposant);
    this.specialite = this.saisieSpecialite.trim();
    this.evenement = this.saisieTitreEvenement.trim();
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

    this.nomPersonneCombo()?.reset();
    this.nomExposantCombo()?.reset();
  }
}