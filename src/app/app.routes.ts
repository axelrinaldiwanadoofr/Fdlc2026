import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'liste-exposants-page',
    loadComponent: () => import('./liste-exposants-page/liste-exposants-page.page').then(m => m.ListeExposantsPagePage)
  },
  {
    path: 'liste-livres-page',
    loadComponent: () => import('./liste-livres-page/liste-livres-page.page').then(m => m.ListeLivresPagePage)
  },
  {
    path: 'page-livre/:id',
    loadComponent: () => import('./page-livre/page-livre.page').then(m => m.PageLivrePage)
  },
  {
    path: '',
    loadComponent: () => import('./accueil/accueil.page').then(m => m.AccueilPage)
  },
  // Page de détail conservée de la branche kissangou-mabiala
  {
    path: 'page-evenement/:id',
    loadComponent: () => import('./page-evenement/page-evenement.component').then(m => m.PageEvenementComponent)
  },
  {
    path: 'page-evenement',
    loadComponent: () => import('./page-evenement/page-evenement.component').then(m => m.PageEvenementComponent)
  },
  {
    path: 'page-exposant/:id',
    loadComponent: () => import('./page-exposant/page-exposant.page').then(m => m.PageExposantPage)
  },
  {
    path: 'page-personne/:id',
    loadComponent: () => import('./page-personne/page-personne.page').then(m => m.PagePersonnePage)
  },
  {
    path: 'plans',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage)
  },
  {
    path: 'plans/:numHall',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage)
  },
  {
    path: 'config',
    loadComponent: () => import('./page-config/page-config.page').then(m => m.PageConfigPage)
  },
  {
    path: 'config-plan',
    loadComponent: () => import('./page-config-plan/page-config-plan.page').then(m => m.PageConfigPlanPage)
  },
  {
    path: 'config-evenement',
    loadComponent: () => import('./page-config-evenement/page-config-evenement.page').then(m => m.PageConfigEvenementPage)
  },
  {
    path: 'page-planning-personnel',
    loadComponent: () => import('./page-planning-personnel/page-planning-personnel.page').then(m => m.PagePlanningPersonnelPage)
  },
  {
    path: 'page-liste-personnes',
    loadComponent: () => import('./page-liste-personnes/page-liste-personnes.page').then(m => m.PageListePersonnesPage)
  },
  {
    path: 'page-liste-evenements',
    loadComponent: () => import('./page-liste-evenements/page-liste-evenements.page').then(m => m.PageListeEvenementsPage)
  }
];
