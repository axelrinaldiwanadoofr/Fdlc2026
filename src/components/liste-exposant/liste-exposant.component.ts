import { Component, OnInit, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {Observable} from "rxjs" ;
import { ExposantService } from '../../servcies/exopsant.service';
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
export class ListeExposantComponent  implements OnInit 
{
  childHtml = input<string>( "$id $nom stand n° $numStand ") ;
  lienPage = input<string>( "/app-page-exposant" ) ;

  protected listeExposants: Observable<Array<Exposant>> | null = null ;
  protected serviceExposant: ExposantService ;

  constructor( serviceExposant: ExposantService ) 
  { 
    this.serviceExposant = serviceExposant ;
  }

  ngOnInit() 
  {
    this.listeExposants = this.serviceExposant.getTousLesExposants() ;
  }

  itemText( exposant: Exposant) : string
  {
    let childHtml = this.childHtml() ;
    childHtml = childHtml.replace("$id", exposant.id.toString() ) ;
    childHtml = childHtml.replace("$nom", exposant.nom ) ;
    childHtml = childHtml.replace("$numStand", exposant.numStand.toString() ) ;
    return childHtml ;
  }

}
