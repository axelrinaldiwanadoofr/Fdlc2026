import { Component, OnInit, input, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { LivreService } from '../../services/livre.service';
import { LivresAuteurService } from '../../services/livres-auteur.service';
import { Livre } from '../../modeles/Livre';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/angular';

interface AuteurLivre { id: number; prenom: string; nom: string; }
interface ExposantLivre { id: number; nom: string; numLieu: number | null; }
interface EvenementLivre { id: number; titre: string; debut: string | null; numLieu: number | null; type: string | null; }
interface LiensLivre { auteurs: AuteurLivre[]; exposants: ExposantLivre[]; evenements: EvenementLivre[]; }

@Component({
  selector: 'app-page-livre',
  templateUrl: './page-livre.page.html',
  styleUrls: ['./page-livre.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonCardTitle,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonCard,
    RouterLink
  ]
})
export class PageLivrePage implements OnInit
{
  public id = input<number>( -1 ) ;
  public livre = signal<Livre | null>( null ) ;
  public message = signal( "Chargement des détails du livre..." ) ;

  // Auteurs, exposants et événements liés au livre
  public liens = signal<LiensLivre>( { auteurs: [], exposants: [], evenements: [] } ) ;

  // Couvertures trouvées à la BnF (null pendant la recherche)
  public couvertures = signal<string[] | null>( null ) ;

  protected serviceLivre: LivreService ;
  protected serviceLivresAuteur: LivresAuteurService ;

  constructor( serviceLivre: LivreService, serviceLivresAuteur: LivresAuteurService, private http: HttpClient )
  {
    this.serviceLivre = serviceLivre ;
    this.serviceLivresAuteur = serviceLivresAuteur ;
  }

  ngOnInit()
  {
    const bookId = Number( this.id() ) ;
    if( bookId > 0 )
    {
      this.serviceLivre.getLivreById( bookId ).subscribe({
        next: ( data ) => {
          this.livre.set( data ) ;
          if( !data ) this.message.set( "Ce livre n'existe pas ou plus." ) ;
        },
        error: () => { this.message.set( "Impossible de charger le livre." ) ; }
      }) ;

      this.http.get<LiensLivre>( 'php/livre/liens-livre.php?id=' + bookId ).subscribe({
        next: ( data ) => {
          if( data && data.auteurs ) this.liens.set( data ) ;
          this.chargeCouverture( bookId ) ;
        },
        error: () => { this.couvertures.set( [] ) ; }
      }) ;
    }
    else this.message.set( "Ce livre n'existe pas ou plus." ) ;
  }

  // Même recherche que sur la page de l'auteur : catalogue BnF puis Open Library
  chargeCouverture( idLivre: number )
  {
    const auteur = this.liens().auteurs[0] ;
    if( !auteur )
    {
      this.couvertures.set( [] ) ;
      return ;
    }

    this.serviceLivresAuteur.getCouvertures( idLivre, auteur.id, auteur.prenom, auteur.nom ).subscribe( couvertures => this.couvertures.set( couvertures ) ) ;
  }

  // Image introuvable : on essaie la suivante
  imageSuivante()
  {
    this.couvertures.set( ( this.couvertures() ?? [] ).slice( 1 ) ) ;
  }

  // Met une date SQL ("2026-11-21 10:30:00") en forme lisible
  formatDate( debut: string | null ): string
  {
    if( !debut ) return "" ;
    const d = new Date( debut.replace( ' ', 'T' ) ) ;
    if( isNaN( d.getTime() ) ) return debut ;
    return d.toLocaleString( 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' } ) ;
  }
}