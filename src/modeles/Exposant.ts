
export class Exposant
{
    public id: number = -1 ;
    public nom: string = "" ;
    public numLieu: number = -1 ;
    public nomLieu: string = "" ;

    constructor( id: number = -1, nom: string = "", numLieu: number = -1, nomLieu: string = "" )
    {
        this.id = id ;
        this.nom = nom ;
        this.numLieu = numLieu ;
        this.nomLieu = nomLieu ; 
    }

}