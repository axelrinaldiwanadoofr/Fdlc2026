// Auteur: Kevin MEYER - 04/11/2026

import { Component, OnChanges, AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline } from 'ionicons/icons';

import {
  IonIcon,
  IonToast,
 } from '@ionic/angular';

import { LieuService } from '../../services/lieu.service';
import { ParametreService } from '../../services/parametre.service';
import { Lieu } from '../../modeles/Lieu';

@Component({
  selector: 'app-plan-hall',
  templateUrl: './plan-hall.component.html',
  styleUrls: ['./plan-hall.component.scss'],
  imports: [
    IonIcon,
    IonToast,
  ],
})
export class PlanHallComponent  implements OnChanges, AfterViewInit, OnDestroy
{
  // Numero du hall affiché, 0 = plan général du salon
  public    numHall = input.required<number>() ;

  // Lieu à mettre en évidence sur le plan (-1 = aucun)
  public    numLieu = input<number>( -1 ) ;

  // Petit plan dans une autre page : sans l'aide ni le message "pas encore placé"
  public    compact = input<boolean>( false ) ;

  // Page appelée quand on clique sur un stand, le num du lieu est ajouté à la fin
  public    lienPage = input<string>( "/page-lieu" ) ;

  // Prévient le parent quand le plan est zoomé
  public    onZoom = output<boolean>() ;

  // Hall touché sur le plan général
  public    onHall = output<number>() ;

  protected serviceLieu: LieuService ;
  protected router: Router ;

  protected lieux = signal<Array<Lieu>>( [] ) ;

  // Taille réelle de l'image, les zones de la BD sont en pixels de l'image
  protected largeur = signal(0) ;
  protected hauteur = signal(0) ;

  protected zoom = signal(1) ;

  // plan masqué le temps que l'image du nouveau hall arrive, puis fondu
  protected cache = signal( true ) ;
  private hallAffiche: number = -1 ;

  // Largeur du plan sans zoom : le hall doit tenir en entier dans le cadre
  protected largeurBase = signal(0) ;
  private observateur: ResizeObserver | null = null ;

  // Zoom avec deux doigts : écart entre les doigts et zoom au début du geste
  private ecartDepart: number = 0 ;
  private zoomDepart: number = 1 ;

  // Point du plan sous les doigts, en fraction de la taille du plan (0 à 1)
  private pointX: number = 0 ;
  private pointY: number = 0 ;

  protected cadre = viewChild.required<ElementRef<HTMLElement>>( "cadre" ) ;
  protected plan = viewChild.required<ElementRef<HTMLElement>>( "plan" ) ;
  protected cdr: ChangeDetectorRef ;


  // Bouton Situer : on montre le lieu demandé une seule fois
  private lieuxCharges: boolean = false ;
  private dejaSitue: boolean = false ;
  protected messageSituer = signal("") ;

  // Seulement les lieux qui ont une zone dessinée
  protected zones = computed( () => this.numHall() == 0 ? this.zonesHalls() : this.lieux().filter( l => l.x1 != null && l.x2 != null ) ) ;

  // Place des 5 halls sur le plan général, en % de l'image pour marcher quelle que soit sa taille
  private halls = [
    { num: 1, x1: 0.7, y1: 12, x2: 25, y2: 92.5 },
    { num: 2, x1: 28.5, y1: 34, x2: 51, y2: 91 },
    { num: 3, x1: 51, y1: 34, x2: 77.1, y2: 96.6 },
    { num: 4, x1: 77.1, y1: 34, x2: 99.2, y2: 91 },
    { num: 5, x1: 82.5, y1: 1.5, x2: 99.2, y2: 34 }
  ] ;

  private zonesHalls = computed( () => this.halls.map( hall => new Lieu( hall.num, "Hall " + hall.num, "hall",
    hall.x1 * this.largeur() / 100, hall.y1 * this.hauteur() / 100, hall.x2 * this.largeur() / 100, hall.y2 * this.hauteur() / 100, hall.num ) ) ) ;

  protected lieuSelectionne = computed( () => this.zones().find( l => l.num == this.numLieu() ) ) ;

  // Position de la pointe de la bulle ICI
  protected repere = computed( () =>
  {
    let lieu = this.lieuSelectionne() ;
    if( !lieu ) return null ;

    let y = lieu.y1 > 65 ? lieu.y1 : Math.max( ( lieu.y1 + lieu.y2 ) / 2, 65 ) ;
    return { x: ( lieu.x1 + lieu.x2 ) / 2, y: y } ;
  }) ;

  protected serviceParametre: ParametreService ;

  constructor( serviceLieu: LieuService, serviceParametre: ParametreService, router: Router, cdr: ChangeDetectorRef )
  {
    this.serviceLieu = serviceLieu ;
    this.serviceParametre = serviceParametre ;
    this.router = router ;
    this.cdr = cdr ;
    addIcons( { addOutline, removeOutline } ) ;
  }

  ngOnChanges()
  {
    if( this.numHall() != this.hallAffiche )
    {
      this.hallAffiche = this.numHall() ;
      this.cache.set( true ) ;
    }

    this.lieuxCharges = false ;
    this.dejaSitue = false ;
    if( this.numHall() == 0 ) return ;
    this.serviceLieu.getLieuxDuHall( this.numHall() ).subscribe( lieux =>
    {
      this.lieux.set( lieux ) ;
      this.lieuxCharges = true ;
      this.situeLieu() ;
    }) ;
  }

  // Recalcule la taille du plan quand le cadre change de taille
  ngAfterViewInit()
  {
    this.observateur = new ResizeObserver( () => this.calculeLargeurBase() ) ;
    this.observateur.observe( this.cadre().nativeElement ) ;
  }

  ngOnDestroy()
  {
    this.observateur?.disconnect() ;
  }

