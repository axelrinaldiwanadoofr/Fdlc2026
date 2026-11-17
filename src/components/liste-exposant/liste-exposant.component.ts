import { Component, OnInit, OnChanges, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {Observable} from "rxjs" ;
import { ExposantService } from '../../services/exposant.service';
import {Exposant} from "../../modeles/Exposant" ;
import { 
  IonList,
  IonItem,
 } from '@ionic/angular';

@Component({
  selector: 'app-liste-exposant',
  templateUrl: './liste-exposant.component.html',
  styleUrls: ['./liste-exposant.component.scss'],
  imports: [
    IonList,
    IonItem,
    AsyncPipe,
    RouterLink
  ],
})
export class ListeExposantComponent  implements OnInit, OnChanges 
{
  // Format de chaque ligne affiché
  childHtml = input<string>( "$id $nom stand n° $numLieu ") ;

  // Route de la page à appeler quand on clique sur une ligne de la liste
  lienPage = input<string>( "/page-exposant" ) ;

  // Critères de filtration
  nomPersonne = input<string>( "" ) ;
  nomLieu = input<string>( "" ) ;
  nomExposant = input<string>( "" ) ;

  protected listeExposants: Observable<Array<Exposant>> | null = null ;
  protected serviceExposant: ExposantService ;

  constructor( serviceExposant: ExposantService ) 
  { 
    this.serviceExposant = serviceExposant ;
  }

  ngOnInit() 
  {
    this.listeExposants = this.serviceExposant.getTousLesExposants( this.nomPersonne(), this.nomLieu(), this.nomExposant() ) ;
  }

  // Rafraichit la liste quand les parametres d'input sont modifiés 
  ngOnChanges()
  {
    this.listeExposants = this.serviceExposant.getTousLesExposants( this.nomPersonne(), this.nomLieu(), this.nomExposant() ) ;
  }

  // Met en forme le texte affiché dans chaque ligne de la liste
  itemText( exposant: Exposant) : string
  {
    let childHtml = this.childHtml() ;
    childHtml = childHtml.replace("$id", exposant.id.toString() ) ;
    childHtml = childHtml.replace("$nom", this.texte( exposant.nom ) ) ;
    childHtml = childHtml.replace("$type", exposant.type ) ;
    childHtml = childHtml.replace("$nomLieu", this.texte( exposant.nomLieu ) ) ;
    childHtml = childHtml.replace("$numLieu", exposant.numLieu.toString() ) ;
    childHtml = childHtml.replace("$stand", this.texte( this.stand( exposant ) ) ) ;
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
    let stand = exposant.numLieu.toString() ;
    if( exposant.nomLieu && exposant.nomLieu != stand ) stand += " | " + exposant.nomLieu ;
    return stand ;
  }

}
