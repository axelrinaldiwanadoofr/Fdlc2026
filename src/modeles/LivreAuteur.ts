// Livre de la page d'un auteur, il vient de la base ou de la BnF
export class LivreAuteur
{
    public id: number = -1 ;                  // -1 si le livre vient de la BnF
    public titre: string = "" ;
    public annee: string = "" ;
    public editeur: string = "" ;
    public auFestival: boolean = false ;
    public couvertures: Array<string> = [] ;  // urls des images a essayer

    constructor( id: number = -1, titre: string = "", annee: string = "", editeur: string = "", auFestival: boolean = false )
    {
        this.id = id ;
        this.titre = titre ;
        this.annee = annee ;
        this.editeur = editeur ;
        this.auFestival = auFestival ;
    }
}
