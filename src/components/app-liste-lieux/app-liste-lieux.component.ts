import { Component, OnInit, OnChanges, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, map } from 'rxjs';
import { IonList, IonItem, IonLabel, IonItemDivider, IonItemGroup } from '@ionic/angular';
import { LieuService } from '../../services/lieu.service';
import { Lieu } from '../../modeles/Lieu';

// Un groupe de lieux de même type (stand, théatre...)
interface GroupeLieux
{
  type: string ;
  lieux: Lieu[] ;
}

// Web component affichant la liste des lieux regroupés par type,
// chaque lieu affiche son numéro puis son nom
@Component({
  selector: 'app-liste-lieux',
  templateUrl: './app-liste-lieux.component.html',
  styleUrls: ['./app-liste-lieux.component.scss'],
  imports: [IonList, IonItem, IonLabel, IonItemDivider, IonItemGroup, AsyncPipe, RouterLink],
})
export class AppListeLieuxComponent implements OnInit, OnChanges
{
  // Route de la page à appeler quand on clique sur une ligne de la liste
  lienPage = input<string>( "/page-lieu" ) ;

  // Critères de filtration : nom = partie du nom ou début du numéro du lieu
  nom = input<string>( "" ) ;
  type = input<string>( "" ) ;
  nomExposant = input<string>( "" ) ;
  nomPersonne = input<string>( "" ) ;
  titreEvenement = input<string>( "" ) ;

  protected groupesLieux: Observable<Array<GroupeLieux>> | null = null;

  constructor(private serviceLieu: LieuService) {}

  ngOnInit()
  {
    this.chargeLieux() ;
  }

  // Rafraichit la liste quand les parametres d'input sont modifiés
  ngOnChanges()
  {
    this.chargeLieux() ;
  }

  chargeLieux()
  {
    this.groupesLieux = this.serviceLieu.getTousLesLieux(
      this.nom(), this.type(), false, this.nomExposant(), this.nomPersonne(), this.titreEvenement() )
      .pipe( map( lieux => this.regroupeParType( lieux ) ) ) ;
  }

  // Range les lieux par type, et par numéro dans chaque type
  regroupeParType( lieux: Lieu[] ): GroupeLieux[]
  {
    let groupes: GroupeLieux[] = [] ;

    for( let lieu of [...lieux].sort( (a, b) => a.num - b.num ) )
    {
      let type = lieu.type ?? "Autre" ;
      let groupe = groupes.find( g => g.type == type ) ;
      if( !groupe )
      {
        groupe = { type: type, lieux: [] } ;
        groupes.push( groupe ) ;
      }
      groupe.lieux.push( lieu ) ;
    }

    return groupes.sort( (a, b) => a.type.localeCompare( b.type ) ) ;
  }
}
