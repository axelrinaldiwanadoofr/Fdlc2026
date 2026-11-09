import { Component, OnChanges, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { LieuService } from '../../service/lieu.service';
import { Lieu } from '../../modeles/Lieu';
import {
  IonList,
  IonItem,
} from '@ionic/angular';

@Component({
  selector: 'app-liste-lieux',
  templateUrl: './app-liste-lieux.component.html',
  styleUrls: ['./app-liste-lieux.component.scss'],
  imports: [
    IonList,
    IonItem,
    AsyncPipe,
    RouterLink
  ],
})
export class AppListeLieuxComponent implements OnChanges
{                                        
  childHtml = input<string>("$num - $nom ($type)");

  lienPage = input<string>("/page-lieu");

  nom = input<string>("");
  type = input<string>("");

  protected listeLieux: Observable<Array<Lieu>> | null = null;
  protected serviceLieu: LieuService;

  constructor(serviceLieu: LieuService)
  {
    this.serviceLieu = serviceLieu;
  }

  ngOnChanges()
  {
    this.listeLieux = this.serviceLieu.getTousLesLieux(this.nom(), this.type());
  }

  itemText(lieu: Lieu): string
  {
    let childHtml = this.childHtml();
    childHtml = childHtml.replace("$num", lieu.num.toString());
    childHtml = childHtml.replace("$nom", lieu.nom);
    childHtml = childHtml.replace("$type", lieu.type);
    return childHtml;
  }
}