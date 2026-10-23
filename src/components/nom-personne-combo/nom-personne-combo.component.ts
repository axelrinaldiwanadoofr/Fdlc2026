import { Component, OnInit, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {Observable} from "rxjs" ;

import { 
  IonSelect,
  IonSelectOption
 } from '@ionic/angular';

import { PersonneService } from '../../servcies/personne.service';
import {Personne} from "../../modeles/Personne" ;


@Component({
  selector: 'app-nom-personne-combo',
  templateUrl: './nom-personne-combo.component.html',
  styleUrls: ['./nom-personne-combo.component.scss'],
  imports: [
    IonSelect,
    IonSelectOption,
    AsyncPipe,    
  ],
})
export class NomPersonneComboComponent  implements OnInit 
{

  protected listePersonnes: Observable<Array<Personne>> | null = null ;
  protected servicePersonne: PersonneService ;

  constructor( servicePersonne: PersonneService ) 
  { 
    this.servicePersonne = servicePersonne ;
  }

  ngOnInit() 
  {
    this.listePersonnes = this.servicePersonne.getToutesLesPersonnes() ;
  }
}
