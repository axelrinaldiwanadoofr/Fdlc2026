import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton, IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonInput, IonButton, IonList } from '@ionic/angular';
import { AppListeLieuxComponent } from '../../components/app-liste-lieux/app-liste-lieux.component';
import { TypeLieuComboComponent } from '../../components/app-type-lieu-combo/app-type-lieu-combo.component';

// Page listant tous les lieux du salon, avec filtre par nom et par type
@Component({
  selector: 'app-page-liste-lieux',
  templateUrl: './page-liste-lieux.page.html',
  styleUrls: ['./page-liste-lieux.page.scss'],
  imports: [FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton, IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonInput, IonButton, IonList, AppListeLieuxComponent, TypeLieuComboComponent],
})
export class PageListeLieuxPage
{
  // Valeurs en cours de saisie
  public saisieNom = "";
  public saisieType = "";

  // Filtres appliqués à la liste (transmis au web component)
  public nom = "";
  public type = "";

  // Sert à recréer le combo des types pour le vider à la réinitialisation
  public cleCombo = 0;

  onTypeLieuSelected(type: string) { this.saisieType = type; }

  onFiltrer()
  {
    this.nom = this.saisieNom.trim();
    this.type = this.saisieType.trim();
  }

  reinitialiser()
  {
    this.saisieNom = "";
    this.saisieType = "";
    this.nom = "";
    this.type = "";
    this.cleCombo++;
  }
}
