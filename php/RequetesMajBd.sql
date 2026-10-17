



rename table stand to lieu ;
rename table auteur to personne ;

alter table personne add type varchar(10) null ;

update lieu set nom = num where type = "stand" ;

alter table lieu add nom varchar(50) null ;
alter table lieu add type varchar(20) null ;

create table typelieu( type varchar(20) not null) ;
alter table typelieu add constraint pk_typelieu primary key(type) ;

insert into typelieu( type ) values( 'stand' ) ;
insert into typelieu( type ) values( 'toilettes' ) ;
insert into typelieu( type ) values( 'restaurant' ) ;
insert into typelieu( type ) values( 'théatre' ) ;

update lieu set type = 'stand' ;

alter table `lieu` add constraint `fk_lieu_typelieu` foreign key( `type` ) 
references `typelieu`( `type` ) ;

create table specialite( specialite varchar(20) not null) ;
alter table specialite add constraint pk_specialite primary key(specialite) ;

insert into specialite( specialite ) values( 'auteur' ) ;
insert into specialite( specialite ) values( 'animateur' ) ;
insert into specialite( specialite ) values( 'politique' ) ;
insert into specialite( specialite ) values( 'critique' ) ;

alter table personne add specialite varchar(20) null ;
update personne set specialite = 'auteur' ;

ALTER TABLE `personne` ADD CONSTRAINT `fk_personne_specialite` FOREIGN KEY (`specialite`) REFERENCES `specialite`(`specialite`) ON DELETE RESTRICT ON UPDATE RESTRICT;
alter table personne add constraint `fk_personne_specialite` foreign key( `specialite` ) 
references `specialite`( `specialite` ) ;

create table editeur( id int not null, nom varchar(80) ) ;
alter table editeur add constraint pk_editeur primary key(id) ;

create table genre( genre varchar(20) not null ) ;
alter table genre add constraint pk_genre primary key(genre) ;

create table livre( 
    id int not null, 
    titre varchar(80), 
    resume varchar(1000), 
    idEditeur int,
    genre varchar(20) ) ;
alter table livre add constraint pk_livre primary key(id) ;

ALTER TABLE `livre` ADD CONSTRAINT `fk_livre_editeur` FOREIGN KEY (`idEditeur`) REFERENCES `editeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE; 
ALTER TABLE `livre` ADD CONSTRAINT `fk_livre_genre` FOREIGN KEY (`genre`) REFERENCES `genre`(`genre`) ON DELETE RESTRICT ON UPDATE CASCADE;

insert into genre values( "SF") ;
insert into genre values( "histoire") ;
insert into genre values( "policier") ;
insert into genre values( "cuisine") ;
insert into genre values( "alsatique") ;
insert into genre values( "roman") ;
insert into genre values( "BD") ;

create table ecrire( idPersonne int not null, idLivre int not null ) ;
alter table ecrire add constraint pk_ecrire primary key(idPersonne, idLivre) ;

ALTER TABLE `ecrire` ADD CONSTRAINT `fk_ecrire_personne` FOREIGN KEY (`idPersonne`) REFERENCES `personne`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE; 
ALTER TABLE `ecrire` ADD CONSTRAINT `fk_ecrire_livre` FOREIGN KEY (`idLivre`) REFERENCES `livre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

create table typeevenement( type varchar(30) not null ) ;
alter table typeevenement add constraint pk_typeevenement primary key(type) ;

create table evenement( 
    id int not null, 
    typeevenement varchar(30),
    titre varchar(80),
    theme varchar(40),
    commentaire varchar(1000),
    debut datetime,
    fin datetime,
    idAnimateur int ) ;
alter table evenement add constraint pk_evenement primary key(id) ;

create table presenter( 
    idEvenement int not null, 
    idLivre int not null );

alter table presenter add constraint pk_presenter primary key(idEvenement, idLivre) ;

ALTER TABLE `evenement` ADD CONSTRAINT `fk_evenement_typeevenment` FOREIGN KEY (`typeevenement`) REFERENCES `typeevenement`(`type`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `presenter` ADD CONSTRAINT `fk_presenter_livre` FOREIGN KEY (`idLivre`) REFERENCES `livre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `presenter` ADD CONSTRAINT `fk_presenter_evenement` FOREIGN KEY (`idEvenement`) REFERENCES `evenement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `evenement` ADD CONSTRAINT `fk_evenement_personne` FOREIGN KEY (`idAnimateur`) REFERENCES `personne`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `lieu` ADD CONSTRAINT `fk_lieu_typelieu` FOREIGN KEY (`type`) REFERENCES `typelieu`(`type`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `personne` ADD CONSTRAINT `fk_personne_specialite` FOREIGN KEY (`specialite`) REFERENCES `specialite`(`specialite`) ON DELETE CASCADE ON UPDATE CASCADE;
