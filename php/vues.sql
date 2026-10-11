
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
    inner join exposant as ex on ser.idExposant = ex.id

alter table auteur add type varchar(10) null ;