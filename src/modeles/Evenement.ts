// Modèle de master, avec les champs de détail additionnels renvoyés par notre PHP.
export class Evenement {
  public id: number = -1;
  public typeevenement: string = '';
  public titre: string = '';
  public stitre: string = '';
  public public: string = '';
  public commentaire: string = '';
  public debut: string = '';
  public fin: string = '';
  public idAnimateur: number = -1;
  public numLieu: number = -1;

  // Compatibilité avec page-evenement et ses alias SQL (tous-les-evenements.php).
    //update : 
    public type?: string;
    public idLieu?: number | null;
    public lieu?: string | null;
    public animateur?: string | null;

  constructor(
    id: number = -1,
    typeevenement: string = '',
    titre: string = '',
    stitre: string = '',
    pub: string = '',
    commentaire: string = '',
    debut: string = '',
    fin: string = '',
    idAnimateur: number = -1,
    numLieu: number = -1
  ) {
    this.id = id;
    this.typeevenement = typeevenement;
    this.titre = titre;
    this.stitre = stitre;
    this.public = pub;
    this.commentaire = commentaire;
    this.debut = debut;
    this.fin = fin;
    this.idAnimateur = idAnimateur;
    this.numLieu = numLieu;
  }
}
