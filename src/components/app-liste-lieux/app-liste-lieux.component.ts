import { Component, OnInit, OnChanges, computed, effect, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonList, IonItem, IonLabel, IonItemDivider, IonItemGroup } from '@ionic/angular';
import { LieuService } from '../../services/lieu.service';
import { Lieu } from '../../modeles/Lieu';
import { MajusculePipe } from '../../pipes/majuscule.pipe';
import { correspond } from '../../outils/recherche';

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
  imports: [IonList, IonItem, IonLabel, IonItemDivider, IonItemGroup, RouterLink, MajusculePipe],
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

  // Filtres appliqués sur la liste déjà chargée (page Liste des lieux)
  recherche = input<string>( "" ) ;
  typeLieu = input<string>( "" ) ;
  hall = input<number>( -1 ) ;

  // Nombre de lieux affichés, et liste complète une fois chargée
  total = output<number>() ;
  charge = output<Lieu[]>() ;

  protected lieux = signal<Lieu[] | null>( null ) ;
  private criteres: string | null = null ;

  protected lieuxFiltres = computed( () => ( this.lieux() ?? [] ).filter( lieu =>
    ( this.typeLieu() == "" || lieu.type == this.typeLieu() ) &&
    ( this.hall() == -1 || lieu.hall == this.hall() ) &&
    correspond( lieu.num + " " + ( lieu.nom ?? "" ) + " " + ( lieu.libelle ?? "" ), this.recherche() ) ) ) ;

  protected groupesLieux = computed( () => this.regroupeParType( this.lieuxFiltres() ) ) ;

  protected serviceLieu: LieuService ;

  constructor( serviceLieu: LieuService )
  {
    this.serviceLieu = serviceLieu ;
    effect( () =>
    {
      if( this.lieux() ) this.total.emit( this.lieuxFiltres().length ) ;
    }) ;
  }

  ngOnInit()
  {
    this.chargeLieux() ;
  }

  // Rafraichit la liste quand les parametres d'input sont modifiés
  ngOnChanges()
  {
    this.chargeLieux() ;
  }

  // Ne redemande les lieux au serveur que si leurs critères ont changé
  chargeLieux()
  {
    let criteres = [this.nom(), this.type(), this.nomExposant(), this.nomPersonne(), this.titreEvenement()].join( "|" ) ;
    if( criteres == this.criteres ) return ;
    this.criteres = criteres ;

    this.serviceLieu.getTousLesLieux( this.nom(), this.type(), false, this.nomExposant(), this.nomPersonne(), this.titreEvenement() )
      .subscribe( lieux =>
      {
        this.lieux.set( lieux ) ;
        this.charge.emit( lieux ) ;
      }) ;
  }

  // Range les lieux par type, et par numéro dans chaque type
  regroupeParType( lieux: Lieu[] ): GroupeLieux[]
  {
    let groupes: GroupeLieux[] = [] ;

    for( let lieu of lieux.slice().sort( (a, b) => a.num - b.num ) )
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
