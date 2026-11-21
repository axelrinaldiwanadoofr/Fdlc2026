// Auteur: Kevin MEYER - 16/11/2026

import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonNote,
  IonToast,
  IonAlert,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

import { ConfigService } from '../../services/config.service';
import { LieuService } from '../../services/lieu.service';
import { Lieu } from '../../modeles/Lieu';
import { MajusculePipe } from '../../pipes/majuscule.pipe';

// Page de config pour créer les lieux avant de les placer sur les plans
@Component({
  selector: 'app-page-config-lieu',
  templateUrl: './page-config-lieu.page.html',
  styleUrls: ['./page-config-lieu.page.scss'],
  imports: [
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonNote,
    IonToast,
    IonAlert,
    FormsModule,
    MajusculePipe
  ]
})
export class PageConfigLieuPage
{
  protected serviceConfig: ConfigService ;
  protected serviceLieu: LieuService ;
  protected router: Router ;

  protected halls = [1, 2, 3, 4, 5] ;
  protected lieux = signal<Array<Lieu>>( [] ) ;
  protected types = signal<Array<string>>( [] ) ;

  // 0 = tous les halls
  protected hall = signal(0) ;
  protected recherche = signal("") ;

  // Lieu en cours de modification (null = on affiche la liste)
  protected lieu = signal<Lieu | null>( null ) ;
  protected nouveau: boolean = false ;
  protected erreur = signal("") ;
  protected message = signal("") ;
  protected alerteSupprimer = signal(false) ;
  protected alertePlacer = signal(false) ;

  protected boutonsSupprimer = [
    { text: "Annuler", role: "cancel" },
    { text: "Supprimer", role: "destructive", handler: () => this.onSupprimer() }
  ] ;

  protected boutonsPlacer = [
    { text: "Plus tard", role: "cancel" },
    { text: "Placer sur le plan", handler: () => this.onPlacer() }
  ] ;

  protected lieuxTrouves = computed( () =>
  {
    let texte = this.recherche().toLowerCase() ;
    return this.lieux().filter( l => ( this.hall() == 0 || l.hall == this.hall() )
      && ( l.num + " " + l.nom + " " + ( l.libelle ?? "" ) + " " + l.type ).toLowerCase().includes( texte ) ) ;
  }) ;

  constructor( serviceConfig: ConfigService, serviceLieu: LieuService, router: Router )
  {
    addIcons( { addOutline } ) ;
    this.serviceConfig = serviceConfig ;
    this.serviceLieu = serviceLieu ;
    this.router = router ;
  }

  // Sans mot de passe on retourne sur la page principale de config
  ionViewWillEnter()
  {
    if( !this.serviceConfig.connecte() )
    {
      this.router.navigateByUrl( "/config" ) ;
      return ;
    }

    this.chargeLieux() ;
    this.serviceLieu.getTousLesTypesLieu().subscribe( types => this.types.set( types.map( t => t.type ) ) ) ;
  }

  chargeLieux()
  {
    this.serviceLieu.getConfigLieux().subscribe( lieux => this.lieux.set( lieux ) ) ;
  }

  onNouveau()
  {
    let hall = this.hall() || 1 ;
    this.nouveau = true ;
    this.ouvre( new Lieu( this.numLibre( hall ), "", "stand", 0, 0, 0, 0, hall ) ) ;
  }

  onModifier( lieu: Lieu )
  {
    // copie pour ne pas modifier la liste si on annule
    this.nouveau = false ;
    this.ouvre( Object.assign( new Lieu( -1, "", "", 0, 0, 0, 0 ), lieu ) ) ;
  }

  private ouvre( lieu: Lieu )
  {
    this.erreur.set( "" ) ;
    this.lieu.set( lieu ) ;
  }

  // Premier numéro libre du hall (hall 3 => 300, 301...)
  numLibre( hall: number ): number
  {
    let num = hall * 100 ;
    while( this.lieux().some( l => l.num == num ) ) num++ ;
    return num ;
  }

  onAnnuler()
  {
    this.lieu.set( null ) ;
  }

  onEnregistrer()
  {
    let lieu = this.lieu() ;
    if( !lieu ) return ;

    if( !( lieu.num > 0 ) || !lieu.type )
    {
      this.erreur.set( "Le numéro et le type sont obligatoires" ) ;
      return ;
    }

    this.serviceLieu.majLieu( lieu, this.nouveau ).subscribe( {
      next: () =>
      {
        this.chargeLieux() ;
        if( this.nouveau ) this.alertePlacer.set( true ) ;
        else this.ferme( "Lieu enregistré" ) ;
      },
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  onSupprimer()
  {
    let lieu = this.lieu() ;
    if( !lieu ) return ;

    this.serviceLieu.supprimeLieu( lieu.num ).subscribe( {
      next: () =>
      {
        this.chargeLieux() ;
        this.ferme( "Lieu supprimé" ) ;
      },
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  // Ouvre la config des plans sur le hall et le lieu
  onPlacer()
  {
    let lieu = this.lieu() ;
    if( !lieu ) return ;
    this.lieu.set( null ) ;
    this.router.navigate( ["/config-plan"], { queryParams: { hall: lieu.hall, num: lieu.num } } ) ;
  }

  onFinAlertePlacer()
  {
    this.alertePlacer.set( false ) ;
    if( this.lieu() ) this.ferme( "Lieu créé" ) ;
  }

  private ferme( message: string )
  {
    this.message.set( message ) ;
    this.lieu.set( null ) ;
  }

  private erreurServeur( erreur: any )
  {
    // 401 : session expirée, on revient à la connexion
    if( erreur.status == 401 )
    {
      this.serviceConfig.deconnexion() ;
      this.router.navigateByUrl( "/config" ) ;
    }
    this.erreur.set( erreur.error?.erreur ?? "Erreur lors de l'enregistrement" ) ;
  }
}
