// Auteur: Kevin MEYER - 16/11/2026

import { Component, OnChanges, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonList,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonButton,
  IonNote,
  IonAlert,
} from '@ionic/angular';

import { ConfigService } from '../../services/config.service';
import { Compte } from '../../modeles/Compte';
import { Role } from '../../modeles/Role';

// Accès d'une personne à la configuration : identifiant, rôle et mot de passe
@Component({
  selector: 'app-acces-compte',
  templateUrl: './acces-compte.component.html',
  styleUrls: ['./acces-compte.component.scss'],
  imports: [
    IonList,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonButton,
    IonNote,
    IonAlert,
    FormsModule
  ],
})
export class AccesCompteComponent implements OnChanges
{
  public idPersonne = input.required<number>() ;
  public prenom = input<string>( "" ) ;
  public nom = input<string>( "" ) ;
  public onModifie = output<void>() ;

  protected serviceConfig: ConfigService ;

  protected compte = signal<Compte | null>( null ) ;
  protected roles = signal<Role[]>( [] ) ;
  protected identifiant: string = "" ;
  protected erreur = signal("") ;
  protected charge = signal(false) ;

  // mot de passe à donner à la personne, affiché une seule fois
  protected mdpDonne = signal("") ;
  protected alerteNouveauMdp = signal(false) ;
  protected alerteSupprimer = signal(false) ;

  // rôles qu'on peut donner : en dessous du sien
  protected rolesPossibles = computed( () =>
  {
    let moi = this.serviceConfig.compte() ;
    return this.roles().filter( r => moi?.estRoot || r.niveau < ( moi?.niveau ?? 0 ) ) ;
  }) ;

  protected boutonsMdp = [
    { text: "Annuler", role: "cancel" },
    { text: "Générer", handler: () => this.enregistre( this.compte(), true ) }
  ] ;

  protected boutonsSupprimer = [
    { text: "Annuler", role: "cancel" },
    { text: "Supprimer", role: "destructive", handler: () => this.onSupprimer() }
  ] ;

  constructor( serviceConfig: ConfigService )
  {
    this.serviceConfig = serviceConfig ;
  }

  ngOnChanges()
  {
    this.charge.set( false ) ;
    this.erreur.set( "" ) ;
    this.serviceConfig.getRoles().subscribe( reponse => this.roles.set( reponse.roles ) ) ;
    this.chargeCompte() ;
  }

  private chargeCompte()
  {
    this.serviceConfig.getComptes( this.idPersonne() ).subscribe( comptes =>
    {
      let compte = comptes.length > 0 ? comptes[0] : null ;
      this.compte.set( compte ) ;
      this.identifiant = compte ? compte.identifiant : this.identifiantPropose() ;
      this.charge.set( true ) ;
    }) ;
  }

  // "Marie-Claire Vitoux" => "marie-claire.vitoux"
  private identifiantPropose(): string
  {
    let nettoie = ( texte: string ) => texte.toLowerCase().normalize( "NFD" ).replace( /[̀-ͯ]/g, "" ).replace( /[^a-z0-9-]/g, "" ) ;
    return [ nettoie( this.prenom() ), nettoie( this.nom() ) ].filter( t => t != "" ).join( "." ).substring( 0, 50 ) ;
  }

  onBasculeAcces( actif: boolean )
  {
    let compte = this.compte() ;

    // première activation : création du compte avec le plus petit rôle
    if( !compte )
    {
      if( !actif ) return ;
      let roles = this.rolesPossibles() ;
      if( roles.length == 0 )
      {
        this.erreur.set( "Aucun rôle en dessous du vôtre à donner" ) ;
        return ;
      }
      compte = new Compte() ;
      compte.idPersonne = this.idPersonne() ;
      compte.identifiant = this.identifiant ;
      compte.idRole = roles[roles.length - 1].id ;
    }

    compte.actif = actif ? 1 : 0 ;
    this.enregistre( compte, false ) ;
  }

  onChangeRole( idRole: number )
  {
    let compte = this.compte() ;
    if( !compte || compte.idRole == idRole ) return ;
    compte.idRole = idRole ;
    this.enregistre( compte, false ) ;
  }

  onChangeIdentifiant()
  {
    let compte = this.compte() ;
    if( !compte || this.identifiant.trim() == compte.identifiant ) return ;
    compte.identifiant = this.identifiant.trim() ;
    this.enregistre( compte, false ) ;
  }

  enregistre( compte: Compte | null, nouveauMdp: boolean )
  {
    if( !compte ) return ;
    this.erreur.set( "" ) ;

    this.serviceConfig.majCompte( compte, nouveauMdp ).subscribe( {
      next: reponse =>
      {
        if( reponse.mdp ) this.mdpDonne.set( reponse.mdp ) ;
        this.chargeCompte() ;
        this.onModifie.emit() ;
      },
      error: erreur =>
      {
        this.erreur.set( erreur.error?.erreur ?? "Erreur lors de l'enregistrement" ) ;
        this.chargeCompte() ;
      }
    }) ;
  }

  onSupprimer()
  {
    let compte = this.compte() ;
    if( !compte ) return ;

    this.serviceConfig.supprimeCompte( compte.id ).subscribe( {
      next: () =>
      {
        this.chargeCompte() ;
        this.onModifie.emit() ;
      },
      error: erreur => this.erreur.set( erreur.error?.erreur ?? "Erreur lors de la suppression" )
    }) ;
  }

  copieMdp()
  {
    navigator.clipboard?.writeText( this.mdpDonne() ) ;
  }

  // "2026-11-21 14:30:00" => "21/11/2026 à 14h30"
  dateConnexion( date: string ): string
  {
    if( !date ) return "jamais" ;
    return date.substring( 8, 10 ) + "/" + date.substring( 5, 7 ) + "/" + date.substring( 0, 4 ) + " à " + date.substring( 11, 13 ) + "h" + date.substring( 14, 16 ) ;
  }
}
