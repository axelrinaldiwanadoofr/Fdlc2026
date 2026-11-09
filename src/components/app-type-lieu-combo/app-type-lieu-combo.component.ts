import { Component, OnInit, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {Observable, map} from "rxjs" ;
import { FormsModule } from '@angular/forms';

import { 
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
 } from '@ionic/angular';

import {LieuService } from '../../servcies/lieu.service';

// Web component de combo box affichant les valeurs distinctes du champ type
// de la table typelieu (restaurant, stand, théatre, toilettes...)
// Si l'utilisateur tape "st", la liste affiche les types qui commencent par "st".
//
// Input :
//   label     : libellé du champ de saisie
//   childHtml : contenu de chaque ligne de la liste, $type est remplacé par le type
//   type      : valeur initiale du type (partie du type pour la filtration)
// Output :
//   onTypeLieuSelected : envoie le type saisi ou choisi au web component parent
//
// Utilisation :
// <app-type-lieu-combo childHtml="Type : <b>$type</b>" (onTypeLieuSelected)="maMethode($event)">
// </app-type-lieu-combo>
@Component({
  selector: 'app-type-lieu-combo',
  templateUrl: './app-type-lieu-combo.component.html',
  styleUrls: ['./app-type-lieu-combo.component.scss'],
  imports: [
    IonInput,
    IonList,
    IonItem,
    IonCard,
    IonCardContent,
    AsyncPipe,    
    FormsModule
  ],
})
export class TypeLieuComboComponent  implements OnInit 
{

  protected listeTypes: Observable<Array<string>> | null = null ;
  protected serviceLieu: LieuService ;

  // Texte tapé dans le champ de saisie
  protected saisie: string = "" ;

  // Gestion de l'affichage de la liste, utilise un signal pour provoquer
  // l'actualisation de l'affichage quand la valeur de l'attribut est modifée
  protected showList = signal(false) ;

  // Comunication avec le web component parent
  public    label = input("Type de lieu") ;
  public    childHtml = input("$type") ;
  public    type = input("") ;
  public    onTypeLieuSelected = output<string>() ;

  constructor( serviceLieu: LieuService ) 
  { 
    this.serviceLieu = serviceLieu ;
  }

  ngOnInit() 
  {
    // Le champ démarre avec le type reçu en input
    this.saisie = this.type() ;
    this.listeTypes = this.getTypes( this.saisie ) ;
  }

  // Récupère la liste des types de lieu (table typelieu) via le service.
  // debut : début du type tapé par l'utilisateur ("" = tous les types)
  // Le PHP renvoie [{type:"restaurant"}, ...] : map() le transforme en ["restaurant", ...]
  getTypes( debut: string ): Observable<Array<string>>
  {
    return this.serviceLieu.getTousLesTypesLieu( debut ).pipe(
      map( (lignes: {type: string}[]) => lignes.map( ligne => ligne.type ) )
    ) ;
  }

  // Exécuté quand l'utilisateur modifie le type dans l'ion-input
  onTypeChanged( event: any )
  {
    // Rafraichie la liste des types à chaque frappe de touche
    this.listeTypes = this.getTypes( this.saisie.trim() ) ;
    this.showList.set( true ) ;

    // Déclenche l'événement onTypeLieuSelected dans le web component parent
    this.onTypeLieuSelected.emit( this.saisie.trim() ) ;
  }

  // Exécuté quand l'itulisateur clique sur une ligne de la liste
  onClickTypeSelected( type: string )
  {
    this.showList.set( false ) ;
    this.saisie = type ;

    // Déclenche l'événement onTypeLieuSelected dans le web component parent
    this.onTypeLieuSelected.emit( this.saisie ) ;
  }

  // Exécuté quand l'utilisateur clique sur l'ion-input
  onInputClick( event: MouseEvent )
  {
    // Switch le mode d'affichage de la liste
    this.showList.set( !this.showList() ) ;
  }

  // Construit le contenu d'une ligne de la liste à partir de childHtml
  itemText( type: string ): string
  {
    return this.childHtml().replace( "$type", type ) ;
  }

  // Masque la liste
  masqueListe()
  {
    this.showList.set( false ) ;
  }
}
