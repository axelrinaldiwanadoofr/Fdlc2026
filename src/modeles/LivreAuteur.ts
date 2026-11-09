// Livre affiché sur la page d'un auteur
export class LivreAuteur
{
    public id: number = -1 ;                  // -1 si le livre vient de la BnF
    public titre: string = "" ;
    public annee: string = "" ;
    public editeur: string = "" ;
    public auFestival: boolean = false ;
    public couvertures: Array<string> = [] ;

    constructor( id: number = -1, titre: string = "", annee: string = "", editeur: string = "", auFestival: boolean = false )
    {
        this.id = id ;
        this.titre = titre ;
        this.annee = annee ;
        this.editeur = editeur ;
        this.auFestival = auFestival ;
    }
}
