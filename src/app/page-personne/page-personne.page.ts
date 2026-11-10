// Modèle représentant les informations d'un livre
import { Livre } from '../../modeles/Livre';
// Service permettant de récupérer les livres depuis le PHP
import { LivreService } from '../../services/livre.service';
// Modèle représentant les informations d'un exposant
import { Exposant } from '../../modeles/Exposant';
// Service permettant de récupérer les exposants associés à une personne
import { ExposantService } from '../../services/exposant.service';
import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Personne } from '../../modeles/Personne';
import { PersonneService } from '../../services/personne.service';

// Importation des composants Ionic utilisés dans la page personne
// IonButtons : conteneur des boutons dans la barre de titre
// IonBackButton : bouton permettant de revenir à la page précédente
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonImg,
  IonButtons,
  IonBackButton,
  IonIcon
} from '@ionic/angular';

// Importation de l'icône utilisée en l'absence de photo
import { addIcons } from 'ionicons';
import { personOutline, storefrontOutline } from 'ionicons/icons';

@Component({
  selector: 'app-page-personne',
  templateUrl: './page-personne.page.html',
  styleUrls: ['./page-personne.page.scss'],
  // Déclaration des composants et modules utilisés dans le HTML
// Déclaration des composants Ionic et des modules Angular
// nécessaires au fonctionnement de la page personne
imports: [
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon, // Affichage de la silhouette lorsqu'aucune photo n'existe
  CommonModule, // Utilisation du pipe async et des fonctionnalités Angular
  FormsModule
]

})
export class PagePersonnePage implements OnInit {

  // Identifiant de la personne à afficher
  protected id= input<number>( -1 ) ;

  // Informations récupérées depuis le service
  protected personne: Observable<Personne> | null = null;

  // Liste des livres écrits par la personne
  // Observable permet de récupérer les données de manière asynchrone
  protected livres: Observable<Livre[]> | null = null;
  // Liste des exposants associés à la personne
  // Observable permet de récupérer les données de manière asynchrone
  protected exposants: Observable<Exposant[]> | null = null;

 constructor(
    private route: ActivatedRoute,
    private personneService: PersonneService,
    private livreService: LivreService,
    private exposantService: ExposantService
) {
    // Enregistrer les icônes de profil et d'exposant
    addIcons({ personOutline, storefrontOutline });
}

  ngOnInit()
  {
    // Affichage de l'identifiant dans la console pour faciliter les tests
    console.log('Identifiant de la personne :', this.id());

    // Vérifier qu'un identifiant de personne est disponible
    if (this.id() > -1)
    {
      // Récupérer les informations personnelles et la biographie
      this.personne = this.personneService.getPersonneById(this.id());

      // Récupérer les livres écrits par cette personne
      this.livres = this.livreService.getLivresByPersonne(this.id());

      // Récupérer les exposants et les créneaux associés à cette personne
      this.exposants = this.exposantService.getExposantsByPersonne(this.id());  
    }
  }
}
