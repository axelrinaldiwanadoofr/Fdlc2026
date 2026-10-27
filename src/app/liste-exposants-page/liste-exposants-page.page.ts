
import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton} from '@ionic/angular';

import { ListeExposantComponent } from '../../components/liste-exposant/liste-exposant.component';

@Component({
  selector: 'app-liste-exposants-page',
  templateUrl: './liste-exposants-page.page.html',
  styleUrls: ['./liste-exposants-page.page.scss'],
  imports: [IonContent,IonHeader,IonTitle,IonToolbar,IonButtons,IonMenuButton,IonBackButton, ListeExposantComponent]
})
export class ListeExposantsPagePage {

}
