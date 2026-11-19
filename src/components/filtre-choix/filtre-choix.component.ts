import { Component, computed, input, output, signal } from '@angular/core';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronDown, closeCircle, checkmark } from 'ionicons/icons';

// Une valeur proposée par le filtre
export interface OptionFiltre {
  valeur: string | number;
  libelle: string;
}

// Web component : filtre à choix unique avec recherche dans la liste.
// Affiche un champ compact (libellé + valeur choisie) ; au clic, une fenêtre
// s'ouvre avec une barre de recherche (accents et majuscules ignorés) et la liste.
// Sur téléphone la fenêtre s'ouvre par le bas (feuille), sur ordinateur au centre.
//
// Inputs :
//   label       : nom du filtre ("Auteur")
//   options     : valeurs proposées [ { valeur, libelle } ]
//   valeur      : valeur choisie (valeurVide = aucun filtre)
//   valeurVide  : valeur "pas de filtre" ("" ou -1)
//   libelleVide : choix "pas de filtre" dans la liste ("Tous les auteurs")
//   libelleChampVide : texte du champ fermé sans filtre ("Tous" : le nom du filtre est déjà au-dessus)
// Output :
//   valeurChange : nouvelle valeur choisie
//
// Exemple :
//   <app-filtre-choix label="Auteur" [options]="auteurs" [valeur]="idAuteur()" [valeurVide]="-1"
//                     libelleVide="Tous les auteurs" (valeurChange)="idAuteur.set( $any($event) )">
//   </app-filtre-choix>
@Component({
  selector: 'app-filtre-choix',
  templateUrl: './filtre-choix.component.html',
  styleUrls: ['./filtre-choix.component.scss'],
  standalone: true,
  imports: [IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent,
            IonSearchbar, IonList, IonItem, IonLabel, IonIcon],
})
export class FiltreChoixComponent {
  label = input<string>("");
  options = input<OptionFiltre[]>([]);
  valeur = input<string | number>("");
  valeurVide = input<string | number>("");
  libelleVide = input<string>("Tous");
  libelleChampVide = input<string>("Tous");

  valeurChange = output<string | number>();

  protected ouvert = signal(false);
  protected recherche = signal("");
  // Sur téléphone : feuille qui monte du bas
  protected feuille = signal(false);

  protected actif = computed(() => this.valeur() !== this.valeurVide());

  protected libelleChoisi = computed(() => {
    if (!this.actif()) return this.libelleChampVide();
    return this.options().find(o => o.valeur === this.valeur())?.libelle ?? this.libelleChampVide();
  });

  // Options contenant tous les mots tapés
  protected optionsFiltrees = computed(() => {
    const mots = this.normaliser(this.recherche()).split(/\s+/).filter(m => m !== "");
    if (mots.length === 0) return this.options();
    return this.options().filter(o => {
      const texte = this.normaliser(o.libelle);
      return mots.every(m => texte.includes(m));
    });
  });

  constructor() {
    addIcons({ chevronDown, closeCircle, checkmark });
  }

  protected ouvrir() {
    this.recherche.set("");
    this.feuille.set(window.innerWidth < 768);
    this.ouvert.set(true);
  }

  // On peut taper directement : le curseur est placé dans la recherche à l'ouverture
  protected focusRecherche(event: Event) {
    const recherche = (event.target as HTMLElement).querySelector('ion-searchbar') as HTMLIonSearchbarElement | null;
    recherche?.setFocus();
  }

  protected choisir(valeur: string | number) {
    this.valeurChange.emit(valeur);
    this.ouvert.set(false);
  }

  protected effacer(event: Event) {
    event.stopPropagation();
    this.valeurChange.emit(this.valeurVide());
  }

  private normaliser(texte: string): string {
    return (texte ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }
}
