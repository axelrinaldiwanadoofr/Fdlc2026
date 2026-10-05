import { Component } from '@angular/core';
import { 
  IonApp, 
  IonMenu,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
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
    IonRouterOutlet
  ],
})
export class AppComponent 
{
  constructor() {}
}
