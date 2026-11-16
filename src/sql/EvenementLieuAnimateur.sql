

    
create or replace view EvenementLieuAnimateur as
select 
    e.id,
    e.titre,
    e.type,
    e.debut,
    e.fin,
    e.commentaire,
    e.theme,
    e.numLieu,
    e.idAnimateur,
    p.prenom as prenomAnimateur,
    p.nom as nomAnimateur,
    p.specialite as specialiteAnimateur,
    l.nom as nomLieu,
    l.libelle as libelleLieu,
    l.type as typeLieu,
    l.hall
from evenement as e
    inner join lieu as l on e.numLieu = l.num  
    left join personne as p on e.idAnimateur = p.id ;


create or replace view fdlc_EvenementLieuAnimateur as
select 
    e.id,
    e.titre,
    e.type,
    e.debut,
    e.fin,
    e.commentaire,
    e.theme,
    e.numLieu,
    e.idAnimateur,
    p.prenom as prenomAnimateur,
    p.nom as nomAnimateur,
    p.specialite as specialiteAnimateur,
    l.nom as nomLieu,
    l.libelle as libelleLieu,
    l.type as typeLieu,
    l.hall
from fdlc_evenement as e
    inner join fdlc_lieu as l on e.numLieu = l.num  
    left join fdlc_personne as p on e.idAnimateur = p.id ;