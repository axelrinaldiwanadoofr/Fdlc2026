import { Component, OnInit, input, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { LivreService } from '../../services/livre.service';
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
    AsyncPipe,
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

  protected livres: Observable<Array<Livre>> | null = null;
  protected serviceLivre: LivreService ;

  constructor( serviceLivre: LivreService, private http: HttpClient )
  {
    this.serviceLivre = serviceLivre ;
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
        next: ( data ) => { if( data && data.auteurs ) this.liens.set( data ) ; },
        error: () => { /* on garde l'affichage simple si les liens ne se chargent pas */ }
      }) ;
    }
    else this.message.set( "Ce livre n'existe pas ou plus." ) ;
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