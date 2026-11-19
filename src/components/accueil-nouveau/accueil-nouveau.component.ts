// Auteur: Kevin MEYER - 19/11/2026

import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonMenuButton } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, mapOutline, peopleOutline, starOutline, chevronForward, openOutline } from 'ionicons/icons';

import { AnnoncesComponent } from '../annonces/annonces.component';
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
    AnnoncesComponent
  ],
})
export class AccueilNouveauComponent implements OnInit
{
  protected serviceEvenement: EvenementService ;
  protected serviceParametre: ParametreService ;
  protected evenements = signal<Evenement[]>( [] ) ;
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
    addIcons( { calendarOutline, mapOutline, peopleOutline, starOutline, chevronForward, openOutline } ) ;
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

  // les 4 prochains événements du programme à partir de maintenant
  ngOnInit()
  {
    // date et heure locales au format de la base : "AAAA-MM-JJ HH:MM"
    let maintenant = new Date( Date.now() - new Date().getTimezoneOffset() * 60000 ).toISOString().slice( 0, 16 ).replace( "T", " " ) ;

    this.serviceEvenement.getProgramme().subscribe( {
      next: programme =>
      {
        let prochains: Evenement[] = [] ;
        for( let jour of programme.jours )
          for( let creneau of jour.creneaux )
            for( let evenement of creneau.evenements )
              if( evenement.debut >= maintenant && prochains.length < 4 ) prochains.push( evenement ) ;

        this.evenements.set( prochains ) ;
        this.charge.set( true ) ;
      },
      error: () => this.charge.set( true )
    }) ;
  }
}
