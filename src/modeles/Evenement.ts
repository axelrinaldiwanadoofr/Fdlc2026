// Modèle de master, avec les champs de détail additionnels renvoyés par notre PHP.


export class Evenement
{
    public id: number = -1 ;
    public typeevenement: string = "" ;   // type événement
    public titre: string = "" ;
    public stitre: string = "" ;          // sous-titre
    public public: string = "" ;          // public visé
    public commentaire: string = "" ;
    public debut: string = "" ;           // date et heure de début ("AAAA-MM-JJ HH:MM:SS")
    public fin: string = "" ;             // date et heure de fin
    public idAnimateur: number = -1 ;     // id personne qui anime
    public numLieu: number = -1 ;         // num du lieu où se déroule l'événement
    public heuredebut: string = "" ;      // heure de début ("HH:MM")
    public jourdebut: string = "" ;      // jour de début ("AAAA-MM-JJ")
    public type: string = "" ;             // type de l'événement (conférence, dédicace, etc.)
    public nomLieu: string = "" ;          // nom du lieu où se déroule l'événement
    public nomAnimateur: string = "" ;        // nom de la personne qui anime l'événement    
    public prenomAnimateur: string = "" ;        // nom de la personne qui anime l'événement    

    constructor( 
        id: number = -1, 
        typeevenement: string = "", 
        titre: string = "",
        stitre: string = "",
        pub: string = "",
        commentaire: string = "",
        debut: string = "",
        fin: string = "",
        idAnimateur: number = -1,
        numLieu: number = -1 )
    {
        this.id = id ;
        this.typeevenement = typeevenement ;
        this.titre = titre ;
        this.stitre = stitre ;
        this.public = pub ;
        this.commentaire = commentaire ;
        this.debut = debut ;
        this.fin = fin ;
        this.idAnimateur = idAnimateur ;
        this.numLieu = numLieu ;
        this.heuredebut = debut ? debut.substring( 11, 16 ) : "" ;
        this.jourdebut = debut ? debut.substring( 0, 10 ) : "" ;
    }

    /*
    get heuredebut(): string
    {
        return this.debut ? this.debut.substring( 11, 16 ) : "" ;
    }

    get jourdebut(): string
    {
        return this.debut ? this.debut.substring( 0, 10 ) : "" ;
    }*/
}
