// Auteur: Kevin MEYER - 19/11/2026

import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonMenuButton } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, mapOutline, peopleOutline, starOutline, chevronForward } from 'ionicons/icons';

import { AnnoncesComponent } from '../annonces/annonces.component';
import { EvenementService } from '../../services/evenement.service';
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
  protected evenements = signal<Evenement[]>( [] ) ;
  protected charge = signal( false ) ;
  protected texteDuJour: string = "" ;

  protected liens = [
    { titre: "Programme", icone: "calendar-outline", couleur: "#1f8a5b", lien: "/page-liste-evenements" },
    { titre: "Plan du salon", icone: "map-outline", couleur: "#c2569a", lien: "/plans" },
    { titre: "Auteurs", icone: "people-outline", couleur: "#2b3990", lien: "/page-liste-personnes" },
    { titre: "Mon planning", icone: "star-outline", couleur: "#e08a2c", lien: "/page-planning-personnel" }
  ] ;

  constructor( serviceEvenement: EvenementService )
  {
    this.serviceEvenement = serviceEvenement ;
    addIcons( { calendarOutline, mapOutline, peopleOutline, starOutline, chevronForward } ) ;
    this.texteDuJour = this.calculeTexteDuJour() ;
  }

  // texte en haut de la page selon le nombre de jours avant le festival
  calculeTexteDuJour(): string
  {
    let aujourdhui = new Date() ;
    aujourdhui.setHours( 0, 0, 0, 0 ) ;
    let jours = Math.round( ( new Date( 2026, 10, 21 ).getTime() - aujourdhui.getTime() ) / 86400000 ) ;

    if( jours > 1 ) return "Le festival commence dans " + jours + " jours" ;
    if( jours == 1 ) return "Le festival commence demain" ;
    if( jours >= -1 ) return "Le festival a lieu aujourd'hui" ;
    return "Merci de votre visite, à l'année prochaine" ;
  }

  // les 4 prochains événements a partir de maintenant
  ngOnInit()
  {
    let maintenant = new Date( Date.now() - new Date().getTimezoneOffset() * 60000 ).toISOString().slice( 0, 16 ).replace( "T", " " ) ;

    this.serviceEvenement.getTousLesEvenements( "", maintenant ).subscribe( {
      next: evenements =>
      {
        this.evenements.set( evenements.slice( 0, 4 ) ) ;
        this.charge.set( true ) ;
      },
      error: () => this.charge.set( true )
    }) ;
  }

  jour( date: string ): string
  {
    let jours = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."] ;
    return jours[ new Date( date + "T12:00:00" ).getDay() ] ;
  }
}
