// Auteur: Kevin MEYER - 09/11/2026

import { Component, OnChanges, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IonBadge, IonButton, IonSpinner } from '@ionic/angular';

import { LivreAuteur } from '../../modeles/LivreAuteur';
import { LivresAuteurService } from '../../services/livres-auteur.service';

// Livres d'un auteur avec leur couverture
@Component({
  selector: 'app-livres-auteur',
  templateUrl: './livres-auteur.component.html',
  styleUrls: ['./livres-auteur.component.scss'],
  imports: [
    IonBadge,
    IonButton,
    IonSpinner,
    RouterLink
  ],
})
export class LivresAuteurComponent implements OnChanges
{
  public idPersonne = input.required<number>() ;
  public prenom = input<string>( "" ) ;
  public nom = input<string>( "" ) ;

  // recherche à la BnF seulement pour un auteur
  public auteur = input<boolean>( true ) ;

  protected livres = signal<LivreAuteur[]>( [] ) ;
  protected chargement = signal( false ) ;

  protected nbAffiches = signal( 12 ) ;
  protected livresAffiches = computed( () => this.livres().slice( 0, this.nbAffiches() ) ) ;

  protected serviceLivres: LivresAuteurService ;

  constructor( serviceLivres: LivresAuteurService )
  {
    this.serviceLivres = serviceLivres ;
  }

  ngOnChanges()
  {
    this.chargement.set( true ) ;
    this.serviceLivres.getLivresAuteur( this.idPersonne(), this.prenom(), this.nom(), this.auteur() ).subscribe( livres =>
    {
      this.livres.set( livres ) ;
      this.nbAffiches.set( 12 ) ;
      this.chargement.set( false ) ;
    }) ;
  }

  // Livre du festival : page du stand pour pouvoir le situer, sinon page du livre
  lien( livre: LivreAuteur ): Array<string | number> | null
  {
    if( livre.idExposant > 0 ) return ['/page-exposant', livre.idExposant] ;
    if( livre.id > 0 ) return ['/page-livre', livre.id] ;
    return null ;
  }

  // Image en erreur : on essaie la suivante
  imageSuivante( livre: LivreAuteur )
  {
    livre.couvertures = livre.couvertures.slice( 1 ) ;
    this.livres.set( [...this.livres()] ) ;
  }
}
