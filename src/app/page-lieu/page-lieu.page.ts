import { Component, OnInit, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import {  
  IonContent,  
  IonHeader,  
  IonTitle,  
  IonToolbar,  
  IonButtons,  
  IonMenuButton,  
  IonBackButton,  
  IonCard,  
  IonCardHeader,  
  IonCardTitle,  
  IonCardContent,  
  IonButton,
} from '@ionic/angular';
import { Lieu } from '../../modeles/Lieu';
import { LieuService } from '../../services/lieu.service' ;
import { ListeExposantComponent } from '../../components/liste-exposant/liste-exposant.component';

@Component({  
  selector: 'app-page-lieu',  
  templateUrl: './page-lieu.page.html',  
  styleUrls: ['./page-lieu.page.scss'],  
  imports: [    
    IonContent, IonHeader, IonTitle, IonToolbar,    
    IonButtons, IonMenuButton, IonBackButton,    
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,    
    AsyncPipe, ListeExposantComponent  ],
})
export class PageLieuPage implements OnInit
{  
  public num = input<number>( -1 ) ;  
  protected serviceLieu: LieuService ;  
  protected lieux: Observable<Lieu[]> | null = null ;  

  constructor( serviceLieu: LieuService )  
  {    
    this.serviceLieu = serviceLieu ;  
  }  

  ngOnInit()  
  {    
    this.lieux = this.serviceLieu.getLieuByNum( this.num() ) ;  
  }
}