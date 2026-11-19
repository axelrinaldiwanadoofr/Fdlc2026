import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { 
  IonApp, 
  IonMenu,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonMenuToggle,
  IonIcon,
  IonLabel,
  IonRouterOutlet } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, calendarOutline, storefrontOutline, peopleOutline, locationOutline, bookOutline,
         starOutline, mapOutline, informationCircleOutline } from 'ionicons/icons';

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
  // Pages du menu
  protected pages = [
    { titre: "Accueil", lien: "/", icone: "home-outline" },
    { titre: "Liste des événements", lien: "/page-liste-evenements", icone: "calendar-outline" },
    { titre: "Liste des exposants", lien: "/liste-exposants-page", icone: "storefront-outline" },
    { titre: "Liste des personnes", lien: "/page-liste-personnes", icone: "people-outline" },
    { titre: "Liste des lieux", lien: "/page-liste-lieux", icone: "location-outline" },
    { titre: "Liste des livres", lien: "/liste-livres-page", icone: "book-outline" },
    { titre: "Mon planning", lien: "/page-planning-personnel", icone: "star-outline" },
    { titre: "Plan du salon", lien: "/plans", icone: "map-outline" },
    { titre: "À propos", lien: "/a-propos", icone: "information-circle-outline" }
  ] ;

  constructor()
  {
    addIcons( { homeOutline, calendarOutline, storefrontOutline, peopleOutline, locationOutline, bookOutline,
                starOutline, mapOutline, informationCircleOutline } ) ;
  }

  goToPage( page: string )
  {
    alert( page ) ;
  }
}
