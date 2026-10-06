import { Component, OnInit, input, InputSignal, numberAttribute } from '@angular/core';
import {Exposant} from "../../modeles/Exposant" ;
import { ExposantService } from '../../servcies/exopsant.service';
import { 
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
 } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-exposant-card',
  standalone: true,
  templateUrl: './exposant-card.component.html',
  styleUrls: ['./exposant-card.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    AsyncPipe
  ],
})
export class ExposantCardComponent  implements OnInit 
{
  public id = input( -1, {transform: numberAttribute } ) ;

  public exposants: Observable<Exposant[]> = new Observable<Exposant[]>() ;
  protected serviceExposant: ExposantService ;


  constructor( serviceExposant: ExposantService ) 
  { 
    this.serviceExposant = serviceExposant ;
  }

  ngOnInit()
  {
    if( this.id() != -1 && this.serviceExposant )
    {
      this.exposants = this.serviceExposant.getExposantParId( this.id() ) ;
      this.exposants = this.serviceExposant.getExposantParId( this.id() ) ;
    }
  }
}
