import { Component, OnInit, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

import {
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
} from '@ionic/angular';

import { EvenementService } from '../../services/evenement.service';

@Component({
  selector: 'app-titre-evenement-combo',
  templateUrl: './titre-evenement-combo.component.html',
  styleUrls: ['./titre-evenement-combo.component.scss'],
  imports: [
    IonInput,
    IonList,
    IonItem,
    IonCard,
    IonCardContent,
    AsyncPipe,
    FormsModule
  ],
})
export class TitreEvenementComboComponent implements OnInit {
  protected listeTitres: Observable<Array<string>> | null = null;
  protected serviceEvenement: EvenementService;

  protected titre: string = '';
  protected showList = signal(false);

  public label = input('Événement');
  public onEvenementSelected = output<string>();

  constructor(serviceEvenement: EvenementService) {
    this.serviceEvenement = serviceEvenement;
  }

  ngOnInit() {
    this.listeTitres = this.serviceEvenement.getTitresEvenements(this.titre);
  }

  onTitreChanged(event: any) {
    this.listeTitres = this.serviceEvenement.getTitresEvenements(this.titre);
    this.showList.set(true);
    this.onEvenementSelected.emit(this.titre);
  }

  onClickTitreSelected(titre: string) {
    this.showList.set(false);
    this.titre = titre;
    this.onEvenementSelected.emit(this.titre);
  }

  onInputClick(event: MouseEvent) {
    this.showList.set(!this.showList());
  }

  masqueListe() {
    this.showList.set(false);
  }

  reset() {
    this.titre = '';
    this.showList.set(false);
  }
}
