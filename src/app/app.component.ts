import { Component, signal } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { 
  IonApp, 
  IonMenu,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonFooter,
  IonList,
  IonItem,
  IonMenuToggle,
  IonIcon,
  IonLabel,
  IonRouterOutlet } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, calendarOutline, storefrontOutline, peopleOutline, locationOutline, bookOutline,
         starOutline, mapOutline, shareSocialOutline, informationCircleOutline } from 'ionicons/icons';
import { ParametreService } from '../services/parametre.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp, 
    IonMenu,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonContent,
    IonFooter,
    IonList,
    IonItem,
    IonMenuToggle,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
})
export class AppComponent 
{
  // Pages du menu : d'abord ce qui sert pendant la visite, puis la recherche, puis le reste
  protected pages = [
    { titre: "Accueil", lien: "/", icone: "home-outline" },
    { titre: "Programme", lien: "/page-liste-evenements", icone: "calendar-outline" },
    { titre: "Plan du salon", lien: "/plans", icone: "map-outline" },
    { titre: "Mon planning", lien: "/page-planning-personnel", icone: "star-outline" },
    { titre: "Personnes", lien: "/page-liste-personnes", icone: "people-outline", groupe: true },
    { titre: "Exposants", lien: "/liste-exposants-page", icone: "storefront-outline" },
    { titre: "Livres", lien: "/liste-livres-page", icone: "book-outline" },
    { titre: "Lieux", lien: "/page-liste-lieux", icone: "location-outline" },
    { titre: "Partager l'appli", lien: "/partager", icone: "share-social-outline", groupe: true },
    { titre: "À propos", lien: "/a-propos", icone: "information-circle-outline" }
  ] ;

  protected serviceParametre: ParametreService ;

  // vrai quand le téléphone n'a plus de réseau : on prévient que les infos sont celles déjà chargées
  protected horsLigne = signal( !navigator.onLine ) ;

  constructor( router: Router, serviceParametre: ParametreService )
  {
    this.serviceParametre = serviceParametre ;
    addEventListener( "online", () => this.horsLigne.set( false ) ) ;
    addEventListener( "offline", () => this.horsLigne.set( true ) ) ;
    addIcons( { homeOutline, calendarOutline, storefrontOutline, peopleOutline, locationOutline, bookOutline,
                starOutline, mapOutline, shareSocialOutline, informationCircleOutline } ) ;

    // Ionic cache l'ancienne page (aria-hidden) : on retire le focus du lien cliqué avant de changer de page
    router.events.subscribe( evenement =>
    {
      if( evenement instanceof NavigationStart ) ( document.activeElement as HTMLElement )?.blur() ;
    }) ;
  }

  goToPage( page: string )
  {
    alert( page ) ;
  }
}
