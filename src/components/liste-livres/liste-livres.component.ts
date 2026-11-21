import { Component, OnInit, OnChanges, computed, effect, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LivreService } from '../../services/livre.service';
import { Livre } from '../../modeles/Livre';
import { correspond } from '../../outils/recherche';
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
    RouterLink
  ],
})
export class ListeLivresComponent implements OnInit, OnChanges 
{
  // Format de chaque ligne affichée
  childHtml = input<string>( "<strong>$titre</strong>: - $prenom $nom, Éd. $editeur" ) ;

  // Route de la page à appeler quand on clique sur une ligne de la liste
  lienPage = input<string>( "/page-livre" ) ;

  // Critères de filtration envoyés au serveur
  idLivre = input<number>( -1 ) ;
  titreLivre = input<string>( "" ) ;
  nomAuteur = input<string>( "" ) ;
  genre = input<string>( "" ) ;
  nomExposant = input<string>( "" ) ;
  titreEvenement = input<string>( "" ) ;

  // Filtres appliqués sur la liste déjà chargée (page Liste des livres)
  recherche = input<string>( "" ) ;
  auteur = input<string>( "" ) ;
  editeur = input<string>( "" ) ;
  messageVide = input<string>( "" ) ;

  // Nombre de livres affichés, et liste complète une fois chargée
  total = output<number>() ;
  charge = output<Livre[]>() ;

  protected serviceLivre: LivreService ;
  protected livres = signal<Livre[] | null>( null ) ;
  private criteres: string | null = null ;

  protected livresFiltres = computed( () => ( this.livres() ?? [] ).filter( livre =>
    ( this.auteur() == "" || this.nomAuteurLivre( livre ) == this.auteur() ) &&
    ( this.editeur() == "" || ( livre.editeur ?? "" ).trim() == this.editeur() ) &&
    correspond( livre.titre + " " + this.nomAuteurLivre( livre ) + " " + ( livre.editeur ?? "" ), this.recherche() ) ) ) ;

  constructor( serviceLivre: LivreService ) 
  { 
    this.serviceLivre = serviceLivre ;
    effect( () =>
    {
      if( this.livres() ) this.total.emit( this.livresFiltres().length ) ;
    }) ;
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

  // Ne redemande la liste au serveur que si ses critères ont changé
  rafraichirListe() 
  {
    let criteres = [this.titreLivre(), this.nomAuteur(), this.genre(), this.nomExposant(), this.titreEvenement()].join( "|" ) ;
    if( criteres == this.criteres ) return ;
    this.criteres = criteres ;

    this.serviceLivre.getTousLesLivres( this.titreLivre(), this.nomAuteur(), this.genre(), this.nomExposant(), this.titreEvenement() )
      .subscribe( livres =>
      {
        this.livres.set( livres ) ;
        this.charge.emit( livres ) ;
      }) ;
  }

  // "Prénom Nom" de l'auteur du livre
  nomAuteurLivre( livre: Livre ): string
  {
    return ( ( livre.prenom ?? "" ).trim() + " " + ( livre.nom ?? "" ).trim() ).trim() ;
  }

  // Met en forme le texte affiché dans chaque ligne de la liste
  itemText( livre: Livre ): string 
  {
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
