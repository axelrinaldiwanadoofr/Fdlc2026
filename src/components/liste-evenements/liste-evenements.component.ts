import { Component, OnInit, OnChanges, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable, catchError, combineLatest, map, of, shareReplay } from 'rxjs';
import { EvenementService } from '../../services/evenement.service';
import { LieuService } from '../../services/lieu.service';
import { PersonneService } from '../../services/personne.service';
import { Evenement } from '../../modeles/Evenement';
import { Lieu } from '../../modeles/Lieu';
import { Personne } from '../../modeles/Personne';
import {
  IonList,
  IonItem,
} from '@ionic/angular';

// Tables num lieu -> nom et id personne -> "Prénom Nom".
// Chargées une seule fois et partagées par toutes les instances du composant
// (app-liste-lieux en affiche une par lieu).
let nomsLieux$: Observable<Map<number, string>> | null = null;
let nomsPersonnes$: Observable<Map<number, string>> | null = null;

@Component({
  selector: 'app-liste-evenements',
  templateUrl: './liste-evenements.component.html',
  styleUrls: ['./liste-evenements.component.scss'],
  standalone: true,
  imports: [
    IonList,
    IonItem,
    AsyncPipe,
    RouterLink,
  ],
})
export class ListeEvenementsComponent implements OnInit, OnChanges {
  childHtml = input<string>("$titre - Début : $debut ($nomLieu)");
  // Route appelée au clic sur une ligne ("" = lignes non cliquables)
  lienPage = input<string>("/page-evenement");

  titrePartie = input<string>("");
  debut = input<string>("");
  nomAnimateurPartie = input<string>("");
  titreLivrePartie = input<string>("");
  // Numéro du lieu de l'événement (-1 = tous les lieux)
  numLieu = input<number>(-1);

  protected listeEvenements: Observable<Array<Evenement>> | null = null;

  private nomsLieux = new Map<number, string>();
  private nomsPersonnes = new Map<number, string>();

  constructor(
    private serviceEvenement: EvenementService,
    private serviceLieu: LieuService,
    private servicePersonne: PersonneService,
    private router: Router
  ) {
    if (nomsLieux$ === null) {
      nomsLieux$ = this.serviceLieu.getTousLesLieux().pipe(
        map((lieux: Lieu[]) => new Map(lieux.map(l => [Number(l.num), l.nom] as [number, string]))),
        catchError(() => of(new Map<number, string>())),
        shareReplay(1)
      );
    }
    if (nomsPersonnes$ === null) {
      nomsPersonnes$ = this.servicePersonne.getToutesLesPersonnes().pipe(
        map((personnes: Personne[]) => new Map(personnes.map(p =>
          [Number(p.id), ((p.prenom ?? "") + " " + (p.nom ?? "")).trim()] as [number, string]))),
        catchError(() => of(new Map<number, string>())),
        shareReplay(1)
      );
    }
  }

  // ngOnChanges n'est appelé que si au moins un input est lié :
  // ngOnInit couvre seulement le cas <app-liste-evenements> sans aucun input
  // (sinon la liste était chargée deux fois au démarrage)
  ngOnInit() {
    if (this.listeEvenements === null) this.actualiser();
  }

  ngOnChanges() {
    this.actualiser();
  }

  private actualiser() {
    const evenements$ = this.serviceEvenement.getTousLesEvenements(
      this.titrePartie(),
      this.debut(),
      this.nomAnimateurPartie(),
      this.titreLivrePartie(),
      this.numLieu()
    );

    // Les événements s'affichent une fois les noms de lieux et de personnes connus
    this.listeEvenements = combineLatest([evenements$, nomsLieux$!, nomsPersonnes$!]).pipe(
      map(([evenements, lieux, personnes]) => {
        this.nomsLieux = lieux;
        this.nomsPersonnes = personnes;
        return evenements;
      })
    );
  }

  // Lignes cliquables seulement si la route existe dans app.routes.ts
  // (évite une erreur de navigation tant que /page-evenement n'est pas créée)
  protected lienActif(): boolean {
    const segment = this.lienPage().replace(/^\//, "").split("/")[0];
    if (segment === "") return false;
    return this.router.config.some(route => route.path?.split("/")[0] === segment);
  }

  itemText(evenement: Evenement): string {
    const nomLieu = this.nomsLieux.get(Number(evenement.numLieu));
    const nomAnimateur = this.nomsPersonnes.get(Number(evenement.idAnimateur));

    let html = this.childHtml();
    html = html.replace("$id", evenement.id ? evenement.id.toString() : "");
    html = html.replace("$titre", evenement.titre ? evenement.titre : "");
    html = html.replace("$debut", evenement.debut ? evenement.debut.toString() : "");
    html = html.replace("$nomLieu", nomLieu ? nomLieu : "Lieu non défini");
    html = html.replace("$nomAnimateur", nomAnimateur ? nomAnimateur : "");
    return html;
  }
}
