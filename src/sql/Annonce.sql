-- Auteur: Kevin MEYER - 16/11/2026

-- Annonces affichées en haut de l'accueil (atelier annulé, changement de salle...)
create table if not exists annonce (
    id int not null auto_increment primary key,
    texte varchar(300) not null,
    couleur varchar(20) not null default 'primary',
    debut datetime default null,
    fin datetime default null,
    active tinyint(1) not null default 1
) ;
