// Auteur: Kevin MEYER - 16/11/2026

import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonSearchbar,
  IonModal,
  IonNote,
} from '@ionic/angular';

import { ConfigService } from '../../services/config.service';
import { PersonneService } from '../../services/personne.service';
import { Compte } from '../../modeles/Compte';
import { Personne } from '../../modeles/Personne';
import { AccesCompteComponent } from '../../components/acces-compte/acces-compte.component';

// Page des comptes : qui peut se connecter à la config, avec quel rôle
@Component({
  selector: 'app-page-config-comptes',
  templateUrl: './page-config-comptes.page.html',
  styleUrls: ['./page-config-comptes.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonSearchbar,
    IonModal,
    IonNote,
    AccesCompteComponent
  ]
})
export class PageConfigComptesPage
{
  protected serviceConfig: ConfigService ;
  protected servicePersonne: PersonneService ;
  protected router: Router ;

  protected comptes = signal<Compte[]>( [] ) ;
  protected personnes = signal<Personne[]>( [] ) ;
  protected recherche = signal("") ;

  // personne dont on gère l'accès dans la fenêtre (null = fenêtre fermée)
  protected personne = signal<Personne | null>( null ) ;
  protected modalPersonnes = signal(false) ;
  protected recherchePersonne = signal("") ;

  protected comptesTrouves = computed( () =>
  {
    let texte = this.recherche().toLowerCase() ;
    return this.comptes().filter( c => ( c.identifiant + " " + ( c.nom ?? "" ) + " " + c.role ).toLowerCase().includes( texte ) ) ;
  }) ;

  // personnes qui n'ont pas encore de compte
  protected personnesSansCompte = computed( () =>
  {
    let avecCompte = this.comptes().map( c => c.idPersonne ) ;
    let texte = this.recherchePersonne().toLowerCase() ;
    return this.personnes()
      .filter( p => !avecCompte.includes( p.id ) && ( p.prenom + " " + p.nom ).toLowerCase().includes( texte ) )
      .slice( 0, 100 ) ;
  }) ;

  constructor( serviceConfig: ConfigService, servicePersonne: PersonneService, router: Router )
  {
    this.serviceConfig = serviceConfig ;
    this.servicePersonne = servicePersonne ;
    this.router = router ;
  }

  ionViewWillEnter()
  {
    if( !this.serviceConfig.peut( "comptes.gerer" ) )
    {
      this.router.navigateByUrl( "/config" ) ;
      return ;
    }

    this.chargeComptes() ;
    this.servicePersonne.getConfigPersonnes().subscribe( personnes => this.personnes.set( personnes ) ) ;
  }

  chargeComptes()
  {
    this.serviceConfig.getComptes().subscribe( comptes => this.comptes.set( comptes ) ) ;
  }

  onOuvrir( compte: Compte )
  {
    if( !compte.modifiable ) return ;
    let personne = new Personne() ;
    personne.id = compte.idPersonne ;
    let trouvee = this.personnes().find( p => p.id == compte.idPersonne ) ;
    personne.prenom = trouvee?.prenom ?? "" ;
    personne.nom = trouvee?.nom ?? compte.nom ;
    this.personne.set( personne ) ;
  }

  onNouveau()
  {
    this.recherchePersonne.set( "" ) ;
    this.modalPersonnes.set( true ) ;
  }

  onChoisirPersonne( personne: Personne )
  {
    this.modalPersonnes.set( false ) ;
    this.personne.set( personne ) ;
  }

  onFermer()
  {
    this.personne.set( null ) ;
    this.chargeComptes() ;
  }

  dateConnexion( date: string ): string
  {
    if( !date ) return "jamais connecté" ;
    return "connecté le " + date.substring( 8, 10 ) + "/" + date.substring( 5, 7 ) + " à " + date.substring( 11, 13 ) + "h" + date.substring( 14, 16 ) ;
  }
}
