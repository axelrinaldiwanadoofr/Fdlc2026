import { Component, OnInit, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Livre } from '../../modeles/Livre';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular';

@Component({
  selector: 'app-page-livre',
  templateUrl: './page-livre.page.html',
  styleUrls: ['./page-livre.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    AsyncPipe
  ]
})
export class PageLivrePage implements OnInit
{
  // Reçu depuis la route page-livre/:id
  public id = input<number>( -1 );

  protected livres: Observable<Array<Livre>> | null = null;

  constructor( private http: HttpClient ) {}

  ngOnInit()
  {
    // livre-by-id.php renvoie un tableau (0 ou 1 livre)
    this.livres = this.http.get<Array<Livre>>( 'php/livre/livre-by-id.php?id=' + this.id() );
  }
}