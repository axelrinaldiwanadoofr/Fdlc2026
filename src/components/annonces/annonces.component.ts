// Auteur: Kevin MEYER - 16/11/2026

import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { informationCircleOutline, alertCircleOutline, warningOutline, close } from 'ionicons/icons';

import { AnnonceService } from '../../services/annonce.service';
import { Annonce } from '../../modeles/Annonce';

// Bandeau des annonces en cours (rien s'il n'y en a pas)
@Component({
  selector: 'app-annonces',
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.scss'],
  imports: [
    IonIcon
  ],
})
export class AnnoncesComponent implements OnInit, OnDestroy
{
  protected annonces = signal<Annonce[]>( [] ) ;
  protected serviceAnnonce: AnnonceService ;

  // annonces masquées par le visiteur, gardées sur le téléphone (une annonce modifiée réapparait)
  private masquees = signal<string[]>( this.litMasquees() ) ;
  private minuteur: any = null ;

  // urgentes d'abord, puis importantes, puis informations
  protected visibles = computed( () => this.annonces()
    .filter( a => !this.masquees().includes( this.cle( a ) ) )
    .sort( ( a, b ) => this.ordre( a ) - this.ordre( b ) ) ) ;

  constructor( serviceAnnonce: AnnonceService )
  {
    this.serviceAnnonce = serviceAnnonce ;
    addIcons( { informationCircleOutline, alertCircleOutline, warningOutline, close } ) ;
  }

  // rechargées toutes les 2 minutes : une annonce publiée pendant le festival arrive sans recharger la page
  ngOnInit()
  {
    this.charge() ;
    this.minuteur = setInterval( () => this.charge(), 120000 ) ;
  }

  ngOnDestroy()
  {
    clearInterval( this.minuteur ) ;
  }

  charge()
  {
    this.serviceAnnonce.getAnnonces().subscribe( annonces => this.annonces.set( annonces ) ) ;
  }

  niveau( annonce: Annonce ): { nom: string, icone: string }
  {
    if( annonce.couleur == "danger" ) return { nom: "Urgent", icone: "warning-outline" } ;
    if( annonce.couleur == "warning" ) return { nom: "Important", icone: "alert-circle-outline" } ;
    return { nom: "Information", icone: "information-circle-outline" } ;
  }

  private ordre( annonce: Annonce ): number
  {
    return annonce.couleur == "danger" ? 0 : annonce.couleur == "warning" ? 1 : 2 ;
  }

  // "16h30" si l'annonce s'arrête aujourd'hui, rien sinon
  jusqua( annonce: Annonce ): string
  {
    if( !annonce.fin ) return "" ;
    let fin = new Date( annonce.fin.replace( " ", "T" ) ) ;
    if( fin.toDateString() != new Date().toDateString() ) return "" ;
    return fin.getHours() + "h" + String( fin.getMinutes() ).padStart( 2, "0" ) ;
  }

  onFermer( annonce: Annonce )
  {
    let masquees = this.masquees().concat( this.cle( annonce ) ).slice( -50 ) ;
    this.masquees.set( masquees ) ;
    try { localStorage.setItem( "annoncesMasquees", JSON.stringify( masquees ) ) ; } catch( erreur ) {}
  }

  private cle( annonce: Annonce ): string
  {
    return annonce.id + "|" + annonce.texte ;
  }

  private litMasquees(): string[]
  {
    try { return JSON.parse( localStorage.getItem( "annoncesMasquees" ) ?? "[]" ) ; } catch( erreur ) { return [] ; }
  }
}
