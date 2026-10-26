
create or replace view PersonneExposantExposer as
select 
    ser.idPersonne,
    au.prenom,
    au.nom,
    au.specialite,
    ser.idExposant,
    ex.nom as nomExposant,
    ser.samedi_am,
    ser.samedi_pm,
    ser.dimanche_am,
    ser.dimanche_pm
from exposer as ser 
    inner join personne as au on ser.idPersonne = au.id
    inner join exposant as ex on ser.idExposant = ex.id

create or replace view PersonneExposantExposerLieu as
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
    l.nom as nomLieu
from exposer as ser 
    inner join personne as p on ser.idPersonne = p.id
    inner join exposant as ex on ser.idExposant = ex.id
    inner join lieu as l on ex.numLieu = l.num ;
    
