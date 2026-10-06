import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Observable} from "rxjs" ;
import { ExposantService } from '../../servcies/exopsant.service';
import {Exposant} from "../../modeles/Exposant" ;
import {ListeExposantComponent} from "../../components/liste-exposant/liste-exposant.component" ;
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonBackButton
 } from '@ionic/angular';

@Component({
  selector: 'app-liste-exposants-page',
  templateUrl: './liste-exposants-page.page.html',
  styleUrls: ['./liste-exposants-page.page.scss'],
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons,
    IonMenuButton,
    IonBackButton,
    ListeExposantComponent,
    CommonModule, 
    FormsModule]
})
export class ListeExposantsPagePage implements OnInit 
{
  //protected listeExposants: Observable<Array<Exposant>> | null = null ;
  //protected serviceExposant: ExposantService ;


  constructor() 
  { 
    //this.serviceExposant = serviceExposant ;
  }

  ngOnInit() 
  {
    //this.listeExposants = this.serviceExposant.getTousLesExposants() ;
  }

}
