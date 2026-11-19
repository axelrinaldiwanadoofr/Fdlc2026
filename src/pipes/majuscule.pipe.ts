// Auteur: Kevin MEYER - 19/11/2026

import { Pipe, PipeTransform } from '@angular/core';

// Première lettre en majuscule : "animateur" -> "Animateur"
@Pipe({
  name: 'majuscule'
})
export class MajusculePipe implements PipeTransform
{
  transform( texte: string | null | undefined ): string
  {
    if( !texte ) return "" ;
    return texte.charAt( 0 ).toUpperCase() + texte.slice( 1 ) ;
  }
}
