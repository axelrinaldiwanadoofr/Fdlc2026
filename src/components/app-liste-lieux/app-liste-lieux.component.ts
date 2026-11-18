import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { IonList, IonItem, IonLabel } from '@ionic/angular';
import { LieuService } from '../../services/lieu.service';
import { Lieu } from '../../modeles/Lieu';

@Component({
  selector: 'app-liste-lieux',
  templateUrl: './app-liste-lieux.component.html',
  styleUrls: ['./app-liste-lieux.component.scss'],
  imports: [IonList, IonItem, IonLabel, AsyncPipe],
})
export class AppListeLieuxComponent implements OnInit
{
  protected listeLieux: Observable<Array<Lieu>> | null = null;

  constructor(private serviceLieu: LieuService) {}

  ngOnInit()
  {
    this.listeLieux = this.serviceLieu.getTousLesLieux();
  }
}
