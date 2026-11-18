import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { AppListeLieuxComponent } from '../../components/app-liste-lieux/app-liste-lieux.component';

@Component({
  selector: 'app-page-liste-lieux',
  templateUrl: './page-liste-lieux.page.html',
  styleUrls: ['./page-liste-lieux.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, AppListeLieuxComponent],
})
export class PageListeLieuxPage {}
