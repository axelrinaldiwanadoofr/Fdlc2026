// Auteur: Kevin MEYER - 12/11/2026

import { Component, OnChanges, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IonList, IonItemDivider, IonItem, IonLabel, IonNote, IonButton } from '@ionic/angular';

import { PersonneStand } from '../../modeles/PersonneStand';
import { ExposantService } from '../../services/exposant.service';

// un créneau de présence sur un stand
class Creneau
{
  public champ: string ;
  public nom: string ;
  public debut: string ;
  public fin: string ;

  constructor( champ: string, nom: string, debut: string, fin: string )
  {
    this.champ = champ ;
    this.nom = nom ;
    this.debut = debut ;
    this.fin = fin ;
  }
}

// Personnes présentes sur le stand et auteurs du stand
@Component({
  selector: 'app-personnes-stand',
  templateUrl: './personnes-stand.component.html',
  styleUrls: ['./personnes-stand.component.scss'],
  imports: [
    IonList,
    IonItemDivider,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
    RouterLink
  ],
})
export class PersonnesStandComponent implements OnChanges
{
  public idExposant = input.required<number>() ;

  protected personnes = signal<PersonneStand[]>( [] ) ;

  protected creneaux: Creneau[] = [
    new Creneau( "samedi_am", "Samedi matin", "2026-11-21T09:00", "2026-11-21T13:00" ),
    new Creneau( "samedi_pm", "Samedi après-midi", "2026-11-21T13:00", "2026-11-21T19:00" ),
    new Creneau( "dimanche_am", "Dimanche matin", "2026-11-22T09:00", "2026-11-22T13:00" ),
    new Creneau( "dimanche_pm", "Dimanche après-midi", "2026-11-22T13:00", "2026-11-22T19:00" ),
  ] ;

  // créneau en cours pendant le festival, sinon null
  protected creneauActuel: Creneau | null = null ;

  protected serviceExposant: ExposantService ;

  constructor( serviceExposant: ExposantService )
  {
    this.serviceExposant = serviceExposant ;
  }

  ngOnChanges()
  {
    this.creneauActuel = this.trouveCreneau( new Date() ) ;
    this.serviceExposant.getPersonnesExposant( this.idExposant() ).subscribe( personnes => this.personnes.set( personnes ) ) ;
  }

  private trouveCreneau( date: Date ): Creneau | null
  {
    for( let creneau of this.creneaux )
    {
      if( date >= new Date( creneau.debut ) && date < new Date( creneau.fin ) ) return creneau ;
    }
    return null ;
  }

  presents( creneau: Creneau ): PersonneStand[]
  {
    return this.personnes().filter( p => this.estPresent( p, creneau.champ ) ) ;
  }

  private estPresent( p: PersonneStand, champ: string ): boolean
  {
    if( champ == "samedi_am" ) return p.samedi_am == 1 ;
    if( champ == "samedi_pm" ) return p.samedi_pm == 1 ;
    if( champ == "dimanche_am" ) return p.dimanche_am == 1 ;
    return p.dimanche_pm == 1 ;
  }

  noms( creneau: Creneau ): string
  {
    return this.presents( creneau ).map( p => p.prenom + " " + p.nom ).join( ", " ) ;
  }

  // créneaux avec les mêmes personnes sur une seule ligne
  protected groupes = computed( () =>
  {
    let groupes: Array<{ quand: string, noms: string, creneaux: Creneau[] }> = [] ;
    for( let creneau of this.creneaux )
    {
      let noms = this.noms( creneau ) ;
      if( noms == "" ) continue ;

      let groupe = groupes.find( g => g.noms == noms ) ;
      if( groupe ) groupe.creneaux.push( creneau ) ;
      else groupes.push( { quand: "", noms: noms, creneaux: [creneau] } ) ;
    }

    for( let groupe of groupes ) groupe.quand = this.quand( groupe.creneaux ) ;
    return groupes ;
  }) ;

  private quand( creneaux: Creneau[] ): string
  {
    let champs = creneaux.map( c => c.champ ).join( " " ) ;
    if( creneaux.length == 4 ) return "Tout le week-end" ;
    if( champs == "samedi_am samedi_pm" ) return "Samedi" ;
    if( champs == "dimanche_am dimanche_pm" ) return "Dimanche" ;
    return creneaux.map( c => c.nom ).join( " | " ) ;
  }
}
