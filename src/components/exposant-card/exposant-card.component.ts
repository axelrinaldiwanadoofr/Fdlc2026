import { Component, OnInit, Input } from '@angular/core';
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
  templateUrl: './exposant-card.component.html',
  styleUrls: ['./exposant-card.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
  ],
})
export class ExposantCardComponent  implements OnInit 
{
  @Input() id: number = -1 ;
  public exposant: Observable<Exposant> | null = null ;
  protected serviceExposant: ExposantService ;


  constructor( serviceExposant: ExposantService ) 
  { 
    this.serviceExposant = serviceExposant ;
  }

  ngOnInit()
  {
    if( this.id != -1 && this.serviceExposant )
    {
      this.exposant = this.serviceExposant.getExposantParId( this.id ) ;
    }
  }
}
