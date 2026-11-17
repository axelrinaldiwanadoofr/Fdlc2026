// Auteur: Kevin MEYER - 16/11/2026

// Compte de connexion d'une personne (page des comptes)
export class Compte
{
    public id: number = -1 ;
    public identifiant: string = "" ;
    public estRoot: boolean = false ;
    public idRole: number = -1 ;
    public role: string = "" ;
    public couleur: string = "" ;
    public niveau: number = 0 ;
    public idPersonne: number = -1 ;
    public nom: string = "" ;
    public actif: number = 1 ;
    public doitChanger: number = 0 ;
    public derniereConnexion: string = "" ;
    public modifiable: boolean = false ;
}
