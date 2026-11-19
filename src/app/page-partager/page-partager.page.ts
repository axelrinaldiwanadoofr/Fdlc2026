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
  protected partageDisponible: boolean = !!navigator.share ;

  // QR code : carrés noirs dessinés en un seul chemin SVG, avec une marge de 4 carrés
  protected modules: boolean[][] = [] ;
  protected taille: number = 0 ;
  protected chemin: string = "" ;

  protected message = signal( "" ) ;

  constructor( serviceParametre: ParametreService )
  {
    addIcons( { shareSocialOutline, copyOutline, downloadOutline } ) ;
    this.serviceParametre = serviceParametre ;
    this.creeQrCode() ;
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

  // Ouvre le partage du téléphone (SMS, WhatsApp, mail...)
  onPartager()
  {
    let titre = this.serviceParametre.reglages().titre ;
    navigator.share( { title: titre, text: "L'appli du " + titre + " : programme, plan et auteurs", url: this.adresse } )
      .catch( () => {} ) ;
  }

  onCopier()
  {
    if( !navigator.clipboard )
    {
      this.message.set( "Copie impossible sur ce navigateur" ) ;
      return ;
    }
    navigator.clipboard.writeText( this.adresse ).then(
      () => this.message.set( "Lien copié" ),
      () => this.message.set( "Copie impossible sur ce navigateur" ) ) ;
  }

  // Image PNG de 1000 px environ, nette à l'impression
  onTelecharger()
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

    let lien = document.createElement( "a" ) ;
    lien.href = canvas.toDataURL( "image/png" ) ;
    lien.download = "qr-code-festival-du-livre.png" ;
    lien.click() ;
  }
}
