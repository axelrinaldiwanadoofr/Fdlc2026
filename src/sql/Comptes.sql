-- Auteur: Kevin MEYER - 18/11/2026

-- Tables des comptes de la configuration (créées toutes seules à la première connexion,
-- à lancer à la main seulement si l'utilisateur MySQL n'a pas le droit CREATE)
create table if not exists fdlc_role ( id int not null auto_increment primary key, nom varchar(40) not null unique, niveau int not null,
    couleur varchar(7) not null default '#6b7280' ) engine=InnoDB ;

create table if not exists fdlc_permission ( idRole int not null, code varchar(40) not null, primary key ( idRole, code ) ) engine=InnoDB ;

create table if not exists fdlc_compte ( id int not null auto_increment primary key, identifiant varchar(50) not null unique,
    hash varchar(255) not null, estRoot tinyint(1) not null default 0, idRole int default null, idPersonne int default null unique,
    actif tinyint(1) not null default 1, doitChanger tinyint(1) not null default 0, version int not null default 1,
    essais int not null default 0, bloqueJusqua datetime default null, derniereConnexion datetime default null,
    creeLe datetime not null ) engine=InnoDB ;

create table if not exists fdlc_journal ( id int not null auto_increment primary key, date datetime not null, idCompte int default null,
    identifiant varchar(50) default null, action varchar(60) not null, detail varchar(255) default null, ip varchar(45) default null ) engine=InnoDB ;

create table if not exists fdlc_annonce ( id int not null auto_increment primary key, texte varchar(300) not null,
    couleur varchar(20) not null default 'primary', debut datetime default null, fin datetime default null,
    active tinyint(1) not null default 1 ) engine=InnoDB ;
