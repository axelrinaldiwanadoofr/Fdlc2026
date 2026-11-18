-- Vues du programme des événements (page programme, page détail, page personne).
-- Utilisées par php/evenement/programme.php, filtres-evenements.php et evenement-id.php.
--
-- Comme pour EvenementLieuAnimateur.sql : une version pour la base locale,
-- puis la même avec les tables préfixées fdlc_ pour le serveur.
-- Seules des colonnes présentes dans toutes les bases sont utilisées
-- (pas de evenement.theme ni de lieu.libelle).
--
--   EvenementProgramme : un événement avec son lieu et son animateur (left join :
--                        les expositions et stands sans lieu sont gardés)
--   EvenementPersonne  : personnes liées à un événement, avec leur rôle
--                        (estAnimateur = 1 / 0 pour filtrer sans comparer de texte :
--                        les collations diffèrent entre les bases) :
--                          'animateur'      : anime l'événement
--                          'livre présenté' : auteur d'un livre présenté (table presenter)
--                          'invité'         : cité ("Prénom Nom") dans le titre ou le descriptif
--   EvenementLivre     : livres liés à un événement :
--                          'présenté'       : table presenter
--                          'invité'         : écrit par une personne liée (hors animateur)


-- ==================== Base locale ====================

create or replace view EvenementProgramme as
select
    e.id,
    e.type,
    e.titre,
    e.stitre,
    e.public,
    e.commentaire,
    e.debut,
    e.fin,
    e.idAnimateur,
    e.numLieu,
    l.nom as nomLieu,
    l.type as typeLieu,
    l.hall,
    p.prenom as prenomAnimateur,
    p.nom as nomAnimateur,
    p.specialite as specialiteAnimateur,
    trim( concat( coalesce( p.prenom, '' ), ' ', coalesce( p.nom, '' ) ) ) as animateur,
    date( e.debut ) as jourdebut,
    date_format( e.debut, '%H:%i' ) as heuredebut,
    -- un début à 00:00 = présent toute la journée (stands, expositions...)
    ( e.debut is not null and time( e.debut ) = '00:00:00' ) as touteLaJournee,
    -- le festival se tient le samedi (7) et le dimanche (1) ; sans date = gardé
    ( e.debut is null or dayofweek( e.debut ) in ( 7, 1 ) ) as pendantFestival
from evenement as e
    left join lieu as l on l.num = e.numLieu
    left join personne as p on p.id = e.idAnimateur ;


create or replace view EvenementPersonne as
select e.id as idEvenement, p.id as idPersonne, p.prenom, p.nom, p.specialite, 'animateur' as role, 1 as estAnimateur
from evenement as e
    inner join personne as p on p.id = e.idAnimateur
union
select pr.idEvenement, p.id, p.prenom, p.nom, p.specialite, 'livre présenté', 0
from presenter as pr
    inner join ecrire as ec on ec.idLivre = pr.idLivre
    inner join personne as p on p.id = ec.idPersonne
union
select e.id, p.id, p.prenom, p.nom, p.specialite, 'invité', 0
from evenement as e
    inner join personne as p
        on length( trim( coalesce( p.nom, '' ) ) ) > 1
       and trim( coalesce( p.prenom, '' ) ) <> ''
       and (    e.titre like concat( '%', trim( p.prenom ), ' ', trim( p.nom ), '%' )
             or e.stitre like concat( '%', trim( p.prenom ), ' ', trim( p.nom ), '%' )
             or e.commentaire like concat( '%', trim( p.prenom ), ' ', trim( p.nom ), '%' ) ) ;


create or replace view EvenementLivre as
select pr.idEvenement, l.id as idLivre, l.titre, 'présenté' as origine
from presenter as pr
    inner join livre as l on l.id = pr.idLivre
union
select ep.idEvenement, l.id, l.titre, 'invité'
from EvenementPersonne as ep
    inner join ecrire as ec on ec.idPersonne = ep.idPersonne
    inner join livre as l on l.id = ec.idLivre
where ep.estAnimateur = 0 ;


-- ==================== Serveur (tables fdlc_) ====================

create or replace view fdlc_EvenementProgramme as
select
    e.id,
    e.type,
    e.titre,
    e.stitre,
    e.public,
    e.commentaire,
    e.debut,
    e.fin,
    e.idAnimateur,
    e.numLieu,
    l.nom as nomLieu,
    l.type as typeLieu,
    l.hall,
    p.prenom as prenomAnimateur,
    p.nom as nomAnimateur,
    p.specialite as specialiteAnimateur,
    trim( concat( coalesce( p.prenom, '' ), ' ', coalesce( p.nom, '' ) ) ) as animateur,
    date( e.debut ) as jourdebut,
    date_format( e.debut, '%H:%i' ) as heuredebut,
    ( e.debut is not null and time( e.debut ) = '00:00:00' ) as touteLaJournee,
    ( e.debut is null or dayofweek( e.debut ) in ( 7, 1 ) ) as pendantFestival
from fdlc_evenement as e
    left join fdlc_lieu as l on l.num = e.numLieu
    left join fdlc_personne as p on p.id = e.idAnimateur ;


create or replace view fdlc_EvenementPersonne as
select e.id as idEvenement, p.id as idPersonne, p.prenom, p.nom, p.specialite, 'animateur' as role, 1 as estAnimateur
from fdlc_evenement as e
    inner join fdlc_personne as p on p.id = e.idAnimateur
union
select pr.idEvenement, p.id, p.prenom, p.nom, p.specialite, 'livre présenté', 0
from fdlc_presenter as pr
    inner join fdlc_ecrire as ec on ec.idLivre = pr.idLivre
    inner join fdlc_personne as p on p.id = ec.idPersonne
union
select e.id, p.id, p.prenom, p.nom, p.specialite, 'invité', 0
from fdlc_evenement as e
    inner join fdlc_personne as p
        on length( trim( coalesce( p.nom, '' ) ) ) > 1
       and trim( coalesce( p.prenom, '' ) ) <> ''
       and (    e.titre like concat( '%', trim( p.prenom ), ' ', trim( p.nom ), '%' )
             or e.stitre like concat( '%', trim( p.prenom ), ' ', trim( p.nom ), '%' )
             or e.commentaire like concat( '%', trim( p.prenom ), ' ', trim( p.nom ), '%' ) ) ;


create or replace view fdlc_EvenementLivre as
select pr.idEvenement, l.id as idLivre, l.titre, 'présenté' as origine
from fdlc_presenter as pr
    inner join fdlc_livre as l on l.id = pr.idLivre
union
select ep.idEvenement, l.id, l.titre, 'invité'
from fdlc_EvenementPersonne as ep
    inner join fdlc_ecrire as ec on ec.idPersonne = ep.idPersonne
    inner join fdlc_livre as l on l.id = ec.idLivre
where ep.estAnimateur = 0 ;
