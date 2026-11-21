import { Component, OnChanges, OnInit, computed, effect, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonList, IonItem, IonLabel } from '@ionic/angular';
import { PersonneService } from '../../services/personne.service';
import { Personne } from '../../modeles/Personne';
import { MajusculePipe } from '../../pipes/majuscule.pipe';
import { correspond, simplifie } from '../../outils/recherche';

@Component({
  selector: 'app-liste-personnes',
  templateUrl: './liste-personnes.component.html',
  styleUrls: ['./liste-personnes.component.scss'],
  imports: [IonList, IonItem, IonLabel, RouterLink],
})
export class ListePersonnesComponent implements OnInit, OnChanges {
  childHtml = input<string>("$civilite <strong>$prenom $nom</strong> | $specialite");
  lienPage = input<string>("/page-personne");
  nom = input<string>("");
  // Personnes présentes chez un exposant du lieu (-1 = pas de filtre)
  numLieu = input<number>(-1);
  // Filtres appliqués sur la liste déjà chargée (page Liste des personnes)
  recherche = input<string>("");
  specialite = input<string>("");
  messageVide = input<string>("");
  total = output<number>();
  charge = output<Personne[]>();

  protected personnes = signal<Personne[] | null>(null);
  protected personnesFiltrees = computed(() => (this.personnes() ?? []).filter(personne =>
    (this.specialite() == "" || simplifie(personne.specialite) == simplifie(this.specialite())) &&
    correspond(personne.prenom + " " + personne.nom, this.recherche())));
  private criteres: string | null = null;

  protected servicePersonne: PersonneService;

  constructor(servicePersonne: PersonneService) {
    this.servicePersonne = servicePersonne;
    effect(() => {
      if (this.personnes()) this.total.emit(this.personnesFiltrees().length);
    });
  }

  ngOnInit() { this.actualiserListe(); }
  ngOnChanges() { this.actualiserListe(); }

  // Redemande la liste au serveur seulement si ses critères ont changé
  private actualiserListe() {
    const criteres = this.nom() + "|" + this.numLieu();
    if (criteres == this.criteres) return;
    this.criteres = criteres;

    const liste = (this.numLieu() != -1)
      ? this.servicePersonne.getToutesLesPersonnesK(-1, "", -1, this.nom(), "", "", "", this.numLieu())
      : this.servicePersonne.getToutesLesPersonnes(this.nom());
    liste.subscribe(personnes => {
      this.personnes.set(personnes);
      this.charge.emit(personnes);
    });
  }

  itemText(personne: Personne): string {
    return this.childHtml()
      .replaceAll("$id", String(personne.id))
      .replaceAll("$civilite", this.texte(personne.civilite))
      .replaceAll("$prenom", this.texte(personne.prenom))
      .replaceAll("$nom", this.texte(personne.nom))
      .replaceAll("$specialite", this.texte(this.majuscule.transform((personne as any).specialite)));
  }

  // Les textes viennent de la base : affichés comme du texte, pas comme du html
  private majuscule = new MajusculePipe();

  texte(valeur: string): string {
    return (valeur ?? "").trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}
