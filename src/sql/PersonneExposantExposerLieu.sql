

create or replace view fdlc_PersonneExposantExposerLieu as
select 
    ser.idPersonne,
    p.prenom,
    p.nom,
    p.specialite,
    ser.idExposant,
    ex.nom as nomExposant,
    ser.samedi_am,
    ser.samedi_pm,
    ser.dimanche_am,
    ser.dimanche_pm,
    ex.numLieu,
    l.nom as nomLieu,
    l.hall
from fdlc_exposer as ser 
    inner join fdlc_personne as p on ser.idPersonne = p.id
    inner join fdlc_exposant as ex on ser.idExposant = ex.id
    inner join fdlc_lieu as l on ex.numLieu = l.num ;
    
create or replace view PersonneExposantExposerLieu as
select 
    ser.idPersonne,
    p.prenom,
    p.nom,
    p.specialite,
    ex.id as idExposant,
    ex.nom as nomExposant,
    ex.libelle as libelleExposant,
    ex.type as typeExposant,
    ser.samedi_am,
    ser.samedi_pm,
    ser.dimanche_am,
    ser.dimanche_pm,
    ex.numLieu as numLieu,
    l.nom as nomLieu,
    l.libelle as libelleLieu,
    l.type as typeLieu,
    l.hall
from exposant as ex
    inner join lieu as l on ex.numLieu = l.num  
    left join exposer as ser on ser.idExposant = ex.id
    left join personne as p on ser.idPersonne = p.id ;


create or replace view fdlc_PersonneExposantExposerLieu as
select 
    ser.idPersonne,
    p.prenom,
    p.nom,
    p.specialite,
    ex.id as idExposant,
    ex.nom as nomExposant,
    ex.libelle as libelleExposant,
    ex.type as typeExposant,
    ser.samedi_am,
    ser.samedi_pm,
    ser.dimanche_am,
    ser.dimanche_pm,
    ex.numLieu as numLieu,
    l.nom as nomLieu,
    l.libelle as libelleLieu,
    l.type as typeLieu,
    l.hall
from fdlc_exposant as ex
    inner join fdlc_lieu as l on ex.numLieu = l.num  
    left join fdlc_exposer as ser on ser.idExposant = ex.id
    left join fdlc_personne as p on ser.idPersonne = p.id ;
