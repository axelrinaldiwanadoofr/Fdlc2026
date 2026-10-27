
create view AuteurExposantExposer as
select 
    ser.idAuteur,
    au.prenom,
    au.nom,
    ser.idExposant,
    ex.nom as nomExposant,
    ser.samedi_am,
    ser.samedi_pm,
    ser.dimanche_am,
    ser.dimanche_pm
from exposer as ser 
    inner join auteur as au on ser.idAuteur = au.id
    inner join exposant as ex on ser.idExposant = ex.id;

alter table auteur add type varchar(10) null ;


-- Vue regroupant les événements, les livres,
-- leurs auteurs et les lieux des événements.

CREATE OR REPLACE VIEW EvenementLivrePersonneLieu AS
SELECT
    ev.id AS idEvenement,
    ev.titre AS titreEvenement,
    ev.debut,
    ev.fin,
    ev.typeevenement,

    li.id AS idLivre,
    li.titre AS titreLivre,

    p.id AS idPersonne,
    p.prenom,
    p.nom,

    l.num AS numLieu,
    l.nom AS nomLieu

FROM evenement AS ev

-- Lieu de l'événement
LEFT JOIN lieu AS l
    ON ev.numLieu = l.num

-- Livres présentés pendant l'événement
LEFT JOIN presenter AS pr
    ON ev.id = pr.idEvenement

LEFT JOIN livre AS li
    ON pr.idLivre = li.id

-- Auteurs des livres
LEFT JOIN ecrire AS ec
    ON li.id = ec.idLivre

LEFT JOIN personne AS p
    ON ec.idPersonne = p.id;
