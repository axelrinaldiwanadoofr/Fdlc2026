// Auteur: Kevin MEYER - 20/11/2026

import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonSearchbar, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, bookOutline, storefrontOutline, calendarOutline, locationOutline } from 'ionicons/icons';
import { forkJoin } from 'rxjs';

import { PersonneService } from '../../services/personne.service';
import { ExposantService } from '../../services/exposant.service';
import { LivreService } from '../../services/livre.service';
import { EvenementService } from '../../services/evenement.service';
import { LieuService } from '../../services/lieu.service';
import { correspond } from '../../outils/recherche';

// Un résultat : texte affiché et page à ouvrir
interface Resultat
{
  titre: string ;
  detail: string ;
  lien: any[] ;
}

// Recherche dans tout le festival depuis l'accueil, résultats rangés par catégorie
@Component({
  selector: 'app-recherche-globale',
  templateUrl: './recherche-globale.component.html',
  styleUrls: ['./recherche-globale.component.scss'],
  imports: [IonSearchbar, IonIcon, RouterLink],
})
export class RechercheGlobaleComponent
{
  protected recherche = signal( "" ) ;
  protected pret = signal( false ) ;
  private chargement: boolean = false ;

  // tout ce qu'on peut chercher, par catégorie
  private categories = signal<{ titre: string, icone: string, elements: Resultat[] }[]>( [] ) ;

  // 4 résultats au plus par catégorie, les catégories vides sont masquées
  protected groupes = computed( () => this.categories()
    .map( c => ( { titre: c.titre, icone: c.icone, resultats: c.elements.filter( e => correspond( e.titre + " " + e.detail, this.recherche() ) ).slice( 0, 4 ) } ) )
    .filter( c => c.resultats.length > 0 ) ) ;

  protected servicePersonne: PersonneService ;
  protected serviceExposant: ExposantService ;
  protected serviceLivre: LivreService ;
  protected serviceEvenement: EvenementService ;
  protected serviceLieu: LieuService ;

  constructor( servicePersonne: PersonneService, serviceExposant: ExposantService, serviceLivre: LivreService,
               serviceEvenement: EvenementService, serviceLieu: LieuService )
  {
    this.servicePersonne = servicePersonne ;
    this.serviceExposant = serviceExposant ;
    this.serviceLivre = serviceLivre ;
    this.serviceEvenement = serviceEvenement ;
    this.serviceLieu = serviceLieu ;
    addIcons( { personOutline, bookOutline, storefrontOutline, calendarOutline, locationOutline } ) ;
  }

  onRecherche( event: any )
  {
    this.recherche.set( event.detail.value ?? "" ) ;
    this.charge() ;
  }

  // Les listes ne sont chargées qu'à la première recherche
  charge()
  {
    if( this.chargement ) return ;
    this.chargement = true ;

    forkJoin( [this.servicePersonne.getToutesLesPersonnes(), this.serviceExposant.getTousLesExposants(), this.serviceLivre.getTousLesLivres(),
               this.serviceEvenement.getProgramme(), this.serviceLieu.getTousLesLieux()] )
      .subscribe( {
        next: ( [personnes, exposants, livres, programme, lieux] ) =>
        {
          let evenements = programme.permanents.flatMap( j => j.evenements )
            .concat( programme.jours.flatMap( j => j.creneaux.flatMap( c => c.evenements ) ) ) ;

          this.categories.set( [
            { titre: "Auteurs et invités", icone: "person-outline", elements: personnes.map( p => (
                { titre: ( p.prenom + " " + p.nom ).trim(), detail: p.specialite ?? "", lien: ["/page-personne", p.id] } ) ) },
            { titre: "Livres", icone: "book-outline", elements: livres.map( l => (
                { titre: ( l.titre ?? "" ).trim() || "Sans titre", detail: ( ( l.prenom ?? "" ) + " " + ( l.nom ?? "" ) ).trim(), lien: ["/page-livre", l.id] } ) ) },
            { titre: "Exposants", icone: "storefront-outline", elements: exposants.map( x => (
                { titre: x.nom, detail: "Stand " + x.numLieu, lien: ["/page-exposant", x.id] } ) ) },
            { titre: "Programme", icone: "calendar-outline", elements: evenements.map( e => (
                { titre: e.titre, detail: [e.nomJour, e.heure, e.nomLieu].filter( t => t ).join( " | " ), lien: ["/page-evenement", e.id] } ) ) },
            { titre: "Stands et salles", icone: "location-outline", elements: lieux.map( l => (
                { titre: l.nom && l.nom != String( l.num ) ? l.nom : "Stand " + l.num, detail: "n° " + l.num, lien: ["/page-lieu", l.num] } ) ) }
          ] ) ;
          this.pret.set( true ) ;
        },
        error: () => this.chargement = false
      }) ;
  }
}
