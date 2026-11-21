// Auteur: Kevin MEYER - 19/11/2026

import { Component, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonToast,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { shareSocialOutline, copyOutline, downloadOutline } from 'ionicons/icons';
import qrcode from 'qrcode-generator';

import { ParametreService } from '../../services/parametre.service';

// Page pour faire passer l'appli à ses proches : QR code, lien à envoyer ou à copier
@Component({
  selector: 'app-page-partager',
  templateUrl: './page-partager.page.html',
  styleUrls: ['./page-partager.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonToast
  ]
})
export class PagePartagerPage
{
  protected serviceParametre: ParametreService ;

  // adresse de l'appli, celle du serveur où elle est installée
  protected adresse: string = document.baseURI ;
  protected adresseCourte: string = this.adresse.replace( /^https?:\/\//, "" ).replace( /\/$/, "" ) ;

  // QR code : carrés noirs dessinés en un seul chemin SVG, avec une marge de 4 carrés
  protected modules: boolean[][] = [] ;
  protected taille: number = 0 ;
  protected chemin: string = "" ;

  protected message = signal( "" ) ;

  // image du QR code préparée à l'ouverture : sur iPhone le partage doit partir tout de suite après le toucher
  private image: File | null = null ;

  constructor( serviceParametre: ParametreService )
  {
    addIcons( { shareSocialOutline, copyOutline, downloadOutline } ) ;
    this.serviceParametre = serviceParametre ;
    this.creeQrCode() ;
    this.creeImage() ;
  }

  creeQrCode()
  {
    let qr = qrcode( 0, "M" ) ;
    qr.addData( this.adresse ) ;
    qr.make() ;

    let nb = qr.getModuleCount() ;
    for( let ligne = 0 ; ligne < nb ; ligne++ )
    {
      this.modules.push( [] ) ;
      for( let colonne = 0 ; colonne < nb ; colonne++ )
      {
        this.modules[ligne].push( qr.isDark( ligne, colonne ) ) ;
        if( qr.isDark( ligne, colonne ) ) this.chemin += "M" + ( colonne + 4 ) + " " + ( ligne + 4 ) + "h1v1h-1z" ;
      }
    }
    this.taille = nb + 8 ;
  }

  // Partage l'image du QR code avec le lien, sinon le lien seul, sinon on le copie (ordinateur sans partage)
  onPartager()
  {
    let titre = this.serviceParametre.reglages().titre ;
    let texte = "L'appli du " + titre + " : programme, plan et auteurs" ;
    let partage: Promise<void> | null = null ;

    if( this.image && navigator.canShare?.( { files: [this.image] } ) )
      partage = navigator.share( { files: [this.image], title: titre, text: texte + " " + this.adresse } ) ;
    else if( navigator.share )
      partage = navigator.share( { title: titre, text: texte, url: this.adresse } ) ;

    if( !partage ) this.onCopier() ;
    else partage.catch( erreur => { if( erreur?.name != "AbortError" ) this.onCopier() ; } ) ;
  }

  // Copie le lien, avec l'ancienne méthode quand le navigateur n'a pas le presse-papier moderne
  onCopier()
  {
    if( navigator.clipboard && isSecureContext )
    {
      navigator.clipboard.writeText( this.adresse ).then( () => this.message.set( "Lien copié" ), () => this.copieAncienne() ) ;
      return ;
    }
    this.copieAncienne() ;
  }

  private copieAncienne()
  {
    let zone = document.createElement( "textarea" ) ;
    zone.value = this.adresse ;
    zone.style.position = "fixed" ;
    zone.style.opacity = "0" ;
    document.body.appendChild( zone ) ;
    zone.select() ;
    let ok = document.execCommand( "copy" ) ;
    zone.remove() ;
    this.message.set( ok ? "Lien copié" : "Copie impossible, le lien est écrit sous le QR code" ) ;
  }

  // Image PNG de 1000 px environ, nette à l'impression
  private creeImage()
  {
    let echelle = Math.floor( 1000 / this.taille ) ;
    let canvas = document.createElement( "canvas" ) ;
    canvas.width = canvas.height = this.taille * echelle ;

    let contexte = canvas.getContext( "2d" ) ;
    if( !contexte ) return ;
    contexte.fillStyle = "#ffffff" ;
    contexte.fillRect( 0, 0, canvas.width, canvas.height ) ;
    contexte.fillStyle = "#1c1f3a" ;
    for( let ligne = 0 ; ligne < this.modules.length ; ligne++ )
      for( let colonne = 0 ; colonne < this.modules.length ; colonne++ )
        if( this.modules[ligne][colonne] ) contexte.fillRect( ( colonne + 4 ) * echelle, ( ligne + 4 ) * echelle, echelle, echelle ) ;

    canvas.toBlob( blob =>
    {
      if( blob ) this.image = new File( [blob], "qr-code-festival-du-livre.png", { type: "image/png" } ) ;
    }, "image/png" ) ;
  }

  onTelecharger()
  {
    if( !this.image ) return ;
    let adresse = URL.createObjectURL( this.image ) ;
    let lien = document.createElement( "a" ) ;
    lien.href = adresse ;
    lien.download = this.image.name ;
    lien.click() ;
    setTimeout( () => URL.revokeObjectURL( adresse ), 1000 ) ;
  }
}
