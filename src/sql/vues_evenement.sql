-- phpMyAdmin SQL Dump (fusion)
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 19 nov. 2026 à 09:18
-- Version du serveur : 8.4.7
-- Version de PHP : 8.3.28
--
-- Vues : evenementprogramme, evenementpersonne, evenementlivre
-- Ordre important : evenementlivre dépend de evenementpersonne.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `fdlc`
--

-- --------------------------------------------------------

--
-- Structure de la vue `evenementprogramme`
--

DROP VIEW IF EXISTS `evenementprogramme`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `evenementprogramme`  AS SELECT `e`.`id` AS `id`, `e`.`type` AS `type`, `e`.`titre` AS `titre`, `e`.`stitre` AS `stitre`, `e`.`public` AS `public`, `e`.`commentaire` AS `commentaire`, `e`.`debut` AS `debut`, `e`.`fin` AS `fin`, `e`.`idAnimateur` AS `idAnimateur`, `e`.`numLieu` AS `numLieu`, `l`.`nom` AS `nomLieu`, `l`.`type` AS `typeLieu`, `l`.`hall` AS `hall`, `p`.`prenom` AS `prenomAnimateur`, `p`.`nom` AS `nomAnimateur`, `p`.`specialite` AS `specialiteAnimateur`, trim(concat(coalesce(`p`.`prenom`,''),' ',coalesce(`p`.`nom`,''))) AS `animateur`, cast(`e`.`debut` as date) AS `jourdebut`, date_format(`e`.`debut`,'%H:%i') AS `heuredebut`, ((`e`.`debut` is not null) and (cast(`e`.`debut` as time) = '00:00:00')) AS `touteLaJournee`, ((`e`.`debut` is null) or (dayofweek(`e`.`debut`) in (7,1))) AS `pendantFestival` FROM ((`evenement` `e` left join `lieu` `l` on((`l`.`num` = `e`.`numLieu`))) left join `personne` `p` on((`p`.`id` = `e`.`idAnimateur`))) ;

-- --------------------------------------------------------

--
-- Structure de la vue `evenementpersonne`
--

DROP VIEW IF EXISTS `evenementpersonne`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `evenementpersonne`  AS SELECT `e`.`id` AS `idEvenement`, `p`.`id` AS `idPersonne`, `p`.`prenom` AS `prenom`, `p`.`nom` AS `nom`, `p`.`specialite` AS `specialite`, 'animateur' AS `role`, 1 AS `estAnimateur` FROM (`evenement` `e` join `personne` `p` on((`p`.`id` = `e`.`idAnimateur`)))union select `pr`.`idEvenement` AS `idEvenement`,`p`.`id` AS `id`,`p`.`prenom` AS `prenom`,`p`.`nom` AS `nom`,`p`.`specialite` AS `specialite`,'livre présenté' AS `livre présenté`,0 AS `0` from ((`presenter` `pr` join `ecrire` `ec` on((`ec`.`idLivre` = `pr`.`idLivre`))) join `personne` `p` on((`p`.`id` = `ec`.`idPersonne`))) union select `e`.`id` AS `id`,`p`.`id` AS `id`,`p`.`prenom` AS `prenom`,`p`.`nom` AS `nom`,`p`.`specialite` AS `specialite`,'invité' AS `invité`,0 AS `0` from (`evenement` `e` join `personne` `p` on(((length(trim(coalesce(`p`.`nom`,''))) > 1) and (trim(coalesce(`p`.`prenom`,'')) <> '') and ((`e`.`titre` like concat('%',trim(`p`.`prenom`),' ',trim(`p`.`nom`),'%')) or (`e`.`stitre` like concat('%',trim(`p`.`prenom`),' ',trim(`p`.`nom`),'%')) or (`e`.`commentaire` like concat('%',trim(`p`.`prenom`),' ',trim(`p`.`nom`),'%'))))))  ;

-- --------------------------------------------------------

--
-- Structure de la vue `evenementlivre`
--

DROP VIEW IF EXISTS `evenementlivre`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `evenementlivre`  AS SELECT `pr`.`idEvenement` AS `idEvenement`, `l`.`id` AS `idLivre`, `l`.`titre` AS `titre`, 'présenté' AS `origine` FROM (`presenter` `pr` join `livre` `l` on((`l`.`id` = `pr`.`idLivre`)))union select `ep`.`idEvenement` AS `idEvenement`,`l`.`id` AS `id`,`l`.`titre` AS `titre`,'invité' AS `invité` from ((`evenementpersonne` `ep` join `ecrire` `ec` on((`ec`.`idPersonne` = `ep`.`idPersonne`))) join `livre` `l` on((`l`.`id` = `ec`.`idLivre`))) where (`ep`.`estAnimateur` = 0)  ;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
