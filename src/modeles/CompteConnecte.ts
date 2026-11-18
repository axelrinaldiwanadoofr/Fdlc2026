// Auteur: Kevin MEYER - 16/11/2026

// Compte connecté à la configuration, renvoyé par php/compte/moi.php
export class CompteConnecte
{
    public id: number = -1 ;
    public identifiant: string = "" ;
    public nom: string = "" ;
    public estRoot: boolean = false ;
    public role: string = "" ;
    public couleur: string = "" ;
    public niveau: number = 0 ;
    public doitChanger: boolean = false ;
    public rootParDefaut: boolean = false ;
    public permissions: string[] = [] ;
    public jeton: string = "" ;
}
