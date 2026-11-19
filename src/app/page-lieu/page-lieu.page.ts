import { Component, OnInit, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';
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
  IonIcon,
} from '@ionic/angular';
import { Lieu } from '../../modeles/Lieu';
import { LieuService } from '../../services/lieu.service';
import { ListeExposantComponent } from '../../components/liste-exposant/liste-exposant.component';
import { AjouterEtapeButtonComponent } from '../../components/ajouter-etape-button/ajouter-etape-button.component';

@Component({
  selector: 'app-page-lieu',
  templateUrl: './page-lieu.page.html',
  styleUrls: ['./page-lieu.page.scss'],
  imports: [
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
    IonIcon,
    RouterLink,
    AsyncPipe,
    ListeExposantComponent,
    AjouterEtapeButtonComponent,
  ],
})
export class PageLieuPage implements OnInit
{
  public num = input<number>( -1 );
  protected serviceLieu: LieuService;
  protected lieux: Observable<Lieu[]> | null = null;

  constructor( serviceLieu: LieuService )
  {
    this.serviceLieu = serviceLieu;
    addIcons( { locationOutline } );
  }

  ngOnInit()
  {
    this.lieux = this.serviceLieu.getLieuByNum( this.num() );
  }
}