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
  ],
})
export class ExposantCardComponent  implements OnInit 
{
  public exposant = input<Exposant>( {} as Exposant ) ;

  //public exposant: Observable<Exposant> | null = null ;
  protected serviceExposant: ExposantService ;


  constructor( serviceExposant: ExposantService ) 
  { 
    this.serviceExposant = serviceExposant ;
  }

  ngOnInit()
  {
    /*
    if( this.id != -1 && this.serviceExposant )
    {
      this.exposant = this.serviceExposant.getExposantParId( this.id ) ;
    }*/
  }
}
