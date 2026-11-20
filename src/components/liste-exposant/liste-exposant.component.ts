import { Component, OnInit, OnChanges, computed, effect, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExposantService } from '../../services/exposant.service';
import {Exposant} from "../../modeles/Exposant" ;
import { correspond } from '../../outils/recherche';
import { 
  IonList,
  IonItem,
  IonLabel,
 } from '@ionic/angular';

@Component({
  selector: 'app-liste-exposant',
  templateUrl: './liste-exposant.component.html',
  styleUrls: ['./liste-exposant.component.scss'],
  imports: [
    IonList,
    IonItem,
    IonLabel,
    RouterLink
  ],
})
export class ListeExposantComponent  implements OnInit, OnChanges 
{
  // Format de chaque ligne affiché
  childHtml = input<string>( "$id $nom stand n° $numLieu ") ;

  // Route de la page à appeler quand on clique sur une ligne de la liste
  lienPage = input<string>( "/page-exposant" ) ;

  // Critères de filtration envoyés au serveur
  nomPersonne = input<string>( "" ) ;
  nomLieu = input<string>( "" ) ;

  // Filtres appliqués sur la liste déjà chargée (page Liste des exposants)
  recherche = input<string>( "" ) ;
  type = input<string>( "" ) ;
  espace = input<string>( "" ) ;
  messageVide = input<string>( "" ) ;

  // Nombre d'exposants affichés, et liste complète une fois chargée
  total = output<number>() ;
  charge = output<Exposant[]>() ;

  protected serviceExposant: ExposantService ;
  protected exposants = signal<Exposant[] | null>( null ) ;
  private criteres: string | null = null ;

  protected exposantsFiltres = computed( () => ( this.exposants() ?? [] ).filter( exposant =>
    ( this.type() == "" || this.serviceExposant.nomType( exposant.type ) == this.type() ) &&
    ( this.espace() == "" || exposant.nomLieu == this.espace() ) &&
    correspond( exposant.nom + " " + exposant.numLieu + " " + exposant.nomLieu, this.recherche() ) ) ) ;

  constructor( serviceExposant: ExposantService ) 
  { 
    this.serviceExposant = serviceExposant ;
    effect( () =>
    {
      if( this.exposants() ) this.total.emit( this.exposantsFiltres().length ) ;
    }) ;
  }

  ngOnInit() 
  {
    this.chargeListe() ;
  }

  // Rafraichit la liste quand les parametres d'input sont modifiés 
  ngOnChanges()
  {
    this.chargeListe() ;
  }

  // Ne redemande la liste au serveur que si ses critères ont changé
  chargeListe()
  {
    let criteres = this.nomPersonne() + "|" + this.nomLieu() ;
    if( criteres == this.criteres ) return ;
    this.criteres = criteres ;

    this.serviceExposant.getTousLesExposants( this.nomPersonne(), this.nomLieu() ).subscribe( exposants =>
    {
      this.exposants.set( exposants ) ;
      this.charge.emit( exposants ) ;
    }) ;
  }

  // Met en forme le texte affiché dans chaque ligne de la liste
  itemText( exposant: Exposant) : string
  {
    let childHtml = this.childHtml() ;
    childHtml = childHtml.replaceAll("$id", exposant.id.toString() ) ;
    childHtml = childHtml.replaceAll("$nomLieu", this.texte( exposant.nomLieu ) ) ;
    childHtml = childHtml.replaceAll("$nom", this.texte( exposant.nom ) ) ;
    childHtml = childHtml.replaceAll("$type", this.texte( exposant.type ) ) ;
    childHtml = childHtml.replaceAll("$numLieu", String( exposant.numLieu ?? "" ) ) ;
    childHtml = childHtml.replaceAll("$stand", this.texte( this.stand( exposant ) ) ) ;
    return childHtml ;
  }

  // Les noms viennent de la base : on les affiche comme du texte, pas comme du html
  texte( valeur: string ) : string
  {
    return ( valeur ?? "" ).replace( /&/g, "&amp;" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" ) ;
  }

  // Numéro du stand suivi de son nom quand il en a un (ex : 328 | ADEB)
  stand( exposant: Exposant ) : string
  {
    let stand = String( exposant.numLieu ?? "" ) ;
    if( exposant.nomLieu && exposant.nomLieu != stand ) stand += " | " + exposant.nomLieu ;
    return stand ;
  }

}
