
create or replace view PersonneExposantExposer as
select 
    ser.idAuteur,
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
    inner join personne as au on ser.idAuteur = au.id
    inner join exposant as ex on ser.idExposant = ex.id

