import { Component, OnInit, contentChild, effect, signal } from '@angular/core';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {Observable} from "rxjs" ;
import { ExposantService } from '../../servcies/exopsant.service';
import {Exposant} from "../../modeles/Exposant" ;
import {ExposantCardComponent} from "../exposant-card/exposant-card.component" ;
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
    NgTemplateOutlet
  ],
})
export class ListeExposantComponent  implements OnInit 
{

  protected listeExposants: Observable<Array<Exposant>> | null = null ;
  protected serviceExposant: ExposantService ;
  protected childComponent = contentChild( ExposantCardComponent) ;

  constructor( serviceExposant: ExposantService ) 
  { 
    this.serviceExposant = serviceExposant ;
  }

  ngOnInit() 
  {
    this.listeExposants = this.serviceExposant.getTousLesExposants() ;
  }

}
