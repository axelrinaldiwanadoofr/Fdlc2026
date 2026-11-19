// Auteur: Kevin MEYER - 19/11/2026

import { Component, signal } from '@angular/core';
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
  IonInput,
  IonTextarea,
  IonButton,
  IonNote,
  IonToast,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';

import { ConfigService } from '../../services/config.service';
import { ParametreService } from '../../services/parametre.service';

// Page de config des réglages du festival : ce qui change d'une année à l'autre sans toucher au code
@Component({
  selector: 'app-page-config-reglages',
  templateUrl: './page-config-reglages.page.html',
  styleUrls: ['./page-config-reglages.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonNote,
    IonToast,
    IonIcon,
    FormsModule
  ]
})
export class PageConfigReglagesPage
{
  protected serviceConfig: ConfigService ;
  protected serviceParametre: ParametreService ;
  protected router: Router ;

  protected valeurs = signal<any>( null ) ;
  protected halls = [1, 2, 3, 4, 5] ;
  protected cles = ["titre", "debut", "fin", "lieu", "affiche", "plan1", "plan2", "plan3", "plan4", "plan5", "professeur", "etudiants", "lienLycee", "contact"] ;

  // image en cours d'envoi ("affiche", "plan2"...)
  protected envoi = signal( "" ) ;
  protected erreur = signal( "" ) ;
  protected message = signal( "" ) ;

  constructor( serviceConfig: ConfigService, serviceParametre: ParametreService, router: Router )
  {
    addIcons( { saveOutline } ) ;
    this.serviceConfig = serviceConfig ;
    this.serviceParametre = serviceParametre ;
    this.router = router ;
  }

  // Sans la permission on retourne sur la page principale de config
  ionViewWillEnter()
  {
    if( !this.serviceConfig.connecte() || !this.serviceConfig.peut( "reglages.modifier" ) )
    {
      this.router.navigateByUrl( "/config" ) ;
      return ;
    }

    this.onAnnuler() ;
  }

  onAnnuler()
  {
    let valeurs: any = {} ;
    for( let cle of this.cles ) valeurs[cle] = this.serviceParametre.reglages()[cle] ?? "" ;
    this.erreur.set( "" ) ;
    this.valeurs.set( valeurs ) ;
  }

  // image envoyée, sinon celle d'origine
  apercu( cle: string ): string
  {
    let chemin = this.valeurs()?.[cle] ?? "" ;
    if( chemin != "" ) return chemin ;
    return cle == "affiche" ? "assets/afficheFdlc2026.jpg" : "assets/plans/hall" + cle.substring( 4 ) + ".png" ;
  }

  onFichier( cle: string, event: any )
  {
    let fichier = event.target.files?.[0] ;
    event.target.value = "" ;
    if( !fichier ) return ;

    this.erreur.set( "" ) ;
    this.envoi.set( cle ) ;
    this.serviceParametre.envoieImage( cle, fichier ).subscribe( {
      next: reponse =>
      {
        this.change( cle, reponse.chemin ) ;
        this.envoi.set( "" ) ;
        this.message.set( "Image envoyée, pensez à enregistrer" ) ;
      },
      error: erreur =>
      {
        this.envoi.set( "" ) ;
        this.erreurServeur( erreur ) ;
      }
    }) ;
  }

  onOrigine( cle: string )
  {
    this.change( cle, "" ) ;
  }

  // nouvel objet pour que la page se mette à jour
  private change( cle: string, valeur: string )
  {
    let valeurs = Object.assign( {}, this.valeurs() ) ;
    valeurs[cle] = valeur ;
    this.valeurs.set( valeurs ) ;
  }

  onEnregistrer()
  {
    let valeurs = this.valeurs() ;
    if( !valeurs ) return ;

    for( let cle of this.cles ) valeurs[cle] = ( valeurs[cle] ?? "" ).trim() ;

    if( valeurs.titre == "" || valeurs.debut == "" || valeurs.fin == "" )
    {
      this.erreur.set( "Le nom et les dates du festival sont obligatoires" ) ;
      return ;
    }
    if( valeurs.fin < valeurs.debut )
    {
      this.erreur.set( "Le dernier jour doit être après le premier" ) ;
      return ;
    }
    if( valeurs.lienLycee != "" && !/^https?:\/\/\S+$/.test( valeurs.lienLycee ) )
    {
      this.erreur.set( "Le lien du lycée doit commencer par https://" ) ;
      return ;
    }

    this.erreur.set( "" ) ;
    this.serviceParametre.majReglages( valeurs ).subscribe( {
      next: () => this.message.set( "Réglages enregistrés" ),
      error: erreur => this.erreurServeur( erreur )
    }) ;
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
