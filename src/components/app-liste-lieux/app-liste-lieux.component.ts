import { Component, OnChanges, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { IonList, IonItem, IonLabel } from '@ionic/angular';
import { LieuService } from '../../services/lieu.service';
import { Lieu } from '../../modeles/Lieu';

@Component({
  selector: 'app-liste-lieux',
  templateUrl: './app-liste-lieux.component.html',
  styleUrls: ['./app-liste-lieux.component.scss'],
  imports: [IonList, IonItem, IonLabel, AsyncPipe, RouterLink],
})
export class AppListeLieuxComponent implements OnChanges
{
  recherche = input<string>("");

  protected listeLieux: Observable<Array<Lieu>> | null = null;

  constructor(private serviceLieu: LieuService) {}

  ngOnChanges()
  {
    this.listeLieux = this.serviceLieu.getTousLesLieux(this.recherche());
  }
}
