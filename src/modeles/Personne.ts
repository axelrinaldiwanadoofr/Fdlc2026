export class Personne
{
    public id: number = -1 ;
    public civilite: string = "" ;
    public prenom: string = "" ;
    public nom: string = "" ;
    public biographie: string = "" ;
    public photo: string = "" ;

    constructor( 
        id: number = -1, 
        civilite: string = "",
        prenom: string = "",
        nom: string = "",
        biographie: string = "",
        photo: string = "" )
    {
        this.id = id ;
        this.civilite = civilite ;
        this.prenom = prenom ;
        this.nom = nom ;
        this.biographie = biographie ;
        this.photo = photo ;
    }
}