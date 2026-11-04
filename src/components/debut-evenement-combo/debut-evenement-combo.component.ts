import { Component, OnInit, OnChanges, input, output, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from "rxjs" ;

import { DebutEvenementService } from '../../servcies/debut-evenement.service';

import {
  IonInput,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
} from '@ionic/angular';

@Component({
  selector: 'app-debut-evenement-combo',
  templateUrl: './debut-evenement-combo.component.html',
  styleUrls: ['./debut-evenement-combo.component.scss'],
  imports: [
    IonInput,
    IonList,
    IonItem,
    IonCard,
    IonCardContent,
    AsyncPipe,
    FormsModule
  ],
})
export class DebutEvenementComboComponent implements OnInit, OnChanges
{
  protected listeDebuts: Observable<Array<string>> | null = null ;
  protected serviceDebut: DebutEvenementService ;

  // Texte saisi par l'utilisateur
  protected debutSaisi: string = "" ;

  // Affichage de la liste (signal : actualise l'affichage quand la valeur change)
  protected showList = signal(false) ;

  // Communication avec le web component parent
  public label = input("Début") ;
  public debut = input("") ;                    // borne inférieure
  public onDebutSelected = output<string>() ;

  constructor( serviceDebut: DebutEvenementService )
  {
    this.serviceDebut = serviceDebut ;
  }

  ngOnInit()
  {
    this.listeDebuts = this.serviceDebut.getDebuts( this.debut(), "" ) ;
  }

  // Rafraîchit la liste quand la borne inférieure change
  ngOnChanges()
  {
    this.listeDebuts = this.serviceDebut.getDebuts( this.debut(), this.debutSaisi ) ;
  }

  // Exécuté à chaque modification du texte saisi
  onDebutChanged( event: any )
  {
    this.listeDebuts = this.serviceDebut.getDebuts( this.debut(), this.debutSaisi ) ;
    this.showList.set( true ) ;
    this.onDebutSelected.emit( this.debutSaisi ) ;
  }

  // Exécuté quand on clique sur une ligne de la liste
  onClickDebutSelected( debut: string )
  {
    this.showList.set( false ) ;
    this.debutSaisi = debut ;
    this.onDebutSelected.emit( this.debutSaisi ) ;
  }

  // Affiche ou masque la liste au clic sur le champ
  onInputClick( event: MouseEvent )
  {
    this.showList.set( !this.showList() ) ;
  }

  masqueListe()
  {
    this.showList.set( false ) ;
  }
} 