import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { IonIcon, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronForward, locationOutline, micOutline, timeOutline } from 'ionicons/icons';
import { EvenementService } from '../../services/evenement.service';
import { Evenement } from '../../modeles/Evenement';
import { CriteresProgramme } from '../../modeles/Programme';

// Web component : programme des événements du festival, réutilisable sur toutes les pages.
//
// Le composant charge lui-même les événements correspondant à ses inputs
// (EvenementService.getProgramme -> php/evenement/programme.php). Le regroupement
// (événements permanents, jours, heures) et la mise en forme sont faits côté PHP :
// ici on ne fait qu'afficher.
//
// Inputs (tous facultatifs, "" / -1 = pas de filtre) :
//   recherche   : auteur, titre, mot du descriptif, lieu, livre...
//   theme       : type d'événement ("GRAND ENTRETIEN"...)
//   numLieu     : événements d'un lieu
//   idAnimateur : événements animés par une personne
//   idPersonne  : événements d'une personne (anime, livre présenté ou invitée) : page auteur, filtre « Auteur »
//   idLivre     : événements liés à un livre (présenté ou écrit par un invité) : filtre « Livre »
//   onglets     : true  = onglets « Samedi / Dimanche / Permanents » (page programme)
//                 false = tout à la suite, sections vides masquées (page auteur, lieu...)
//   lienPage    : page de détail ouverte au clic (lienPage/id), "" = non cliquable
//   messageVide : texte affiché quand aucun événement ne correspond ("" = rien)
// Output :
//   total       : nombre d'événements trouvés, émis à chaque chargement
//
// Exemples :
//   <app-liste-evenements [recherche]="texte" [theme]="theme"></app-liste-evenements>
//   <app-liste-evenements [idPersonne]="p.id" [onglets]="false" (total)="nb.set($event)"></app-liste-evenements>
@Component({
  selector: 'app-liste-evenements',
  templateUrl: './liste-evenements.component.html',
  styleUrls: ['./liste-evenements.component.scss'],
  standalone: true,
  imports: [IonIcon, IonSegment, IonSegmentButton, IonLabel, RouterLink, NgTemplateOutlet],
  host: { '[class.avec-onglets]': 'onglets()' },
})
export class ListeEvenementsComponent {
  private serviceEvenement = inject(EvenementService);

  recherche = input<string>("");
  theme = input<string>("");
  type = input<string>("");
  numLieu = input<number>(-1);
  idAnimateur = input<number>(-1);
  idPersonne = input<number>(-1);
  idLivre = input<number>(-1);
  onglets = input<boolean>(true);
  lienPage = input<string>("/page-evenement");
  messageVide = input<string>("Aucun événement");

  total = output<number>();

  private criteres = computed<CriteresProgramme>(() => ({
    recherche: this.recherche() ?? "",
    theme: this.theme() ?? "",
    type: this.type() ?? "",
    numLieu: Number(this.numLieu() ?? -1),
    idAnimateur: Number(this.idAnimateur() ?? -1),
    idPersonne: Number(this.idPersonne() ?? -1),
    idLivre: Number(this.idLivre() ?? -1),
  }));

  // undefined = chargement, null = erreur. Le programme affiché reste en place
  // pendant le rechargement (pas de clignotement quand on tape une recherche).
  protected programme = toSignal(
    toObservable(this.criteres).pipe(
      debounceTime(150),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap(criteres => this.serviceEvenement.getProgramme(criteres).pipe(
        catchError(() => of(null)),
      )),
    )
  );

  // ---------- Onglets ----------

  // "permanents" ou la clé d'un jour ("2026-11-21") ; "" = pas encore choisi
  private ongletChoisi = signal<string>("");

  // Par défaut : le jour même pendant le festival, sinon le premier jour
  protected onglet = computed<string>(() => {
    const p = this.programme();
    const choix = this.ongletChoisi();
    if (!p) return choix;
    if (choix === "permanents" || p.jours.some(j => j.cle === choix)) return choix;

    const aujourdhui = new Date().toLocaleDateString("sv-SE");   // "AAAA-MM-JJ"
    return p.jours.find(j => j.cle === aujourdhui)?.cle ?? p.jours[0]?.cle ?? "permanents";
  });

  protected nbPermanents = computed(() =>
    (this.programme()?.permanents ?? []).reduce((n, jour) => n + jour.evenements.length, 0));

  constructor() {
    addIcons({ chevronForward, locationOutline, micOutline, timeOutline });

    effect(() => {
      const p = this.programme();
      if (p) this.total.emit(p.total);
    });
  }

  protected choisirOnglet(event: CustomEvent) {
    this.ongletChoisi.set(String(event.detail.value ?? ""));
  }

  protected lien(evenement: Evenement): any[] | null {
    return this.lienPage() !== "" ? [this.lienPage(), evenement.id] : null;
  }

  protected pluriel(n: number, mot: string): string {
    return n + " " + mot + (n > 1 ? "s" : "");
  }

  protected couleurType(type: string): string {
    return this.serviceEvenement.couleurType(type);
  }
}
