import { Component, computed, inject, signal } from '@angular/core';
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
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';
import { ListeEvenementsComponent } from '../../components/liste-evenements/liste-evenements.component';
import { EvenementService } from '../../services/evenement.service';
import { FiltresProgramme } from '../../modeles/Programme';

// Page programme : les filtres sont sur la page, le web component app-liste-evenements
// reçoit les critères en inputs et recharge les événements à chaque changement.
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
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    ListeEvenementsComponent,
  ]
})
export class PageListeEvenementsPage {
  private serviceEvenement = inject(EvenementService);

  // Filtres ("" / -1 = pas de filtre)
  protected recherche = signal<string>("");
  protected theme = signal<string>("");
  protected numLieu = signal<number>(-1);
  protected idAnimateur = signal<number>(-1);

  // Nombre d'événements trouvés (renvoyé par le composant)
  protected total = signal<number | null>(null);

  protected filtreActif = computed(() =>
    this.recherche().trim() !== "" || this.theme() !== "" || this.numLieu() !== -1 || this.idAnimateur() !== -1);

  // Choix des listes déroulantes
  protected filtres = toSignal(
    this.serviceEvenement.getFiltresEvenements().pipe(catchError(() => of(null))),
    { initialValue: null as FiltresProgramme | null }
  );

  constructor() {
    addIcons({ closeCircleOutline });
  }

  protected effacer() {
    this.recherche.set("");
    this.theme.set("");
    this.numLieu.set(-1);
    this.idAnimateur.set(-1);
  }
}
