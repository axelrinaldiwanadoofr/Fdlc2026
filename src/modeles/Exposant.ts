export class Exposant
{
    public id: number = -1 ;
    public nom: string = "" ;
    public numLieu: number = -1 ;
    public nomLieu: string = "" ;
    public hall: number = -1 ;

    // Créneaux de présence de la personne chez cet exposant
    // 1 : présent, 0 : absent
    // null : information non renseignée
    public samedi_am: number | null = null ;
    public samedi_pm: number | null = null ;
    public dimanche_am: number | null = null ;
    public dimanche_pm: number | null = null ;

    constructor(
        id: number = -1,
        nom: string = "",
        numLieu: number = -1,
        nomLieu: string = "",
        samedi_am: number | null = null,
        samedi_pm: number | null = null,
        dimanche_am: number | null = null,
        dimanche_pm: number | null = null
    )
    {
        this.id = id ;
        this.nom = nom ;
        this.numLieu = numLieu ;
        this.nomLieu = nomLieu ;

        // Initialisation des créneaux de présence
        this.samedi_am = samedi_am ;
        this.samedi_pm = samedi_pm ;
        this.dimanche_am = dimanche_am ;
        this.dimanche_pm = dimanche_pm ;
    }
}