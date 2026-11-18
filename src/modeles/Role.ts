// Auteur: Kevin MEYER - 16/11/2026

// Rôle des comptes : plus le niveau est haut, plus le rôle est important
export class Role
{
    public id: number = -1 ;
    public nom: string = "" ;
    public niveau: number = 1 ;
    public couleur: string = "#6b7280" ;
    public permissions: string[] = [] ;
    public nbComptes: number = 0 ;
    public modifiable: boolean = true ;
}
