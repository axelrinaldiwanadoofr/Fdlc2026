
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IonItem, IonSelect, IonSelectOption, IonSearchbar } from '@ionic/angular';
import { EvenementService } from '../../servcies/evenement.service';

@Component({
  selector: 'app-titre-evenement-combo',
  standalone: true,
  templateUrl: './titre-evenement-combo.component.html',
  styleUrls: ['./titre-evenement-combo.component.scss'],
  imports: [IonItem, IonSelect, IonSelectOption, IonSearchbar],
})
export class TitreEvenementComboComponent implements OnInit {

  @Input() titre: string = '';

  titresEvenements: string[] = [];

  recherche: string = '';

  get titresFiltres(): string[] {
    return this.titresEvenements.filter(titre =>
      titre.toLowerCase().includes(this.recherche.toLowerCase())
    );
  }

  onRechercheChange(valeur: string | null | undefined) {
    this.recherche = valeur ?? '';
  }

  @Output() titreChange = new EventEmitter<string>();

  constructor(private evenementService: EvenementService) {}

  ngOnInit() {
    this.evenementService.getTitresEvenements().subscribe({
      next: (titres) => {
        this.titresEvenements = titres;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des événements :', erreur);
      }
    });
  }

  onTitreChange(valeur: string) {
    this.titre = valeur;
    this.titreChange.emit(valeur);
  }
}
