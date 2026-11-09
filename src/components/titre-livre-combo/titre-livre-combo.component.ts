import { Component, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, catchError, map, shareReplay } from 'rxjs';

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

  // Les livres sont charges une seule fois, sans filtre PHP.
  private tousLesLivres$: Observable<Livre[]> | null = null;

  constructor(private serviceLivre: LivreService) {}

  onRechercheChange(event: CustomEvent) {
    this.recherche = event.detail.value ?? '';
    this.afficherLivres();
  }

  onInputClick() {
    this.afficherLivres();
  }

  private afficherLivres() {
    this.showList.set(true);

    if (this.tousLesLivres$ === null) {
      this.erreur.set(false);
      this.tousLesLivres$ = this.serviceLivre.getTousLesLivres().pipe(
        catchError(() => {
          this.erreur.set(true);
          // Permet de reessayer lors du prochain clic si le serveur etait indisponible.
          this.tousLesLivres$ = null;
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
    return texte
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  onTitreSelected(titre: string) {
    this.recherche = titre;
    this.showList.set(false);
    this.titreSelectionne.emit(titre);
  }
}
