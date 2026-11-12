import { Component, OnChanges, OnInit, input, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { IonList, IonItem, IonLabel, IonAccordion, IonAccordionGroup, IonButton, IonListHeader } from '@ionic/angular';
import { ListeExposantComponent } from '../liste-exposant/liste-exposant.component';
import { ListePersonnesComponent } from '../liste-personnes/liste-personnes.component';
import { ListeEvenementsComponent } from '../liste-evenements/liste-evenements.component';
import { LieuService } from '../../services/lieu.service';
import { Lieu } from '../../modeles/Lieu';

// Web component affichant la liste des lieux (stands, restaurants, salles...)
// Chaque ligne est un lien vers la page du lieu : lienPage/num
//
// Input :
//   childHtml : contenu de chaque ligne, $num, $nom, $type et $hall sont remplacés
//   lienPage  : page ouverte au clic sur une ligne (défaut /page-lieu)
//   nom       : filtre, partie du nom du lieu ("" = pas de filtre)
//   type      : filtre, type exact du lieu ("" = pas de filtre)
//   details   : true = chaque lieu est un accordéon affichant ses exposants,
//               ses auteurs et ses événements (chargés à l'ouverture)
//
// Utilisation :
// <app-liste-lieux childHtml="<strong>$nom</strong> ($type)" [nom]="nom" [type]="type" [details]="true">
// </app-liste-lieux>
@Component({
  selector: 'app-liste-lieux',
  templateUrl: './app-liste-lieux.component.html',
  styleUrls: ['./app-liste-lieux.component.scss'],
  imports: [IonList, IonItem, IonLabel, IonAccordion, IonAccordionGroup, IonButton, IonListHeader, AsyncPipe, RouterLink, ListeExposantComponent, ListePersonnesComponent, ListeEvenementsComponent],
})
export class AppListeLieuxComponent implements OnInit, OnChanges
{
  childHtml = input<string>("$num - $nom ($type)");
  lienPage = input<string>("/page-lieu");
  nom = input<string>("");
  type = input<string>("");
  details = input<boolean>(false);

  // Num du lieu dont l'accordéon est ouvert (null = aucun)
  protected lieuOuvert = signal<number | null>(null);

  protected listeLieux: Observable<Array<Lieu>> | null = null;

  constructor(private serviceLieu: LieuService) {}

  // ngOnChanges n'est pas appelé si aucun input n'est lié : on charge aussi ici
  ngOnInit() { this.actualiserListe(); }

  // Rechargement quand le parent change un filtre
  ngOnChanges() { this.actualiserListe(); }

  private actualiserListe()
  {
    this.listeLieux = this.serviceLieu.getTousLesLieux(this.nom(), this.type());
  }

  // Mémorise le lieu ouvert pour ne charger que ses listes
  onAccordeonChange(event: any)
  {
    const valeur = event.detail.value;
    this.lieuOuvert.set(valeur ? Number(valeur) : null);
  }

  itemText(lieu: Lieu): string
  {
    return this.childHtml()
      .replaceAll("$num", String(lieu.num))
      .replaceAll("$nom", lieu.nom ?? "")
      .replaceAll("$type", lieu.type ?? "")
      .replaceAll("$hall", String(lieu.hall ?? ""));
  }
}
