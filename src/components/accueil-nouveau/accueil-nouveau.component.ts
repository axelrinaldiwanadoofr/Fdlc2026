// Auteur: Kevin MEYER - 19/11/2026

import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonMenuButton } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, mapOutline, peopleOutline, starOutline, shareSocialOutline, chevronForward, openOutline } from 'ionicons/icons';

import { AnnoncesComponent } from '../annonces/annonces.component';
import { RechercheGlobaleComponent } from '../recherche-globale/recherche-globale.component';
import { EvenementService } from '../../services/evenement.service';
import { ParametreService } from '../../services/parametre.service';
import { Evenement } from '../../modeles/Evenement';

// Nouvelle page d'accueil : affiche, raccourcis et prochains événements
@Component({
  selector: 'app-accueil-nouveau',
  templateUrl: './accueil-nouveau.component.html',
  styleUrls: ['./accueil-nouveau.component.scss'],
  imports: [
    IonIcon,
    IonMenuButton,
    RouterLink,
    AnnoncesComponent,
    RechercheGlobaleComponent
  ],
})
export class AccueilNouveauComponent implements OnInit, OnDestroy
{
  protected serviceEvenement: EvenementService ;
  protected serviceParametre: ParametreService ;
  // événements à horaire du programme et heure actuelle ("AAAA-MM-JJ HH:MM", remise à jour chaque minute)
  private tous = signal<Evenement[]>( [] ) ;
  private maintenant = signal( this.heureActuelle() ) ;
  private minuteur: any = null ;

  protected enCours = computed( () => this.tous().filter( e => e.debut <= this.maintenant() && this.fin( e ) > this.maintenant() ) ) ;
  protected evenements = computed( () => this.tous().filter( e => e.debut > this.maintenant() ).slice( 0, 4 ) ) ;
  protected charge = signal( false ) ;
  protected moment = computed( () => this.calculeMoment( this.serviceParametre.reglages().debut, this.serviceParametre.reglages().fin ) ) ;

  protected liens = [
    { titre: "Programme", icone: "calendar-outline", couleur: "secondary", lien: "/page-liste-evenements" },
    { titre: "Plan du salon", icone: "map-outline", couleur: "tertiary", lien: "/plans" },
    { titre: "Auteurs", icone: "people-outline", couleur: "primary", lien: "/page-liste-personnes" },
    { titre: "Mon planning", icone: "star-outline", couleur: "warning", lien: "/page-planning-personnel" }
  ] ;

  constructor( serviceEvenement: EvenementService, serviceParametre: ParametreService )
  {
    this.serviceEvenement = serviceEvenement ;
    this.serviceParametre = serviceParametre ;
    addIcons( { calendarOutline, mapOutline, peopleOutline, starOutline, shareSocialOutline, chevronForward, openOutline } ) ;
  }

  // texte de la puce en haut a gauche selon le jour
  calculeMoment( debut: string, fin: string ): string[]
  {
    let aujourdhui = new Date() ;
    aujourdhui.setHours( 0, 0, 0, 0 ) ;
    let jours = Math.round( ( this.serviceParametre.date( debut ).getTime() - aujourdhui.getTime() ) / 86400000 ) ;

    if( jours > 1 ) return ["Ouverture", "dans " + jours + " jours"] ;
    if( jours == 1 ) return ["Ouverture", "demain"] ;
    if( aujourdhui <= this.serviceParametre.date( fin ) )
      return ["Ouvert aujourd'hui", new Intl.DateTimeFormat( "fr-FR", { weekday: "long", day: "numeric" } ).format( aujourdhui )] ;
    return ["Merci de votre visite", "à l'année prochaine"] ;
  }

  ngOnInit()
  {
    this.serviceEvenement.getProgramme().subscribe( {
      next: programme =>
      {
        this.tous.set( programme.jours.flatMap( jour => jour.creneaux.flatMap( creneau => creneau.evenements ) ) ) ;
        this.charge.set( true ) ;
      },
      error: () => this.charge.set( true )
    }) ;
    this.minuteur = setInterval( () => this.maintenant.set( this.heureActuelle() ), 60000 ) ;
  }

  ngOnDestroy()
  {
    clearInterval( this.minuteur ) ;
  }

  // date et heure locales au format de la base
  private heureActuelle( date: Date = new Date() ): string
  {
    return new Date( date.getTime() - date.getTimezoneOffset() * 60000 ).toISOString().slice( 0, 16 ).replace( "T", " " ) ;
  }

  // la base n'a souvent pas d'heure de fin : on compte alors une heure
  private fin( evenement: Evenement ): string
  {
    if( evenement.fin ) return evenement.fin ;
    return this.heureActuelle( new Date( new Date( evenement.debut.replace( " ", "T" ) ).getTime() + 3600000 ) ) ;
  }
}
