import { Routes } from '@angular/router';

export const routes: Routes = [
  /*{
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },*/
  {
    path: 'liste-exposants-page',
    loadComponent: () => import('./liste-exposants-page/liste-exposants-page.page').then( m => m.ListeExposantsPagePage)
  },
  {
    path: '',
    loadComponent: () => import('./accueil/accueil.page').then( m => m.AccueilPage)
  },
  
  //on en ajoute 1 pour le kiff
  {
    path: 'page-evenement',
    loadComponent: () =>
      import('./page-evenement/page-evenement.component')
        .then(m => m.PageEvenementComponent)
  },

];
