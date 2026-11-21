import { Component, computed, signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton, IonSearchbar, IonSelect, IonSelectOption, IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';
import { ListePersonnesComponent } from '../../components/liste-personnes/liste-personnes.component';
import { Personne } from '../../modeles/Personne';
import { MajusculePipe } from '../../pipes/majuscule.pipe';

@Component({
  selector: 'app-page-liste-personnes',
  templateUrl: './page-liste-personnes.page.html',
  styleUrls: ['./page-liste-personnes.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton, IonSearchbar, IonSelect, IonSelectOption, IonButton, IonIcon, ListePersonnesComponent, MajusculePipe],
})
export class PageListePersonnesPage {
  // Filtres ("" = pas de filtre)
  protected recherche = signal("");
  protected specialite = signal("");

  // Rôles présents dans la liste chargée
  protected specialites = signal<string[]>([]);

  // Nombre de personnes trouvées (renvoyé par la liste)
  protected total = signal(0);

  protected filtreActif = computed(() => this.recherche().trim() != "" || this.specialite() != "");

  constructor() {
    addIcons({ closeCircleOutline });
  }

  onRecherche(event: any) {
    this.recherche.set(event.detail.value ?? "");
  }

  onCharge(personnes: Personne[]) {
    const specialites = new Set<string>();
    for (const personne of personnes) if ((personne.specialite ?? "").trim() != "") specialites.add(personne.specialite.trim().toLowerCase());
    this.specialites.set(Array.from(specialites).sort((a, b) => a.localeCompare(b)));
  }

  effacer() {
    this.recherche.set("");
    this.specialite.set("");
  }
}
