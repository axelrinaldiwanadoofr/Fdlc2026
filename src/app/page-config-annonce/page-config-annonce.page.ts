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
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonButton,
  IonNote,
  IonToast,
  IonAlert,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';

import { ConfigService } from '../../services/config.service';
import { AnnonceService } from '../../services/annonce.service';
import { ParametreService } from '../../services/parametre.service';
import { Annonce } from '../../modeles/Annonce';

// Page de config des annonces affichées sur l'accueil
@Component({
  selector: 'app-page-config-annonce',
  templateUrl: './page-config-annonce.page.html',
  styleUrls: ['./page-config-annonce.page.scss'],
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
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonButton,
    IonNote,
    IonToast,
    IonAlert,
    FormsModule
  ]
})
export class PageConfigAnnoncePage
{
  protected serviceConfig: ConfigService ;
  protected serviceAnnonce: AnnonceService ;
  protected serviceParametre: ParametreService ;
  protected router: Router ;

  protected annonces = signal<Array<Annonce>>( [] ) ;

  // Annonce en cours de modification (null = on affiche la liste)
  protected annonce = signal<Annonce | null>( null ) ;
  protected erreur = signal("") ;
  protected message = signal("") ;
  protected alerteSupprimer = signal(false) ;

  protected boutonsSupprimer = [
    { text: "Annuler", role: "cancel" },
    { text: "Supprimer", role: "destructive", handler: () => this.onSupprimer() }
  ] ;

  // les annonces ne peuvent être datées que pendant le festival
  protected dateMin = computed( () => this.serviceParametre.reglages().debut + "T00:00" ) ;
  protected dateMax = computed( () => this.serviceParametre.reglages().fin + "T23:59" ) ;

  protected couleurs = [
    { valeur: "primary", nom: "Information" },
    { valeur: "warning", nom: "Important" },
    { valeur: "danger", nom: "Urgent" }
  ] ;

  constructor( serviceConfig: ConfigService, serviceAnnonce: AnnonceService, serviceParametre: ParametreService, router: Router )
  {
    addIcons( { addOutline } ) ;
    this.serviceConfig = serviceConfig ;
    this.serviceAnnonce = serviceAnnonce ;
    this.serviceParametre = serviceParametre ;
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

    this.chargeAnnonces() ;
  }

  chargeAnnonces()
  {
    this.serviceAnnonce.getAnnonces( true ).subscribe( annonces => this.annonces.set( annonces ) ) ;
  }

  onNouvelle()
  {
    this.ouvre( new Annonce() ) ;
  }

  onModifier( annonce: Annonce )
  {
    // copie pour ne pas modifier la liste si on annule
    let copie = Object.assign( new Annonce(), annonce ) ;
    copie.debut = this.dateInput( annonce.debut ) ;
    copie.fin = this.dateInput( annonce.fin ) ;
    this.ouvre( copie ) ;
  }

  private ouvre( annonce: Annonce )
  {
    this.erreur.set( "" ) ;
    this.annonce.set( annonce ) ;
  }

  onAnnuler()
  {
    this.annonce.set( null ) ;
  }

  onEnregistrer()
  {
    let annonce = this.annonce() ;
    if( !annonce ) return ;

    if( annonce.texte.trim() == "" )
    {
      this.erreur.set( "Le texte est obligatoire" ) ;
      return ;
    }

    if( ( annonce.debut && ( annonce.debut < this.dateMin() || annonce.debut > this.dateMax() ) ) ||
        ( annonce.fin && ( annonce.fin < this.dateMin() || annonce.fin > this.dateMax() ) ) )
    {
      this.erreur.set( "Les dates doivent être pendant le festival (" + this.serviceParametre.dates() + ")" ) ;
      return ;
    }

    if( annonce.debut && annonce.fin && annonce.fin <= annonce.debut )
    {
      this.erreur.set( "La fin doit être après le début" ) ;
      return ;
    }

    this.serviceAnnonce.majAnnonce( annonce ).subscribe( {
      next: () => this.ferme( "Annonce enregistrée" ),
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  onSupprimer()
  {
    let annonce = this.annonce() ;
    if( !annonce ) return ;

    this.serviceAnnonce.supprimeAnnonce( annonce.id ).subscribe( {
      next: () => this.ferme( "Annonce supprimée" ),
      error: erreur => this.erreurServeur( erreur )
    }) ;
  }

  private ferme( message: string )
  {
    this.message.set( message ) ;
    this.annonce.set( null ) ;
    this.chargeAnnonces() ;
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

  // Affichée maintenant, pas encore, terminée ou désactivée
  etat( annonce: Annonce ): string
  {
    let maintenant = this.dateInput( new Date().toISOString() ) ;
    if( annonce.active != 1 ) return "Désactivée" ;
    if( annonce.debut && this.dateInput( annonce.debut ) > maintenant ) return "Programmée" ;
    if( annonce.fin && this.dateInput( annonce.fin ) <= maintenant ) return "Terminée" ;
    return "Affichée" ;
  }

  nomCouleur( valeur: string ): string
  {
    return this.couleurs.find( c => c.valeur == valeur )?.nom ?? "" ;
  }

  // "2026-11-21 14:30:00" (BD) => "2026-11-21T14:30" (champ datetime-local)
  private dateInput( date: string | null ): string
  {
    if( !date ) return "" ;
    return date.replace( " ", "T" ).substring( 0, 16 ) ;
  }
}
