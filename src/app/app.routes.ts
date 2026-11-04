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
  {
    path: 'page-exposant/:id',
    loadComponent: () => import('./page-exposant/page-exposant.page').then( m => m.PageExposantPage)
  },
  {
    path: 'page-lieu/:num',
    loadComponent: () => import('./page-lieu/page-lieu.page').then( m => m.PageLieuPage)
  },
  {
    // Affiche les détails de la personne correspondant à l'identifiant
    path: 'page-personne/:id',
    loadComponent: () => import('./page-personne/page-personne.page')
      .then(m => m.PagePersonnePage)
  },
  {
    path: 'page-planning-personnel',
    loadComponent: () => import('./page-planning-personnel/page-planning-personnel.page').then( m => m.PagePlanningPersonnelPage)
  },
  {
    path: 'page-lieu',
    loadComponent: () => import('./page-lieu/page-lieu.page').then( m => m.PageLieuPage)
  },

];
