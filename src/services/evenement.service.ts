import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Evenement } from "../modeles/Evenement";
import { CriteresProgramme, FiltresProgramme, Programme } from "../modeles/Programme";


@Injectable( {
    providedIn: "root"
})
export class EvenementService {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getThemesEvenements(theme: string = ""): Observable<string[]> {
    let params = new HttpParams();

    if (theme !== "") params = params.set("theme", theme);

    return this.http.get<string[]>("php/evenement/themes-evenements.php", { params });
  }

  // Critères vides ("" ou -1) ignorés, les autres se cumulent (AND)
  getTousLesEvenements(
    titre: string = "",
    debut: string = "",
    jourdebut: string = "",
    heuredebut: string = "",
    nomAnimateur: string = "",
    titreLivre: string = "",
    numLieu: number = -1
  ): Observable<Evenement[]> {
    let first = true;
    let url = "php/evenement/tous-les-evenements.php";

    const criteres: [string, string | number, boolean][] = [
      ["titre", titre, titre !== ""],
      ["debut", debut, debut !== ""],
      ["jourdebut", jourdebut, jourdebut !== ""],
      ["heuredebut", heuredebut, heuredebut !== ""],
      ["nomAnimateur", nomAnimateur, nomAnimateur !== ""],
      ["titreLivre", titreLivre, titreLivre !== ""],
      ["numLieu", numLieu, numLieu !== -1],
    ];

    for (const [nom, valeur, renseigne] of criteres) {
      if (renseigne) {
        url += first ? "?" : "&";
        first = false;
        url += nom + "=" + encodeURIComponent(valeur);
      }
    }

    return this.http.get<Evenement[]>(url);
  }

  // Programme du samedi et du dimanche, déjà regroupé (événements permanents, puis par jour et par heure).
  // Critères vides ("" / -1) ignorés, les autres se cumulent (AND).
  getProgramme(criteres: Partial<CriteresProgramme> = {}): Observable<Programme> {
    let params = new HttpParams();

    const recherche = (criteres.recherche ?? "").trim();
    if (recherche !== "") params = params.set("recherche", recherche);
    if ((criteres.theme ?? "") !== "") params = params.set("theme", criteres.theme!);
    if ((criteres.type ?? "") !== "") params = params.set("type", criteres.type!);
    if ((criteres.numLieu ?? -1) !== -1) params = params.set("numLieu", criteres.numLieu!);
    if ((criteres.idAnimateur ?? -1) !== -1) params = params.set("idAnimateur", criteres.idAnimateur!);
    if ((criteres.idPersonne ?? -1) !== -1) params = params.set("idPersonne", criteres.idPersonne!);
    if ((criteres.idLivre ?? -1) !== -1) params = params.set("idLivre", criteres.idLivre!);

    return this.http.get<Programme>("php/evenement/programme.php", { params });
  }

  // Choix proposés par les filtres de la page des événements (thèmes, lieux, animateurs, auteurs, livres)
  getFiltresEvenements(): Observable<FiltresProgramme> {
    return this.http.get<FiltresProgramme>("php/evenement/filtres-evenements.php");
  }

  // Titres de tous les événements (liste de choix des titres)
  getTitresEvenements(): Observable<string[]> {
    return this.http.get<string[]>("php/evenement/titres-evenements.php");
  }

  getEvenementById(id: number = -1): Observable<Evenement[]> {
    let first = true;
    let url = "php/evenement/evenement-id.php";

    if (id !== -1) {
      url += first ? "?" : "&";
      first = false;
      url += "id=" + id;
    }

    return this.http.get<Evenement[]>(url);
  }

  // Tous les evenements pour la page de configuration
  getEvenementsConfig(): Observable<Evenement[]>
  {
      return this.http.get<Evenement[]>( "php/evenement/config-evenements.php" ) ;
  }

  // Id des livres presentes pendant l'evenement
  getLivresEvenement( id: number ): Observable<number[]>
  {
      return this.http.get<number[]>( "php/evenement/livres-evenement.php?id=" + id ) ;
  }

  // Ajoute (id = -1) ou modifie un evenement avec ses livres, renvoie l'id de l'evenement
  majEvenement( evenement: Evenement, idLivres: number[] ): Observable<{ id: number }>
  {
      return this.http.post<{ id: number }>( "php/evenement/maj-evenement.php", {
          evenement: evenement,
          idLivres: idLivres
      } ) ;
  }

  supprimeEvenement( id: number ): Observable<any>
  {
      return this.http.post( "php/evenement/supprime-evenement.php", { id: id } ) ;
  }

  // Couleur de l'affiche pour un type d'evenement (toujours la meme pour un type)
  couleurType( type: string ): string
  {
      let couleurs = ["primary", "secondary", "tertiary", "warning"] ;
      let somme = 0 ;
      for( let i = 0 ; i < ( type ?? "" ).length ; i++ ) somme += type.charCodeAt( i ) ;
      return couleurs[ somme % couleurs.length ] ;
  }
}