  onImageChargee( event: Event )
  {
    let image = event.target as HTMLImageElement ;
    this.cache.set( false ) ;
    this.largeur.set( image.naturalWidth ) ;
    this.hauteur.set( image.naturalHeight ) ;
    this.calculeLargeurBase() ;
  }

  // Plus grande largeur pour que l'image tienne en largeur et en hauteur,
  // sauf le plan général sur téléphone : environ deux halls à l'écran et on fait défiler de côté
  private calculeLargeurBase()
  {
    let cadre = this.cadre().nativeElement ;
    if( this.largeur() == 0 || cadre.clientWidth == 0 ) return ;

    let ratio = this.largeur() / this.hauteur() ;
    let largeur = Math.min( cadre.clientWidth, cadre.clientHeight * ratio, this.numHall() == 0 ? 1800 : 1100 ) ;

    if( this.numHall() == 0 && cadre.clientWidth < 700 ) largeur = Math.min( cadre.clientHeight * ratio, cadre.clientWidth * 2.2 ) ;
    this.largeurBase.set( Math.floor( largeur ) ) ;
    this.situeLieu() ;
  }

  // Affiche la bulle ICI sur le stand demandé
  private situeLieu()
  {
    if( this.dejaSitue || !this.lieuxCharges || this.largeurBase() == 0 ) return ;

    let lieu = this.lieux().find( l => l.num == this.numLieu() ) ;
    if( !lieu ) return ;

    this.dejaSitue = true ;

    if( lieu.x1 == null && !this.compact() ) this.messageSituer.set( this.nomLieu( lieu ) + " n'est pas encore placé sur le plan" ) ;
  }

  onClickZone( lieu: Lieu )
  {
    if( this.numHall() == 0 )
    {
      this.onHall.emit( lieu.num ) ;
      return ;
    }
    this.router.navigate( [this.lienPage(), lieu.num] ) ;
  }

  // ex : "Stand 222", sinon le nom du lieu
  protected nomLieu( lieu: Lieu ): string
  {
    if( lieu.type == "stand" ) return "Stand " + lieu.num ;
    return lieu.nom || "Lieu " + lieu.num ;
  }

  // Boutons + et - : zoom progressif (0,2 s) sur le centre de l'écran
  changeZoom( pas: number )
  {
    let cadre = this.cadre().nativeElement.getBoundingClientRect() ;
    let x = cadre.left + cadre.width / 2 ;
    let y = cadre.top + cadre.height / 2 ;
    let depart = this.zoom() ;
    let cible = Math.min( 3, Math.max( 1, depart + pas ) ) ;
    let duree = matchMedia( "(prefers-reduced-motion: reduce)" ).matches ? 0 : 200 ;
    let debut = performance.now() ;

    this.retientPoint( x, y ) ;
    let etape = ( temps: number ) =>
    {
      let avance = duree == 0 ? 1 : Math.min( 1, Math.max( 0, temps - debut ) / duree ) ;
      this.zoomeSur( depart + ( cible - depart ) * ( 1 - Math.pow( 1 - avance, 3 ) ), x, y ) ;
      if( avance < 1 ) requestAnimationFrame( etape ) ;
      else this.onZoom.emit( this.zoom() > 1 ) ;
    } ;
    requestAnimationFrame( etape ) ;
  }

  // Mémorise quel point du plan se trouve sous la position x, y de l'écran
  private retientPoint( x: number, y: number )
  {
    let plan = this.plan().nativeElement.getBoundingClientRect() ;
    this.pointX = ( x - plan.left ) / plan.width ;
    this.pointY = ( y - plan.top ) / plan.height ;
  }

  // Change le zoom puis fait défiler le cadre pour que le point retenu reste en x, y
  private zoomeSur( zoom: number, x: number, y: number )
  {
    this.zoom.set( Math.min( 3, Math.max( 1, zoom ) ) ) ;
    this.cdr.detectChanges() ;

    let plan = this.plan().nativeElement.getBoundingClientRect() ;
    let cadre = this.cadre().nativeElement ;
    cadre.scrollLeft += plan.left + this.pointX * plan.width - x ;
    cadre.scrollTop += plan.top + this.pointY * plan.height - y ;
  }

  onTouchStart( event: TouchEvent )
  {
    if( event.touches.length != 2 ) return ;

    this.ecartDepart = this.ecart( event ) ;
    this.zoomDepart = this.zoom() ;
    let milieu = this.milieu( event ) ;
    this.retientPoint( milieu.x, milieu.y ) ;
    this.onZoom.emit( true ) ;
  }

  onTouchMove( event: TouchEvent )
  {
    if( event.touches.length != 2 || this.ecartDepart == 0 ) return ;

    event.preventDefault() ;
    let milieu = this.milieu( event ) ;
    this.zoomeSur( this.zoomDepart * this.ecart( event ) / this.ecartDepart, milieu.x, milieu.y ) ;
  }

  onTouchEnd( event: TouchEvent )
  {
    if( this.ecartDepart == 0 || event.touches.length > 0 ) return ;

    this.ecartDepart = 0 ;
    setTimeout( () => this.onZoom.emit( this.zoom() > 1 ) ) ;
  }

  // Distance entre les deux doigts
  private ecart( event: TouchEvent ): number
  {
    let a = event.touches[0] ;
    let b = event.touches[1] ;
    return Math.hypot( a.clientX - b.clientX, a.clientY - b.clientY ) ;
  }

  // Point au milieu des deux doigts
  private milieu( event: TouchEvent ): { x: number, y: number }
  {
    let a = event.touches[0] ;
    let b = event.touches[1] ;
    return { x: ( a.clientX + b.clientX ) / 2, y: ( a.clientY + b.clientY ) / 2 } ;
  }
}
