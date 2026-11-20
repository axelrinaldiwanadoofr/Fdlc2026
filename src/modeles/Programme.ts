import { Evenement } from "./Evenement" ;

// Programme renvoyé par php/evenement/programme.php, déjà regroupé côté PHP :
// le web component app-liste-evenements ne fait qu'afficher.

// Événements présents toute la journée (stands, expositions...) d'un jour
export interface PermanentsJour
{
    cle: string ;                // "2026-11-21"
    nomJour: string ;            // "Samedi"
    date: string ;               // "21 novembre"
    evenements: Evenement[] ;
}

// Événements commençant à la même heure
export interface Creneau
{
    heure: string ;              // "10h30"
    evenements: Evenement[] ;
}

// Événements à horaire d'un jour
export interface JourProgramme
{
    cle: string ;
    nomJour: string ;
    date: string ;
    total: number ;
    creneaux: Creneau[] ;
}

export interface Programme
{
    permanents: PermanentsJour[] ;
    jours: JourProgramme[] ;
    sansDate: Evenement[] ;
    total: number ;
}

// Critères de filtre ("" / -1 = pas de filtre)
export interface CriteresProgramme
{
    recherche: string ;          // auteur, titre, mot du descriptif, lieu, livre...
    theme: string ;              // theme d'événement
    type: string ;               // type d'événement (filtre « Type »)
    numLieu: number ;
    idAnimateur: number ;
    idPersonne: number ;         // personne liée : anime, livre présenté ou invitée (filtre « Auteur »)
    idLivre: number ;            // livre lié : présenté ou écrit par un invité (filtre « Livre »)
}

// Choix proposés par les filtres (php/evenement/filtres-evenements.php)
export interface FiltresProgramme
{
    themes: string[] ;
    types: string[] ;
    lieux: { num: number, nom: string }[] ;
    animateurs: { id: number, nom: string }[] ;
    auteurs: { id: number, nom: string }[] ;
    livres: { id: number, titre: string }[] ;
}
