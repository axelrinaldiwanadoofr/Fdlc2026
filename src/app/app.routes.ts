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
  {
    path: 'accueil',
    redirectTo: '',
    pathMatch: 'full'
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
    path: 'config-mes-donnees',
    loadComponent: () => import('./page-config-mes-donnees/page-config-mes-donnees.page').then(m => m.PageConfigMesDonneesPage)
  },
  {
    path: 'donnees-personnelles',
    loadComponent: () => import('./page-donnees-personnelles/page-donnees-personnelles.page').then(m => m.PageDonneesPersonnellesPage)
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
    path: 'config-personne',
    loadComponent: () => import('./page-config-personne/page-config-personne.page').then( m => m.PageConfigPersonnePage)
  },
  {
    path: 'config-exposant',
    loadComponent: () => import('./page-config-exposant/page-config-exposant.page').then( m => m.PageConfigExposantPage)
  },
  {
    path: 'config-livre',
    loadComponent: () => import('./page-config-livre/page-config-livre.page').then( m => m.PageConfigLivrePage)
  },
  {
    path: 'config-controle',
    loadComponent: () => import('./page-config-controle/page-config-controle.page').then( m => m.PageConfigControlePage)
  },
  {
    path: 'config-annonce',
    loadComponent: () => import('./page-config-annonce/page-config-annonce.page').then( m => m.PageConfigAnnoncePage)
  },
  {
    path: 'config-comptes',
    loadComponent: () => import('./page-config-comptes/page-config-comptes.page').then( m => m.PageConfigComptesPage)
  },
  {
    path: 'config-roles',
    loadComponent: () => import('./page-config-roles/page-config-roles.page').then( m => m.PageConfigRolesPage)
  },
  {
    path: 'config-journal',
    loadComponent: () => import('./page-config-journal/page-config-journal.page').then( m => m.PageConfigJournalPage)
  },
  {
    path: 'config-lieu',
    loadComponent: () => import('./page-config-lieu/page-config-lieu.page').then( m => m.PageConfigLieuPage)
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
    loadComponent: () => import('./page-liste-evenements/page-liste-evenements.page').then( m => m.PageListeEvenementsPage)  
  },
  {
    path: 'page-liste-lieux',
    loadComponent: () => import('./page-liste-lieux/page-liste-lieux.page').then( m => m.PageListeLieuxPage)
  },
  {
    // Détail d'un lieu, ex : /page-lieu/302 (num => input num de la page)
    path: 'page-lieu/:num',
    loadComponent: () => import('./page-lieu/page-lieu.page').then( m => m.PageLieuPage)
  },
  {
    path: 'a-propos',
    loadComponent: () => import('./page-a-propos/page-a-propos.page').then( m => m.PageAProposPage)
  },
  // URL inconnue : retour a l'accueil
  {
    path: '**',
    redirectTo: ''
  }
];
