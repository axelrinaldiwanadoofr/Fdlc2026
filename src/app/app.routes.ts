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
  
  // Page de détail accessible avec l'identifiant d'un événement
  {
    path: 'page-evenement/:id',
    loadComponent: () =>
      import('./page-evenement/page-evenement.component')
        .then(m => m.PageEvenementComponent)
  },
  // Accès depuis le menu : un message demande de choisir un événement
  {
    path: 'page-evenement',
    loadComponent: () =>
      import('./page-evenement/page-evenement.component')
        .then(m => m.PageEvenementComponent)
  },

];
