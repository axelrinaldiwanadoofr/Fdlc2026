
CREATE OR REPLACE VIEW PersonneComplete AS
SELECT
    -- Informations de la personne
    p.id,
    p.civilite,
    p.prenom,
    p.nom,
    p.biographie,
    p.specialite,
    p.photo,
    p.type AS typePersonne,

    -- Livres écrits par la personne
    l.id AS idLivre,
    l.titre AS titreLivre,
    l.resume AS resumeLivre,
    l.genre AS genreLivre,

    -- Editeur du livre
    ed.id AS idEditeur,
    ed.nom AS nomEditeur,

    -- Exposant
    ex.id AS idExposant,
    ex.nom AS nomExposant,

    -- Creneaux de presence
    exp.samedi_am,
    exp.samedi_pm,
    exp.dimanche_am,
    exp.dimanche_pm,

    -- Lieu de l'exposant
    ex.numLieu,
    lieu.nom AS nomLieu,

    -- Evenements animes par la personne
    ev.id AS idEvenement,
    ev.titre AS titreEvenement,
    ev.typeevenement,
    ev.stitre AS sousTitreEvenement,
    ev.debut AS debutEvenement,
    ev.fin AS finEvenement,
    ev.commentaire AS commentaireEvenement,
    ev.numLieu AS numLieuEvenement,

    -- Lieu de l'evenement
    lieuEv.nom AS nomLieuEvenement

FROM personne AS p

LEFT JOIN ecrire AS ec
    ON ec.idPersonne = p.id

LEFT JOIN livre AS l
    ON l.id = ec.idLivre

LEFT JOIN editeur AS ed
    ON ed.id = l.idEditeur

LEFT JOIN exposer AS exp
    ON exp.idPersonne = p.id

LEFT JOIN exposant AS ex
    ON ex.id = exp.idExposant

LEFT JOIN lieu
    ON lieu.num = ex.numLieu

LEFT JOIN evenement AS ev
    ON ev.idAnimateur = p.id

LEFT JOIN lieu AS lieuEv
    ON lieuEv.num = ev.numLieu;
