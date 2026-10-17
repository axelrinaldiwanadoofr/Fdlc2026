import { Component, OnInit } from '@angular/core';
import { 
  IonSelect,
  IonSelectOption
 } from '@ionic/angular';

@Component({
  selector: 'app-nom-lieu-combo',
  templateUrl: './nom-lieu-combo.component.html',
  styleUrls: ['./nom-lieu-combo.component.scss'],
  imports: [
    IonSelect,
    IonSelectOption    
  ],
})
export class NomLieuComboComponent  implements OnInit 
{

  constructor() 
  { 

  }

  ngOnInit() 
  {

  }

}
