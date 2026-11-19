import { InvitesEvenementComponent } from '../../components/invites-evenement/invites-evenement.component';
import { Component, OnInit, input, signal } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonMenuButton,
} from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { calendarOutline, locationOutline, micOutline, peopleOutline, bookOutline, mapOutline, chevronForward } from 'ionicons/icons';

import { EvenementService } from '../../services/evenement.service';
import { Evenement } from '../../modeles/Evenement';

@Component({
  selector: 'app-page-evenement',
  templateUrl: './page-evenement.component.html',
  styleUrls: ['./page-evenement.component.scss'],
  imports: [InvitesEvenementComponent, 
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonIcon,
    IonButton,
    IonMenuButton,
    RouterLink,
  ],
})
export class PageEvenementComponent implements OnInit {
  // Angular reçoit l'ID depuis l'URL /page-evenement/:id.
  public id = input<number>(-1);

  // La page affiche UN événement, et non toute la liste.
  public evenement = signal<Evenement | null>(null);
  public message = signal('Choisissez un événement depuis la liste des événements.');

  constructor(private serviceEvenement: EvenementService) {
    addIcons({ calendarOutline, locationOutline, micOutline, peopleOutline, bookOutline, mapOutline, chevronForward });
  }

  ngOnInit(): void {
    const identifiant = Number(this.id());
    if (!Number.isInteger(identifiant) || identifiant <= 0) return;

    this.message.set('Chargement de l’événement…');

    // evenement-id.php renvoie l'événement mis en forme (jour, heures, lieu, animateur, livres présentés)
    this.serviceEvenement.getEvenementById( this.id() ).subscribe({
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
