import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { 
  IonApp, 
  IonMenu,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonMenuToggle,
  IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp, 
    IonMenu,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonContent,
    IonList,
    IonItem,
    IonMenuToggle,
    IonRouterOutlet,
    RouterLink
  ],
})
export class AppComponent 
{
  constructor() {}

  goToPage( page: string )
  {
    alert( page ) ;
  }
}
