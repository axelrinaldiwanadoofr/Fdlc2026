import { Component, OnInit, computed, input, signal } from '@angular/core';
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
  IonItemDivider,
  IonNote,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { storefrontOutline, calendarOutline, chevronForward } from 'ionicons/icons';
import { MajusculePipe } from '../../pipes/majuscule.pipe';
import { OuTrouverComponent } from '../../components/ou-trouver/ou-trouver.component';

interface AuteurLivre { id: number; prenom: string; nom: string; }
interface ExposantLivre { id: number; nom: string; numLieu: number | null; }
interface EvenementLivre { id: number; titre: string; debut: string | null; numLieu: number | null; type: string | null; }
interface LiensLivre { auteurs: AuteurLivre[]; exposants: ExposantLivre[]; evenements: EvenementLivre[]; }

@Component({
  selector: 'app-page-livre',
  templateUrl: './page-livre.page.html',
  styleUrls: ['./page-livre.page.scss'],
  imports: [
    OuTrouverComponent,
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
    IonItemDivider,
    IonNote,
    IonIcon,
    RouterLink,
    MajusculePipe
  ]
})
export class PageLivrePage implements OnInit
{
  public id = input<number>( -1 ) ;
  public livre = signal<Livre | null>( null ) ;
  public message = signal( "Chargement des détails du livre..." ) ;

  // Auteurs, exposants et événements liés au livre
  public liens = signal<LiensLivre>( { auteurs: [], exposants: [], evenements: [] } ) ;

  // stand de l'éditeur (ou d'un exposant du livre) pour le petit plan, -1 sinon
  public standDuLivre = computed( () => this.liens().exposants.find( x => ( x.numLieu ?? 0 ) > 0 )?.numLieu ?? -1 ) ;

  // Couvertures trouvées à la BnF (null pendant la recherche)
  public couvertures = signal<string[] | null>( null ) ;

  protected serviceLivre: LivreService ;
  protected serviceLivresAuteur: LivresAuteurService ;
  protected http: HttpClient ;

  constructor( serviceLivre: LivreService, serviceLivresAuteur: LivresAuteurService, http: HttpClient )
  {
    this.serviceLivre = serviceLivre ;
    this.serviceLivresAuteur = serviceLivresAuteur ;
    this.http = http ;
    addIcons( { storefrontOutline, calendarOutline, chevronForward } ) ;
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