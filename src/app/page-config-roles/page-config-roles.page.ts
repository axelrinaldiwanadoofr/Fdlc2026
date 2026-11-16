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
  IonItemDivider,
  IonLabel,
  IonInput,
  IonToggle,
  IonButton,
  IonIcon,
  IonNote,
  IonToast,
  IonAlert,
  IonReorderGroup,
  IonReorder,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { lockClosedOutline, addOutline } from 'ionicons/icons';

import { ConfigService } from '../../services/config.service';
import { Role } from '../../modeles/Role';

// Rôles et permissions, comme les rôles d'un serveur Discord :
// la liste à gauche (du plus haut au plus bas), les interrupteurs de permissions à droite
@Component({
  selector: 'app-page-config-roles',
  templateUrl: './page-config-roles.page.html',
  styleUrls: ['./page-config-roles.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonInput,
    IonToggle,
    IonButton,
    IonIcon,
    IonNote,
    IonToast,
    IonAlert,
    IonReorderGroup,
    IonReorder,
    FormsModule
  ]
})
export class PageConfigRolesPage
{
  protected serviceConfig: ConfigService ;
  protected router: Router ;

  protected roles = signal<Role[]>( [] ) ;
  protected groupes = signal<Array<{ nom: string, permissions: Array<{ code: string, texte: string }> }>>( [] ) ;
  protected monNiveau = signal(0) ;

  // au-dessus de soi : affichés mais fixes ; en dessous : déplaçables à la souris ou au doigt
  protected rolesFixes = computed( () => this.roles().filter( r => !r.modifiable ) ) ;
  protected rolesDeplacables = computed( () => this.roles().filter( r => r.modifiable ) ) ;

  // rôle affiché à droite (copie) et sa version enregistrée pour voir s'il a changé
  protected role = signal<Role | null>( null ) ;
  private original: string = "" ;
  protected version = signal(0) ;
  protected modifie = computed( () => this.version() >= 0 && this.role() != null && this.empreinte( this.role() ) != this.original ) ;

  protected erreur = signal("") ;
  protected message = signal("") ;
  protected alerteSupprimer = signal(false) ;

  protected readonly boutonsSupprimer = [
    { text: "Annuler", role: "cancel" },
    { text: "Supprimer", role: "destructive", handler: () => this.onSupprimer() }
  ] ;

  constructor( serviceConfig: ConfigService, router: Router )
  {
    this.serviceConfig = serviceConfig ;
    this.router = router ;
    addIcons( { lockClosedOutline, addOutline } ) ;
  }

  ionViewWillEnter()
  {
    if( !this.serviceConfig.peut( "roles.gerer" ) )
    {
      this.router.navigateByUrl( "/config" ) ;
      return ;
    }
    this.chargeRoles( -1 ) ;
  }

  // recharge la liste puis réaffiche le rôle idChoisi
  chargeRoles( idChoisi: number )
  {
    this.serviceConfig.getRoles().subscribe( reponse =>
    {
      this.roles.set( reponse.roles ) ;
      this.groupes.set( reponse.groupes ) ;
      this.monNiveau.set( reponse.monNiveau ) ;

      let role = reponse.roles.find( r => r.id == idChoisi ) ?? reponse.roles.find( r => r.modifiable ) ;
      if( role ) this.choisir( role ) ;
      else this.role.set( null ) ;
    }) ;
  }

  choisir( role: Role )
  {
    this.erreur.set( "" ) ;
    let copie = Object.assign( new Role(), role ) ;
    copie.permissions = role.permissions.slice() ;
    this.original = this.empreinte( copie ) ;
    this.role.set( copie ) ;
    this.touche() ;
  }

  // le rôle en texte, permissions triées, pour savoir s'il a changé
  private empreinte( role: Role | null ): string
  {
    if( !role ) return "" ;
    return JSON.stringify( [ role.nom, role.couleur, role.permissions.slice().sort() ] ) ;
  }

  onNouveau()
  {
    let role = new Role() ;
    role.nom = "Nouveau rôle" ;

    // un nouveau rôle arrive tout en bas, on le glisse ensuite à sa place
    let plusBas = this.rolesDeplacables().at( -1 ) ;
    role.niveau = plusBas ? Math.max( 1, plusBas.niveau - 1 ) : 1 ;
    this.original = "" ;
    this.erreur.set( "" ) ;
    this.role.set( role ) ;
    this.touche() ;
  }

  // les champs modifient la copie directement : on relance la comparaison
  touche()
  {
    this.version.set( this.version() + 1 ) ;
  }

  // glisser-déposer : le serveur réattribue les niveaux dans le nouvel ordre
  onDeplace( event: any )
  {
    let liste = this.rolesDeplacables().slice() ;
    let deplace = liste.splice( event.detail.from, 1 )[0] ;
    liste.splice( event.detail.to, 0, deplace ) ;
    event.detail.complete( false ) ;

    if( event.detail.from == event.detail.to ) return ;
    this.roles.set( this.rolesFixes().concat( liste ) ) ;

    this.serviceConfig.ordreRoles( liste.map( r => r.id ) ).subscribe( {
      next: () =>
      {
        this.message.set( "Ordre des rôles enregistré" ) ;
        this.chargeRoles( this.role()?.id ?? -1 ) ;
      },
      error: erreur =>
      {
        this.erreur.set( erreur.error?.erreur ?? "Erreur lors du déplacement" ) ;
        this.chargeRoles( this.role()?.id ?? -1 ) ;
      }
    }) ;
  }

  estAutorisee( code: string ): boolean
  {
    return this.role()?.permissions.includes( code ) ?? false ;
  }

  // on ne donne que les permissions qu'on a soi-même
  peutDonner( code: string ): boolean
  {
    let role = this.role() ;
    return role != null && role.modifiable && this.serviceConfig.peut( code ) ;
  }

  onBascule( code: string, autorise: boolean )
  {
    let role = this.role() ;
    if( !role ) return ;
    role.permissions = role.permissions.filter( c => c != code ) ;
    if( autorise ) role.permissions.push( code ) ;
    this.touche() ;
  }

  onAnnuler()
  {
    let role = this.roles().find( r => r.id == this.role()?.id ) ;
    if( role ) this.choisir( role ) ;
    else this.chargeRoles( -1 ) ;
  }

  onEnregistrer()
  {
    let role = this.role() ;
    if( !role ) return ;

    this.serviceConfig.majRole( role ).subscribe( {
      next: reponse =>
      {
        this.message.set( "Rôle enregistré" ) ;
        this.chargeRoles( reponse.id ) ;
      },
      error: erreur => this.erreur.set( erreur.error?.erreur ?? "Erreur lors de l'enregistrement" )
    }) ;
  }

  onSupprimer()
  {
    let role = this.role() ;
    if( !role ) return ;

    this.serviceConfig.supprimeRole( role.id ).subscribe( {
      next: () =>
      {
        this.message.set( "Rôle supprimé" ) ;
        this.chargeRoles( -1 ) ;
      },
      error: erreur => this.erreur.set( erreur.error?.erreur ?? "Erreur lors de la suppression" )
    }) ;
  }
}
