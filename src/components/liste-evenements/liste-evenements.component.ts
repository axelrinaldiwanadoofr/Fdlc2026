import { Component, OnInit, OnChanges, input, signal } from '@angular/core';
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
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';

// Tables num lieu -> nom et id personne -> "Prénom Nom".
// Chargées une seule fois et partagées par toutes les instances du composant
// (app-liste-lieux en affiche une par lieu).
let nomsLieux$: Observable<Map<number, string>> | null = null;
let nomsPersonnes$: Observable<Map<number, string>> | null = null;

// Événements commençant à la même heure
export interface Creneau {
  heure: string;                 // "10h30"
  evenements: Evenement[];
}

// Un jour du festival
export interface JourPlanning {
  cle: string;                   // "2026-11-21" (ou "sans-date")
  nomJour: string;               // "Samedi"
  date: string;                  // "21 novembre"
  journee: Evenement[];          // événements sans heure (00:00) : stands, expos...
  creneaux: Creneau[];           // événements avec heure, triés
  total: number;
}

const JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
              "août", "septembre", "octobre", "novembre", "décembre"];

@Component({
  selector: 'app-liste-evenements',
  templateUrl: './liste-evenements.component.html',
  styleUrls: ['./liste-evenements.component.scss'],
  standalone: true,
  imports: [
    IonList,
    IonItem,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    AsyncPipe,
    RouterLink,
  ],
})
export class ListeEvenementsComponent implements OnInit, OnChanges {
  // Format d'une ligne en affichage compact ($id $titre $debut $nomLieu $nomAnimateur).
  // Vide (par défaut) = affichage programme par jour.
  childHtml = input<string>("");
  // Route appelée au clic sur un événement ("" = non cliquable)
  lienPage = input<string>("/page-evenement");

  titrePartie = input<string>("");
  debut = input<string>("");
  nomAnimateurPartie = input<string>("");
  titreLivrePartie = input<string>("");
  // Numéro du lieu de l'événement (-1 = tous les lieux)
  numLieu = input<number>(-1);

  protected listeEvenements: Observable<Array<Evenement>> | null = null;
  protected planning: Observable<Array<JourPlanning>> | null = null;

  // Onglet sélectionné : "tous" ou la clé d'un jour
  protected jourChoisi = signal<string>("tous");

  private nomsLieux = new Map<number, string>();
  private nomsPersonnes = new Map<number, string>();

  constructor(
    private serviceEvenement: EvenementService,
    private serviceLieu: LieuService,
    private servicePersonne: PersonneService,
    private router: Router
  ) {
    addIcons({ chevronForward });

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
      }),
      catchError(() => of([] as Evenement[])),
      shareReplay(1)
    );

    this.planning = this.listeEvenements.pipe(map(evenements => this.grouperParJour(evenements)));
  }

  // ---------- Planning ----------

  // Regroupe les événements par jour, puis par heure de début
  private grouperParJour(evenements: Evenement[]): JourPlanning[] {
    const jours = new Map<string, JourPlanning>();

    const tries = [...evenements].sort((a, b) =>
      (a.debut ?? "").localeCompare(b.debut ?? "") || (a.titre ?? "").localeCompare(b.titre ?? ""));

    for (const evenement of tries) {
      const date = this.lireDate(evenement.debut);
      const cle = date ? evenement.debut.substring(0, 10) : "sans-date";

      let jour = jours.get(cle);
      if (!jour) {
        jour = {
          cle,
          nomJour: date ? JOURS[date.getDay()] : "Date à définir",
          date: date ? date.getDate() + " " + MOIS[date.getMonth()] : "",
          journee: [],
          creneaux: [],
          total: 0,
        };
        jours.set(cle, jour);
      }
      jour.total++;

      if (!date || this.estToutLaJournee(evenement)) {
        jour.journee.push(evenement);
      } else {
        const heure = this.heure(date);
        const dernier = jour.creneaux[jour.creneaux.length - 1];
        if (dernier && dernier.heure === heure) dernier.evenements.push(evenement);
        else jour.creneaux.push({ heure, evenements: [evenement] });
      }
    }

    // Les jours datés d'abord (ordre chronologique), "Date à définir" à la fin
    return [...jours.values()].sort((a, b) =>
      a.cle === "sans-date" ? 1 : b.cle === "sans-date" ? -1 : a.cle.localeCompare(b.cle));
  }

  protected choisirJour(event: CustomEvent) {
    this.jourChoisi.set(String(event.detail.value ?? "tous"));
  }

  protected joursAffiches(jours: JourPlanning[]): JourPlanning[] {
    const choix = this.jourChoisi();
    if (choix === "tous") return jours;
    const jour = jours.filter(j => j.cle === choix);
    // le jour choisi n'existe plus (filtres modifiés) : on revient à "tous"
    return jour.length ? jour : jours;
  }

  // Un événement à 00:00 = présent toute la journée (stands, expositions...)
  private estToutLaJournee(evenement: Evenement): boolean {
    return (evenement.debut ?? "").substring(11, 16) === "00:00";
  }

  private lireDate(datetime: string | null | undefined): Date | null {
    if (!datetime) return null;
    const d = new Date(datetime.replace(" ", "T"));
    return isNaN(d.getTime()) ? null : d;
  }

  private heure(d: Date): string {
    return d.getHours() + "h" + d.getMinutes().toString().padStart(2, "0");
  }

  // Heure de fin ("11h30"), seulement si elle tombe le même jour après le début
  protected heureFin(evenement: Evenement): string {
    const debut = this.lireDate(evenement.debut);
    const fin = this.lireDate(evenement.fin);
    if (!debut || !fin) return "";
    return fin.toDateString() === debut.toDateString() && fin > debut ? this.heure(fin) : "";
  }

  protected nomLieu(evenement: Evenement): string {
    return this.nomsLieux.get(Number(evenement.numLieu)) ?? "";
  }

  protected nomAnimateur(evenement: Evenement): string {
    return this.nomsPersonnes.get(Number(evenement.idAnimateur)) ?? "";
  }

  // Lignes cliquables seulement si la route existe dans app.routes.ts
  // (évite une erreur de navigation tant que /page-evenement n'est pas créée)
  protected lienActif(): boolean {
    const segment = this.lienPage().replace(/^\//, "").split("/")[0];
    if (segment === "") return false;
    return this.router.config.some(route => route.path?.split("/")[0] === segment);
  }

  protected lien(evenement: Evenement): any[] | null {
    return this.lienActif() ? [this.lienPage(), evenement.id] : null;
  }

  // ---------- Affichage compact (childHtml renseigné, ex : app-liste-lieux) ----------

  itemText(evenement: Evenement): string {
    const nomLieu = this.nomLieu(evenement);
    const nomAnimateur = this.nomAnimateur(evenement);
    const debut = this.lireDate(evenement.debut);
    const debutTexte = debut
      ? JOURS[debut.getDay()].toLowerCase() + " " + (this.estToutLaJournee(evenement) ? "(toute la journée)" : this.heure(debut))
      : "";

    let html = this.childHtml();
    html = html.replace("$id", evenement.id ? evenement.id.toString() : "");
    html = html.replace("$titre", evenement.titre ? evenement.titre : "");
    html = html.replace("$debut", debutTexte);
    html = html.replace("$nomLieu", nomLieu ? nomLieu : "Lieu non défini");
    html = html.replace("$nomAnimateur", nomAnimateur ? nomAnimateur : "");
    return html;
  }
}
