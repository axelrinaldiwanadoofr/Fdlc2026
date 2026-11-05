
import { Component, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, catchError } from 'rxjs';

import {
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent
} from '@ionic/angular';

import { Livre } from '../../modeles/Livre';
import { LivreService } from '../../servcies/livre.service';

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
    FormsModule,
    AsyncPipe
  ]
})
export class TitreLivreComboComponent {

  protected recherche = '';
  protected showList = signal(false);
  protected erreur = signal(false);
  protected listeLivres: Observable<Livre[]> = of([]);

  public titreSelectionne = output<string>();

  constructor(private serviceLivre: LivreService) {}

  onRechercheChange(event: CustomEvent) {
    this.recherche = event.detail.value ?? '';
    this.chargerLivres();
  }

  onInputClick() {
    this.chargerLivres();
  }

  private chargerLivres() {
    this.showList.set(true);
    this.erreur.set(false);

    this.listeLivres = this.serviceLivre
      .getTousLesLivres(this.recherche)
      .pipe(
        catchError(() => {
          this.erreur.set(true);
          return of([]);
        })
      );
  }

  onTitreSelected(titre: string) {
    this.recherche = titre;
    this.showList.set(false);
    this.titreSelectionne.emit(titre);
  }
}
