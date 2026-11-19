import { Component, OnChanges, OnInit, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { IonList, IonItem, IonLabel } from '@ionic/angular';
import { PersonneService } from '../../services/personne.service';
import { Personne } from '../../modeles/Personne';

@Component({
  selector: 'app-liste-personnes',
  templateUrl: './liste-personnes.component.html',
  styleUrls: ['./liste-personnes.component.scss'],
  imports: [IonList, IonItem, IonLabel, AsyncPipe, RouterLink],
})
export class ListePersonnesComponent implements OnInit, OnChanges {
  childHtml = input<string>("$civilite <strong>$prenom $nom</strong> — $specialite");
  lienPage = input<string>("/page-personne");
  nom = input<string>("");
  // Personnes présentes chez un exposant du lieu (-1 = pas de filtre)
  numLieu = input<number>(-1);
  protected listePersonnes: Observable<Personne[]> | null = null;

  constructor(private servicePersonne: PersonneService) {}

  ngOnInit() { this.actualiserListe(); }
  ngOnChanges() { this.actualiserListe(); }

  private actualiserListe() {
    this.listePersonnes = (this.numLieu() != -1)
      ? this.servicePersonne.getToutesLesPersonnesK(-1, "", -1, this.nom(), "", "", "", this.numLieu())
      : this.servicePersonne.getToutesLesPersonnes(this.nom());
  }

  itemText(personne: Personne): string {
    return this.childHtml()
      .replaceAll("$id", String(personne.id))
      .replaceAll("$civilite", this.texte(personne.civilite))
      .replaceAll("$prenom", this.texte(personne.prenom))
      .replaceAll("$nom", this.texte(personne.nom))
      .replaceAll("$specialite", this.texte((personne as any).specialite));
  }

  // Les textes viennent de la base : affichés comme du texte, pas comme du html
  texte(valeur: string): string {
    return (valeur ?? "").trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}
