// Modèle commun des événements, compatible avec les pages et services existants.
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

  // Champs complémentaires de master (issus de vues et des pages de listes).
  // Facultatifs pour rester compatibles avec les autres représentations d'événements.
  public heuredebut?: string;
  public jourdebut?: string;
  public type?: string;
  public nomLieu?: string;
  public nomAnimateur?: string;
  public prenomAnimateur?: string;

  // Alias utilisés par notre page de détail et son endpoint PHP.
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
    this.heuredebut = debut ? debut.substring(11, 16) : '';
    this.jourdebut = debut ? debut.substring(0, 10) : '';
  }
}
