import { Component, OnInit, input, signal } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular';

import { TitreLivreComboComponent } from '../../components/titre-livre-combo/titre-livre-combo.component';
import { EvenementService } from '../../servcies/evenement.service';
import { Evenement } from '../../modeles/Evenement';

@Component({
  selector: 'app-page-evenement',
  templateUrl: './page-evenement.component.html',
  styleUrls: ['./page-evenement.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    TitreLivreComboComponent
  ],
})
export class PageEvenementComponent implements OnInit {
  // Angular reçoit l'ID depuis l'URL /page-evenement/:id.
  public id = input<number>(-1);

  // La page affiche UN événement, et non toute la liste.
  public evenement = signal<Evenement | null>(null);
  public message = signal('Choisissez un événement depuis la liste des événements.');

  // Conserve le test de communication avec la combobox.
  public titreChoisi: string = '';

  constructor(private serviceEvenement: EvenementService) {}

  ngOnInit(): void {
    const identifiant = Number(this.id());
    if (!Number.isInteger(identifiant) || identifiant <= 0) return;

    this.message.set('Chargement de l’événement…');

    // En attendant evenement-by-id.php (mission de Mathieu),
    // on réutilise le service PHP de liste déjà développé.
    this.serviceEvenement.getTousLesEvenements().subscribe({
      next: liste => {
        const resultat = liste.find(e => Number(e.id) === identifiant) ?? null;
        this.evenement.set(resultat);
        this.message.set(resultat ? '' : 'Événement introuvable.');
      },
      error: () => {
        this.message.set('Impossible de charger les événements : vérifiez la base de données.');
      }
    });
  }
}
