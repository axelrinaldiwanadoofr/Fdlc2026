// Auteur: Kevin MEYER - 12/11/2026

import { Component, OnChanges, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IonList, IonItemDivider, IonItem, IonLabel, IonNote, IonButton } from '@ionic/angular';

import { PersonneStand } from '../../modeles/PersonneStand';
import { Exposant } from '../../modeles/Exposant';
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

// Personnes présentes sur le stand et autres exposants du stand
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
  protected exposants = signal<Exposant[]>( [] ) ;

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
    this.serviceExposant.getExposantsStand( this.idExposant() ).subscribe( exposants => this.exposants.set( exposants ) ) ;
  }

  private trouveCreneau( date: Date ): Creneau | null
  {
    for( let creneau of this.creneaux )
    {
      if( date >= new Date( creneau.debut ) && date < new Date( creneau.fin ) ) return creneau ;
    }
    return null ;
  }

  estPresent( p: PersonneStand, champ: string ): boolean
  {
    if( champ == "samedi_am" ) return p.samedi_am == 1 ;
    if( champ == "samedi_pm" ) return p.samedi_pm == 1 ;
    if( champ == "dimanche_am" ) return p.dimanche_am == 1 ;
    return p.dimanche_pm == 1 ;
  }

  // Pendant le festival, les personnes présentes en ce moment passent en premier
  protected personnesTriees = computed( () =>
  {
    let creneau = this.creneauActuel ;
    if( !creneau ) return this.personnes() ;
    return this.personnes().slice().sort( ( a, b ) => Number( this.estPresent( b, creneau.champ ) ) - Number( this.estPresent( a, creneau.champ ) ) ) ;
  }) ;

  // ex : Samedi | Dimanche matin
  quand( p: PersonneStand ): string
  {
    let presents = this.creneaux.filter( c => this.estPresent( p, c.champ ) ) ;
    let champs = presents.map( c => c.champ ).join( " " ) ;

    if( presents.length == 4 ) return "Tout le week-end" ;
    if( presents.length == 0 ) return "Horaires pas encore connus" ;

    let jours: string[] = [] ;
    for( let jour of ["samedi", "dimanche"] )
    {
      let nom = jour == "samedi" ? "Samedi" : "Dimanche" ;
      if( champs.includes( jour + "_am" ) && champs.includes( jour + "_pm" ) ) jours.push( nom ) ;
      else if( champs.includes( jour + "_am" ) ) jours.push( nom + " matin" ) ;
      else if( champs.includes( jour + "_pm" ) ) jours.push( nom + " après-midi" ) ;
    }
    return jours.join( " | " ) ;
  }
}
