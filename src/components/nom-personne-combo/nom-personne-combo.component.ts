import { Component, OnInit, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {Observable} from "rxjs" ;
import { FormsModule } from '@angular/forms';

import { 
  IonSelect,
  IonSelectOption,
  IonInput,
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
    IonInput,
    AsyncPipe,    
    FormsModule
  ],
})
export class NomPersonneComboComponent  implements OnInit 
{

  protected listePersonnes: Observable<Array<Personne>> | null = null ;
  protected servicePersonne: PersonneService ;
  protected nom: string = "" ;

  constructor( servicePersonne: PersonneService ) 
  { 
    this.servicePersonne = servicePersonne ;
  }

  ngOnInit() 
  {
    this.listePersonnes = this.servicePersonne.getToutesLesPersonnes() ;
  }

  nomChanged( event: any )
  {
    this.listePersonnes = this.servicePersonne.getToutesLesPersonnes( this.nom ) ;
  }
}
