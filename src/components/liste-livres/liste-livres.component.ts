import { Component, OnInit, OnChanges, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { LivreService } from '../../services/livre.service';
import { Livre } from '../../modeles/Livre';
import { 
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular';

@Component({
  selector: 'app-liste-livres',
  templateUrl: './liste-livres.component.html',
  styleUrls: ['./liste-livres.component.scss'],
  imports: [
    IonList,
    IonItem,
    IonLabel,
    AsyncPipe,
    RouterLink
  ],
})
export class ListeLivresComponent implements OnInit, OnChanges 
{
  // Format de chaque ligne affichée
  childHtml = input<string>( "<strong>$titre</strong>: - $prenom $nom, Éd. $editeur" ) ;

  // Route de la page à appeler quand on clique sur une ligne de la liste
  lienPage = input<string>( "/page-livre" ) ;

  // Critères de filtration
  idLivre = input<number>( -1 ) ;
  titreLivre = input<string>( "" ) ;
  nomAuteur = input<string>( "" ) ;
  genre = input<string>( "" ) ;
  nomExposant = input<string>( "" ) ;
  titreEvenement = input<string>( "" ) ;

  protected listeLivres: Observable<Array<Livre>> | null = null ;
  protected serviceLivre: LivreService ;

  constructor( serviceLivre: LivreService ) 
  { 
    this.serviceLivre = serviceLivre ;
  }

  ngOnInit() 
  {
    this.rafraichirListe() ;
  }

  // Rafraîchit la liste quand les paramètres d'input sont modifiés 
  ngOnChanges() 
  {
    this.rafraichirListe() ;
  }

  rafraichirListe() 
  {
    this.listeLivres = this.serviceLivre.getTousLesLivres(
      this.titreLivre(),
      this.nomAuteur(),
      this.genre(),
      this.nomExposant(),
      this.titreEvenement()
    ) ;
  }

  // Met en forme le texte affiché dans chaque ligne de la liste
  itemText( livre: Livre ): string 
  {
    // $nomExposant avant $nom, sinon $nom remplace le début de $nomExposant
    let childHtml = this.childHtml() ;
    childHtml = childHtml.replaceAll( "$id", livre.id ? livre.id.toString() : "" ) ;
    childHtml = childHtml.replaceAll( "$titre", this.texte( livre.titre?.trim() || "Sans titre" ) ) ;
    childHtml = childHtml.replaceAll( "$editeur", this.texte( livre.editeur ) ) ;
    childHtml = childHtml.replaceAll( "$genre", this.texte( livre.genre ) ) ;
    childHtml = childHtml.replaceAll( "$nomExposant", this.texte( livre.nomExposant ) ) ;
    childHtml = childHtml.replaceAll( "$nom", this.texte( livre.nom ) ) ;
    childHtml = childHtml.replaceAll( "$prenom", this.texte( livre.prenom ) ) ;
    childHtml = childHtml.replaceAll( "$resume", this.texte( livre.resume ) ) ;
    return childHtml ;
  }

  // Les textes viennent de la base : affichés comme du texte, pas comme du html
  texte( valeur: string ): string
  {
    return ( valeur ?? "" ).trim().replace( /&/g, "&amp;" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" ) ;
  }
}
