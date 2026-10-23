import { Component, OnInit } from '@angular/core';
import { 
  IonSelect,
  IonSelectOption
 } from '@ionic/angular';

@Component({
  selector: 'app-nom-personne-combo',
  templateUrl: './nom-personne-combo.component.html',
  styleUrls: ['./nom-personne-combo.component.scss'],
  imports: [
    IonSelect,
    IonSelectOption    
  ],
})
export class NomPersonneComboComponent  implements OnInit 
{

  constructor() 
  { 

  }

  ngOnInit() 
  {

  }

}
