
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent
} from '@ionic/angular';

@Component({
  selector: 'app-titre-livre-combo',
  templateUrl: './titre-livre-combo.component.html',
  styleUrls: ['./titre-livre-combo.component.scss'],
  imports: [
    IonInput,
    IonList,
    IonItem,
    IonCard,
    IonCardContent,
    FormsModule
  ],
})
export class TitreLivreComboComponent {

  // Liste des titres reçue depuis la page parent
  public titres = input<string[]>([]);

  // Envoie le titre choisi à la page parent
  public titreSelectionne = output<string>();

  // Texte saisi par l'utilisateur
  protected recherche: string = '';

  // Affichage des propositions
  protected showList = signal(false);

  // Filtre les titres selon le texte saisi
  protected get titresFiltres(): string[] {
    const texte = this.recherche.trim().toLowerCase();

    return this.titres().filter(titre =>
      titre.toLowerCase().includes(texte)
    );
  }

  // À chaque frappe au clavier
  onRechercheChange(event: CustomEvent) {
    this.recherche = event.detail.value ?? '';
    this.showList.set(true);
  }

  // Quand l'utilisateur choisit un livre
  onTitreSelected(titre: string) {
    this.recherche = titre;
    this.showList.set(false);
    this.titreSelectionne.emit(titre);
  }

  // Quand l'utilisateur clique dans le champ
  onInputClick() {
    this.showList.set(true);
  }
}
