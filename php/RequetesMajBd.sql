


alter table auteur add type varchar(10) null ;

rename table stand to lieu ;
rename table auteur to personne ;

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
