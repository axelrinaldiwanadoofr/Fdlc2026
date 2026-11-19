import { Component, WritableSignal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonBackButton,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeCircle, closeCircleOutline, optionsOutline, chevronUp, chevronDown } from 'ionicons/icons';
import { ListeEvenementsComponent } from '../../components/liste-evenements/liste-evenements.component';
import { FiltreChoixComponent, OptionFiltre } from '../../components/filtre-choix/filtre-choix.component';
import { EvenementService } from '../../services/evenement.service';
import { FiltresProgramme } from '../../modeles/Programme';

// Un filtre de la page : son nom, la valeur choisie et les choix possibles
interface Filtre {
  label: string;
  libelleVide: string;
  valeur: WritableSignal<string | number>;
  valeurVide: string | number;
  options: () => OptionFiltre[];
}

// Page programme : les filtres sont sur la page, le web component app-liste-evenements
// reçoit les critères en inputs et recharge les événements à chaque changement.
// La recherche reste visible ; les autres filtres sont rangés dans un panneau
// (bouton « Filtres ») et les filtres actifs restent affichés en pastilles.
@Component({
  selector: 'page-liste-evenements',
  templateUrl: './page-liste-evenements.page.html',
  styleUrls: ['./page-liste-evenements.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonChip,
    IonLabel,
    ListeEvenementsComponent,
    FiltreChoixComponent,
  ]
})
export class PageListeEvenementsPage {
  private serviceEvenement = inject(EvenementService);

  // Filtres ("" / -1 = pas de filtre)
  protected recherche = signal<string>("");
  protected theme = signal<string | number>("");
  protected numLieu = signal<string | number>(-1);
  protected idAnimateur = signal<string | number>(-1);
  protected idAuteur = signal<string | number>(-1);     // personne invitée ou dont un livre est présenté
  protected idLivre = signal<string | number>(-1);

  // Panneau des filtres ouvert ou rangé
  protected panneauOuvert = signal(false);

  // Nombre d'événements trouvés (renvoyé par le composant)
  protected total = signal<number | null>(null);

  // Choix possibles (php/evenement/filtres-evenements.php)
  private choix = toSignal(
    this.serviceEvenement.getFiltresEvenements().pipe(catchError(() => of(null))),
    { initialValue: null as FiltresProgramme | null }
  );

  protected filtres: Filtre[] = [
    { label: "Type", libelleVide: "Tous les types", valeur: this.theme, valeurVide: "",
      options: () => (this.choix()?.themes ?? []).map(t => ({ valeur: t, libelle: t })) },
    { label: "Lieu", libelleVide: "Tous les lieux", valeur: this.numLieu, valeurVide: -1,
      options: () => (this.choix()?.lieux ?? []).map(l => ({ valeur: l.num, libelle: l.nom })) },
    { label: "Auteur", libelleVide: "Tous les auteurs", valeur: this.idAuteur, valeurVide: -1,
      options: () => (this.choix()?.auteurs ?? []).map(a => ({ valeur: a.id, libelle: a.nom })) },
    { label: "Livre", libelleVide: "Tous les livres", valeur: this.idLivre, valeurVide: -1,
      options: () => (this.choix()?.livres ?? []).map(l => ({ valeur: l.id, libelle: l.titre })) },
    { label: "Animé par", libelleVide: "Tous les animateurs", valeur: this.idAnimateur, valeurVide: -1,
      options: () => (this.choix()?.animateurs ?? []).map(a => ({ valeur: a.id, libelle: a.nom })) },
  ];

  // Filtres du panneau actuellement utilisés, affichés en pastilles
  protected filtresActifs = computed(() => this.filtres
    .filter(f => f.valeur() !== f.valeurVide)
    .map(f => ({
      filtre: f,
      libelle: f.options().find(o => o.valeur === f.valeur())?.libelle ?? String(f.valeur()),
    })));

  protected filtreActif = computed(() => this.recherche().trim() !== "" || this.filtresActifs().length > 0);

  constructor() {
    addIcons({ closeCircle, closeCircleOutline, optionsOutline, chevronUp, chevronDown });
  }

  protected nombre(valeur: string | number): number {
    return Number(valeur);
  }

  protected effacer() {
    this.recherche.set("");
    for (const f of this.filtres) f.valeur.set(f.valeurVide);
  }
}
