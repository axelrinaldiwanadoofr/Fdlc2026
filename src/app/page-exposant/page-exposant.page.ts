import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-page-exposant',
  templateUrl: './page-exposant.page.html',
  styleUrls: ['./page-exposant.page.scss'],
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule]
})
export class PageExposantPage implements OnInit 
{
  public id = input<number>( -1 ) ;

  constructor() 
  { 

  }

  ngOnInit() 
  {
  }

}
