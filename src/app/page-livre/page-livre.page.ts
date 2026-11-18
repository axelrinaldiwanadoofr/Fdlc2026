import { Component, OnInit, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/angular';

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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    CommonModule, 
    FormsModule
  ]
})
export class PageLivrePage implements OnInit 
{
  public id = input<number>( -1 ) ;
  public livre = signal<Livre | null>( null ) ;
  public message = signal( "Chargement des détails du livre..." ) ;

  constructor( private serviceLivre: LivreService ) {}

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
    }
    else this.message.set( "Ce livre n'existe pas ou plus." ) ;
  }
}
