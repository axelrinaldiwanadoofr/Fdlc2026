import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonSearchbar } from '@ionic/angular';
import { AppListeLieuxComponent } from '../../components/app-liste-lieux/app-liste-lieux.component';

@Component({
  selector: 'app-page-liste-lieux',
  templateUrl: './page-liste-lieux.page.html',
  styleUrls: ['./page-liste-lieux.page.scss'],
  imports: [FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonSearchbar, AppListeLieuxComponent],
})
export class PageListeLieuxPage
{
  public recherche = "";
}
