import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules, withHashLocation } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { jetonInterceptor } from './services/jeton.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular( { backButtonText: "" } ),
    provideHttpClient( withInterceptors( [ jetonInterceptor ] ) ),
    // adresses en #/plans : marchent sur le serveur du lycée sans réglage (actualiser, lien partagé)
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding(), withHashLocation()),
  ],
});

// garde le site et les données du festival pour quand le réseau du salon sature (sw.js)
if( "serviceWorker" in navigator && !isDevMode() ) navigator.serviceWorker.register( "sw.js" ).catch( () => {} ) ;
