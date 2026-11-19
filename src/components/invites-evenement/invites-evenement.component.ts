import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonItem, IonList } from '@ionic/angular';
import { Personne } from '../../modeles/Personne';

/** Affiche les personnes liees par la table invite, distinctes des auteurs. */
@Component({
  selector: 'app-invites-evenement',
  standalone: true,
  imports: [IonList, IonItem, RouterLink],
  template: `
    <section class="invites-evenement" aria-label="Invites de l'evenement">
      <h2>Invités</h2>
      @if (chargement()) {
        <p class="indication">Chargement des invités…</p>
      } @else if (erreur()) {
        <p class="indication">Invités indisponibles actuellement.</p>
      } @else if (personnes().length > 0) {
        <ion-list class="liste-invites">
          @for (personne of personnes(); track personne.id) {
            <ion-item [routerLink]="['/page-personne', personne.id]" detail="true">
              <div class="invite-ligne">
                <strong>{{ personne.prenom }} {{ personne.nom }}</strong>
                @if (personne.specialite) {
                  <span>{{ personne.specialite }}</span>
                }
              </div>
            </ion-item>
          }
        </ion-list>
      } @else {
        <p class="indication">Aucun invité renseigné pour cet événement.</p>
      }
    </section>
  `,
  styles: [`
    :host { display: block; padding: 0 20px 28px; }
    .invites-evenement {
      max-width: 1060px; margin: 8px auto 24px;
      padding: 20px 22px; border-radius: 18px;
      background: var(--ion-card-background, var(--ion-background-color, #fff));
      color: var(--ion-text-color, #1d2924);
      box-shadow: 0 3px 14px rgba(0, 0, 0, 0.06);
    }
    h2 { font-size: 1.35rem; font-weight: 700; margin: 0 0 12px; }
    .indication { font-size: .95rem; opacity: .75; margin: 0; }
    .liste-invites { background: transparent; padding: 0; }
    .invite-ligne { display: flex; flex-direction: column; gap: 3px; padding: 12px 0; }
    .invite-ligne span { font-size: .88rem; opacity: .75; }
  `],
})
export class InvitesEvenementComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  readonly personnes = signal<Personne[]>([]);
  readonly chargement = signal(true);
  readonly erreur = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.personnes.set([]);
      this.erreur.set(false);
      if (!Number.isInteger(id) || id < 1) {
        this.chargement.set(false);
        return;
      }
      this.chargement.set(true);
      this.http.get<Personne[]>(`php/evenement/invites-evenement.php?id=${id}`).subscribe({
        next: liste => {
          this.personnes.set(Array.isArray(liste) ? liste : []);
          this.chargement.set(false);
        },
        error: () => {
          this.erreur.set(true);
          this.chargement.set(false);
        }
      });
    });
  }
}
