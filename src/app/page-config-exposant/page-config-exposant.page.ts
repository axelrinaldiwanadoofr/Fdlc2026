// Auteur: Kevin MEYER - 16/11/2026

import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  IonModal,
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
import { ExposantService } from '../../services/exposant.service';
import { LieuService } from '../../services/lieu.service';
import { Exposant } from '../../modeles/Exposant';
import { Lieu } from '../../modeles/Lieu';
import { MajusculePipe } from '../../pipes/majuscule.pipe';

// Page de config des exposants : nom, type, stand et fusion des doublons
@Component({
  selector: 'app-page-config-exposant',
  templateUrl: './page-config-exposant.page.html',
  styleUrls: ['./page-config-exposant.page.scss'],
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
    IonModal,
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
export class PageConfigExposantPage
{
  protected serviceConfig: ConfigService ;
  protected serviceExposant: ExposantService ;
  protected serviceLieu: LieuService ;
  protected router: Router ;
  protected route: ActivatedRoute ;

  protected exposants = signal<Array<Exposant>>( [] ) ;
  protected types = signal<Array<string>>( [] ) ;
  protected lieux = signal<Array<Lieu>>( [] ) ;

  protected filtre = signal("tous") ;
  protected recherche = signal("") ;

  // Exposant en cours de modification (null = on affiche la liste)
  protected exposant = signal<Exposant | null>( null ) ;
  protected erreur = signal("") ;
  protected message = signal("") ;
  protected alerteSupprimer = signal(false) ;

  // Fusion : l'exposant ouvert disparait au profit de exposantGarde
  protected modalFusion = signal(false) ;
  protected rechercheFusion = signal("") ;
  protected exposantGarde = signal<Exposant | null>( null ) ;

  protected boutonsSupprimer = [
    { text: "Annuler", role: "cancel" },
    { text: "Supprimer", role: "destructive", handler: () => this.onSupprimer() }
  ] ;

  protected boutonsFusion = [
    { text: "Annuler", role: "cancel" },
    { text: "Fusionner", role: "destructive", handler: () => this.onFusionner() }
  ] ;

  // nombre d'exposants par nom simplifié, pour trouver les doublons
  private nbParCle = computed( () =>
  {
    let nb = new Map<string, number>() ;
    for( let x of this.exposants() ) nb.set( this.cle( x.nom ), ( nb.get( this.cle( x.nom ) ) ?? 0 ) + 1 ) ;
    return nb ;
  }) ;

  protected exposantsTrouves = computed( () =>
  {
    let texte = this.recherche().toLowerCase() ;
    let liste = this.exposants().filter( x =>
    {
      if( this.filtre() == "stand" && x.numLieu ) return false ;
      if( this.filtre() == "doublons" && ( this.nbParCle().get( this.cle( x.nom ) ) ?? 0 ) < 2 ) return false ;
      return ( x.nom + " " + ( x.numLieu ?? "" ) + " " + ( x.type ?? "" ) ).toLowerCase().includes( texte ) ;
    }) ;

    // les doublons sont mis les uns sous les autres
    if( this.filtre() == "doublons" ) liste.sort( ( a, b ) => this.cle( a.nom ).localeCompare( this.cle( b.nom ) ) ) ;
    return liste ;
  }) ;

  protected exposantsFusion = computed( () =>
  {
    let texte = this.rechercheFusion().toLowerCase() ;
    let id = this.exposant()?.id ;
    return this.exposants().filter( x => x.id != id && ( x.nom + " " + ( x.numLieu ?? "" ) ).toLowerCase().includes( texte ) ).slice( 0, 100 ) ;
  }) ;

  constructor( serviceConfig: ConfigService, serviceExposant: ExposantService, serviceLieu: LieuService, router: Router, route: ActivatedRoute )
  {
    addIcons( { addOutline } ) ;
    this.serviceConfig = serviceConfig ;
    this.serviceExposant = serviceExposant ;
    this.serviceLieu = serviceLieu ;
    this.router = router ;
    this.route = route ;
  }

  // Sans mot de passe on retourne sur la page principale de config
  ionViewWillEnter()
  {
    if( !this.serviceConfig.connecte() )
    {
      this.router.navigateByUrl( "/config" ) ;
      return ;
    }

    // ?filtre=... depuis la page de contrôle
    let filtre = this.route.snapshot.queryParamMap.get( "filtre" ) ;
    if( filtre ) this.filtre.set( filtre ) ;

    this.chargeExposants() ;
    this.serviceExposant.getTypesExposant().subscribe( types => this.types.set( types ) ) ;
    this.serviceLieu.getTousLesLieux().subscribe( lieux => this.lieux.set( lieux.sort( ( a, b ) => a.num - b.num ) ) ) ;
  }

  chargeExposants()
  {
    this.serviceExposant.getConfigExposants().subscribe( exposants => this.exposants.set( exposants ) ) ;
  }

  // "  Éditions de la Chimère " => "chimere"
  cle( nom: string ): string
  {
    return nom.toLowerCase().normalize( "NFD" ).replace( /[̀-ͯ]/g, "" )
      .replace( /\b(editions?|editeurs?|les|la|le|l|de|du|des|d)\b/g, "" ).replace( /[^a-z0-9]/g, "" ) ;
  }

  onNouveau()
  {
    let exposant = new Exposant() ;
    exposant.type = "éditeur" ;
    this.ouvre( exposant ) ;
  }

  onModifier( exposant: Exposant )
  {
    // copie pour ne pas modifier la liste si on annule
    let copie = Object.assign( new Exposant(), exposant ) ;
    copie.numLieu = exposant.numLieu ?? -1 ;
    this.ouvre( copie ) ;
  }

  private ouvre( exposant: Exposant )
  {
    this.erreur.set( "" ) ;
    this.exposant.set( exposant ) ;
  }

  onAnnuler()
  {
    this.exposant.set( null ) ;
  }

  onEnregistrer()
  {
    let exposant = this.exposant() ;
    if( !exposant ) return ;

    if( !exposant.nom || exposant.nom.trim() == "" )
    {
      this.erreur.set( "Le nom est obligatoire" ) ;
      return ;
    }

    this.serviceExposant.majExposant( exposant ).subscribe( {
      next: () => this.ferme( "Exposant enregistré" ),
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  onSupprimer()
  {
    let exposant = this.exposant() ;
    if( !exposant ) return ;

    this.serviceExposant.supprimeExposant( exposant.id ).subscribe( {
      next: () => this.ferme( "Exposant supprimé" ),
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  ouvreFusion()
  {
    this.rechercheFusion.set( "" ) ;
    this.modalFusion.set( true ) ;
  }

  onChoisirGarde( exposant: Exposant )
  {
    this.modalFusion.set( false ) ;
    this.exposantGarde.set( exposant ) ;
  }

  onFusionner()
  {
    let exposant = this.exposant() ;
    let garde = this.exposantGarde() ;
    if( !exposant || !garde ) return ;

    this.serviceExposant.supprimeExposant( exposant.id, garde.id ).subscribe( {
      next: () => this.ferme( exposant.nom + " fusionné dans " + garde.nom ),
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  private ferme( message: string )
  {
    this.message.set( message ) ;
    this.exposant.set( null ) ;
    this.chargeExposants() ;
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

  nomLieu( lieu: Lieu ): string
  {
    if( !lieu.nom || lieu.nom == lieu.num.toString() ) return lieu.num.toString() ;
    return lieu.num + " | " + lieu.nom ;
  }
}
