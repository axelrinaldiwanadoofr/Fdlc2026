import { Component, OnChanges, OnInit, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { IonList, IonItem } from '@ionic/angular';
import { PersonneService } from '../../services/personne.service';
import { Personne } from '../../modeles/Personne';

@Component({
  selector: 'app-liste-personnes',
  templateUrl: './liste-personnes.component.html',
  styleUrls: ['./liste-personnes.component.scss'],
  imports: [IonList, IonItem, AsyncPipe, RouterLink],
})
export class ListePersonnesComponent implements OnInit, OnChanges {
  childHtml = input<string>("$civilite <strong>$prenom $nom</strong> — $specialite");
  lienPage = input<string>("/page-personne");

  // Critères de filtrage
  idPersonne = input<number>(-1);
  specialite = input<string>("");
  idExposant = input<number>(-1);
  nom = input<string>("");
  titreLivre = input<string>("");
  titreEvenement = input<string>("");
  nomExposant = input<string>("");
  numLieu = input<number>(-1);

  protected listePersonnes: Observable<Personne[]> | null = null;

  constructor(private servicePersonne: PersonneService) {}

  ngOnInit() {
    this.actualiserListe();
  }

  ngOnChanges() {
    this.actualiserListe();
  }

  actualiserListe() {
    this.listePersonnes = this.servicePersonne.getToutesLesPersonnesK(
      this.idPersonne(),
      this.specialite(),
      this.idExposant(),
      this.nom(),
      this.titreLivre(),
      this.titreEvenement(),
      this.nomExposant(),
      this.numLieu()
    );
  }

  itemText(personne: Personne): string {
    return this.childHtml()
      .replace("$id", String(personne.id))
      .replace("$civilite", personne.civilite ?? "")
      .replace("$prenom", personne.prenom ?? "")
      .replace("$nom", personne.nom ?? "")
      .replace("$specialite", (personne as any).specialite ?? "");
  }
}
