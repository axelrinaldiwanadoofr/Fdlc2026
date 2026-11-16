// Auteur: Kevin MEYER - 16/11/2026

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { ConfigService } from './config.service';

// Ajoute le jeton de la session à chaque envoi vers le PHP
export const jetonInterceptor: HttpInterceptorFn = ( requete, suivant ) =>
{
  let jeton = inject( ConfigService ).jeton() ;
  if( requete.method == "GET" || jeton == "" ) return suivant( requete ) ;
  return suivant( requete.clone( { setHeaders: { "X-Jeton": jeton } } ) ) ;
} ;
