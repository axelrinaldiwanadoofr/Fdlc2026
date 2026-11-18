import { Component, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, catchError, map, shareReplay } from 'rxjs';

import { IonInput, IonList, IonItem, IonCard, IonCardContent } from '@ionic/angular';
import { LivreService } from '../../services/livre.service';
import { Livre } from '../../modeles/Livre';

@Component({
  selector: 'app-titre-livre-combo',
  templateUrl: './titre-livre-combo.component.html',
  styleUrls: ['./titre-livre-combo.component.scss'],
  imports: [IonInput, IonList, IonItem, IonCard, IonCardContent, FormsModule, AsyncPipe]
})
export class TitreLivreComboComponent {
  // Interface du professeur : conservée pour les pages qui utilisent déjà le composant.
  public label = input('Titre du livre');
  public onTitreSelected = output<string>();

  // Interface de notre page de détail : conservée pour ne pas casser sa compilation.
  public titreSelectionne = output<string>();

  protected recherche = '';
  protected showList = signal(false);
  protected erreur = signal(false);
  protected listeLivres: Observable<Livre[]> = of([]);

  // Une seule requête sans filtre serveur, puis filtrage à chaque saisie dans Angular.
  private tousLesLivres$: Observable<Livre[]> | null = null;

  constructor(private serviceLivre: LivreService) {}

  onRechercheChange(event: CustomEvent): void {
    this.recherche = event.detail.value ?? '';
    this.afficherLivres();
    // Le professeur utilise cet événement pour filtrer pendant la frappe.
    this.onTitreSelected.emit(this.recherche);
  }

  onInputClick(): void {
    this.afficherLivres();
  }

  private afficherLivres(): void {
    this.showList.set(true);

    if (this.tousLesLivres$ === null) {
      this.erreur.set(false);
      this.tousLesLivres$ = this.serviceLivre.getTousLesLivres().pipe(
        catchError(() => {
          this.erreur.set(true);
          this.tousLesLivres$ = null; // Autorise un nouvel essai après une erreur.
          return of([] as Livre[]);
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }

    const texte = this.normaliser(this.recherche);
    this.listeLivres = this.tousLesLivres$.pipe(
      map(livres => livres.filter(livre =>
        this.normaliser(livre.titre ?? '').includes(texte)
      ))
    );
  }

  private normaliser(texte: string): string {
    return texte.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  onClickTitreSelected(titre: string): void {
    this.recherche = titre;
    this.showList.set(false);
    this.onTitreSelected.emit(titre);
    this.titreSelectionne.emit(titre);
  }

  masqueListe(): void {
    this.showList.set(false);
  }

  reset(): void {
    this.recherche = '';
    this.showList.set(false);
  }
}
