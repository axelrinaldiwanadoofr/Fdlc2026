-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 24 sep. 2026 à 15:01
-- Version du serveur : 8.0.31
-- Version de PHP : 8.1.13

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

DELIMITER $$
--
-- Procédures
--
DROP PROCEDURE IF EXISTS `compteur`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `compteur` ()   BEGIN
    DECLARE x INT;
    SET x = 1;
    WHILE x  <= 5 DO
      SET  x = x + 1;
    END WHILE;
    SELECT x;  -- 6
  END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `auteur`
--

DROP TABLE IF EXISTS `auteur`;
CREATE TABLE IF NOT EXISTS `auteur` (
  `id` int NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `exposant`
--

DROP TABLE IF EXISTS `exposant`;
CREATE TABLE IF NOT EXISTS `exposant` (
  `nom` varchar(50) NOT NULL,
  `numStand` int NOT NULL,
  PRIMARY KEY (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `exposer`
--

DROP TABLE IF EXISTS `exposer`;
CREATE TABLE IF NOT EXISTS `exposer` (
  `nomExposant` varchar(50) NOT NULL,
  `idAuteur` int NOT NULL,
  `samedi_am` tinyint(1) NOT NULL DEFAULT '0',
  `samedi_pm` tinyint(1) NOT NULL DEFAULT '0',
  `dimanche_am` tinyint(1) NOT NULL DEFAULT '0',
  `dimanche_pm` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `hall`
--

DROP TABLE IF EXISTS `hall`;
CREATE TABLE IF NOT EXISTS `hall` (
  `id` int NOT NULL,
  `nom` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `import`
--

DROP TABLE IF EXISTS `import`;
CREATE TABLE IF NOT EXISTS `import` (
  `COL 1` varchar(43) DEFAULT NULL,
  `COL 2` varchar(18) DEFAULT NULL,
  `COL 3` varchar(52) DEFAULT NULL,
  `COL 4` varchar(9) DEFAULT NULL,
  `COL 5` varchar(6) DEFAULT NULL,
  `COL 6` varchar(10) DEFAULT NULL,
  `COL 7` varchar(8) DEFAULT NULL,
  `COL 8` varchar(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `import`
--

INSERT INTO `import` (`COL 1`, `COL 2`, `COL 3`, `COL 4`, `COL 5`, `COL 6`, `COL 7`, `COL 8`) VALUES
('Aude', 'Ziegelmeyer', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Camille', 'Tisserand', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Anne', 'Théréné', 'Le Texte et la Parole', '402', 'X', 'X', 'X', 'X'),
('Adèle', 'Tariel', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Laetitia', 'Sivi', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Tom', 'Sorroldoni', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Eugène', 'Santangelo', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Sophie ', 'Rigal-Goulard', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Pascal', 'Prévot', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Frédéric', 'Pillot', 'Librairie La Bouquinette', '413', '', '', 'X', 'X'),
('Florence', 'Pirot', 'Le Jardin des Mots', '400', '', '', 'X', 'X'),
('Clotilde', 'Perrin', 'Librairie La Bouquinette', '413', 'X', 'X', '', ''),
('Jérôme', 'Peyrat', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Mathilde ', 'Paris', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Jérémy', 'Pailler', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Marine ', 'Orenga', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('', 'Nikol', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Anne', 'Mongeot', 'Éditions l\'Inattendue', '422', 'X', 'X', '', ''),
('Cyrille', 'Meyer', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Caroline', 'Millet', 'Librairie La Bouquinette', '413', 'X', 'X', '', ''),
('Caroline ', 'Meyer', 'Éditions l\'Inattendue', '422', 'X', 'X', '', ''),
('Isabelle', 'Meyer', 'Éditions Le Pont du Vent', '409', 'X', 'X', 'X', 'X'),
('Philippe', 'Matter', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Marie-Astrid', 'Masson', 'Alice Éditions', '411', 'X', 'X', 'X', ''),
('Lorraine', 'Marchand', 'Éditions Le Pont du Vent', '409', '', '', 'X', 'X'),
('Jean-Luc', 'Marcastel', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Julian', 'Marchais', 'Éditions l\'Inattendue', '422', 'X', 'X', 'X', 'X'),
('Colombe', 'Linotte', 'Librairie La Bouquinette', '413', '', '', 'X', 'X'),
('Virginie', 'Loth', 'Éditions l\'Inattendue', '422', '', '', 'X', 'X'),
('Erik', 'L\'Homme', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Xavier', 'Lhomme', 'Éditions l\'Inattendue', '422', 'X', 'X', 'X', 'X'),
('', 'Krocui', 'Librairie La Bouquinette', '413', 'X', 'X', '', ''),
('Camille', 'Kromer', 'Éditions l\'Inattendue', '422', '', '', 'X', 'X'),
('Christian', 'Heinrich', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Florence', 'Jenner Metz', 'Librairie La Bouquinette | Alice Éditions', '413|411', 'X', 'X', 'X', 'X'),
('Quentin', 'Girardclos', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Maxime', 'Gillio', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('', 'Georgette', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Gaëlle', 'Fratelli', 'Éditions l\'Inattendue', '422', 'X', 'X', 'X', 'X'),
('Claire', 'Frossard', 'Librairie La Bouquinette', '413', 'X', 'X', '', ''),
('Emilie', 'Fischesser', 'Éditions l\'Inattendue', '422', '', '', 'X', 'X'),
('Catherine ', 'Duchêne', 'Le Texte et la Parole', '402', 'X', 'X', 'X', 'X'),
('Jacques-Marie', 'Duchêne', 'Le Texte et la Parole', '402', 'X', 'X', 'X', 'X'),
('Marie', 'Dorléans', 'Librairie La Bouquinette', '413', '', '', 'X', 'X'),
('Alice', 'Dozier', 'Librairie La Bouquinette', '413', '', '', 'X', 'X'),
('Stéphanie', 'Desbenoit', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Maëlle', 'Desart', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Julian', 'Delgrange', 'Le Jardin des Mots', '400', '', 'X', '', 'X'),
('Benoît', 'Debecker', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Magali', 'Clavelet', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Charline', 'Colette', 'Librairie La Bouquinette', '413', 'X', 'X', '', ''),
('Aurélie', 'Chien Chow Chine', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Alexandre', 'Chardin', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Laurent', 'Cardon', 'Éditions Père Fouettard', '412', 'X', 'X', 'X', 'X'),
('Thierry', 'Chapeau', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Lorena', 'Calderon', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('', 'Canizales', 'Arlequin Éditions', '427', 'X', 'X', 'X', 'X'),
('Mickaël', 'Brun-Arnaud', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Jean-Baptiste', 'Bozzi', 'Itak Éditions', '420', 'X', 'X', 'X', 'X'),
('Crescence', 'Bouvarel', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Sandy', 'Bizzozzero', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Rosalinde', 'Bonnet', 'Librairie La Bouquinette', '413', 'X', 'X', '', ''),
('Enzo', 'Berkati', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Iwona', 'Barzasi', 'Éditions l\'Inattendue', '422', 'X', 'X', '', ''),
('Alix', 'Bellac', 'Arlequin Éditions', '427', 'X', 'X', 'X', 'X'),
('Gaël', 'Aymon', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Emilie', 'Angebault', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X'),
('Fanny', 'Anthony', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Maïwenn', 'Alix', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Pascal', 'Alexandre', 'Le Texte et la Parole', '402', 'X', 'X', 'X', 'X'),
('', '', '', '', '', '', '', ''),
('Jeunesse | Hall 4 et librairies partenaires', '', '', '', '', '', '', ''),
('Edgar', 'Zeidler', 'Heimetsproch un tràdition', '232', 'X', 'X', '', ''),
('Anne-Marie', 'Wimmer', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Bernard', 'Wittmann', 'Comité féd Asso langue et Cullture Alsace et Moselle', '403', 'X', 'X', '', ''),
('Julien-Thomas', 'Will', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X'),
('Marine', 'Westphal', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X'),
('Hugues', 'Werlé', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Jean-Philippe', 'Wagner', 'Bastian Éditions', '315', 'X', 'X', 'X', 'X'),
('Serge', 'Weber', 'I.D. l\'Édition', '311', '', '', 'X', 'X'),
('Karine', 'W. Meyer', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Denis', 'Voigne', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Tristan', 'Vuano', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Jean', 'Vigne', 'Éditions du Petit Caveau', '312', 'X', 'X', 'X', 'X'),
('Manuel', 'Verlange', 'Association des Éditeurs belges', '328', 'X', '', '', 'X'),
('Rose-Marie', 'Van-Thom', 'Auxilivre', '302', 'X', 'X', 'X', 'X'),
('Cindy', 'Vandermeulen', 'Association des Éditeurs belges', '328', '', 'X', '', 'X'),
('Mickaël', 'Uras', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Jean-Pierre', 'Vançon', 'Auxilivre', '302', 'X', 'X', 'X', 'X'),
('Fébronie', 'Tsassis', 'Association des Éditeurs belges', '328', '', '', '', 'X'),
('Joëlle', 'Umbdenstock', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Evelyne', 'Troxler', 'Heimetsproch un tràdition', '232', '', '', 'X', 'X'),
('Jacques-Olivier', 'Trompas', 'ALL Bourgogne Franche-Comté', '306', '', '', 'X', 'X'),
('Lucien', 'Tramontana', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X'),
('Sophie', 'Tal Men', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?'),
('Joséphine', 'Tassy', 'Editions l\'Iconoclaste', '222', 'X', 'X', 'X', 'X'),
('Niko', 'Tackian', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?'),
('Jean-Pierre', 'Stucki-Darsch', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', ''),
('Dan', 'Steffan', 'Éditions du Tourneciel', '332', '', 'X', '', ''),
('Estelle', 'Strub', 'Heimetsproch un tràdition', '232', '', '', 'X', 'X'),
('Jean-Louis', 'Spiesser', 'Comité féd Asso langue et Cullture Alsace et Moselle', '403', 'X', 'X', 'X', 'X'),
('Christophe', 'Sonesaksith', 'L\'Esprit BD', '504', 'X', 'X', 'X', 'X'),
('Soum Phone', 'Singharat', 'L\'Esprit BD', '504', 'X', 'X', 'X', 'X'),
('Yann', 'Siefert', 'I.D. l\'Édition', '311', '', '', 'X', 'X'),
('Anouk', 'Shutterberg', 'Librairie Pleine Page', '308', '', '', '', ''),
('Elebora', 'Sentier', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Geneviève ', 'Senger', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Jean-François', 'Schwaiger', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', ''),
('Francis', 'Schull', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X'),
('Sandra', 'Schuhler-Bastian', 'Bastian Éditions', '315', 'X', 'X', 'X', 'X'),
('Stéphane', 'Schmucker', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X'),
('Richard', 'Schalck', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Suzel', 'Schmitt', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Cédric', 'Sauriat', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Virginie ', 'Saint-Martin', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Clarisse', 'Sabard', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?'),
('Allan', 'Ryan', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X'),
('Nathalie', 'Rouyer', 'Éditions Rebelyne', '303', 'X', 'X', 'X', 'X'),
('Stéphane', 'Rougier', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Suzanne', 'Roth', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X'),
('Laure', 'Rollier', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X'),
('Patrick', 'Richard', 'Éditions Rebelyne', '303', '', '', 'X', 'X'),
('Daniel', 'Reutenauer', 'Librairie Biblique Certitude', '301', 'X', 'X', 'X', 'X'),
('Clara', 'Renard', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Sylvie', 'Reff', 'Auxilivre | I.D. l\'Édition', '302 | 311', 'X', 'X', 'X', 'X'),
('Antoine', 'Renand', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?'),
('Michel', 'Rederon', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Nico', 'Prat', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Alexandra ', 'Puppinck Bortoli', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Carène', 'Ponte', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?'),
('Olivier', 'Pirnay', 'Association des Éditeurs belges', '328', '', 'X', '', ''),
('Laurence', 'Peyrin', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?'),
('Jocelyn', 'Peyret', 'Librairie Le Chat Perché', '222', '', '', 'X', 'X'),
('Gilles', 'Petitdemange', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Fabienne', 'Périneau', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X'),
('Sylvie ', 'Pérenne', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Stéphanie', 'Perez', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X'),
('Anne', 'Percin', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X'),
('L.M.', 'Péquignot', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Bernard', 'Pascuitto', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Yves', 'Ouallet', 'Éditions Phloème', '223', 'X', 'X', 'X', 'X'),
('Nicole', 'Oudin', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X'),
('Fabien', 'Onteniente', 'Librairie RUC', '304', '', '', '', ''),
('Virginie', 'Ollagnier', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Françoise', 'Olivier-Utard', 'Comité d\'Histoire Régionale', '226', '', '', 'X', 'X'),
('Claire', 'Norton', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Minh Thuyen', 'Nhu', 'Auxilivre', '302', 'X', 'X', 'X', 'X'),
('Nathalie', 'Nhu', 'Auxilivre', '302', 'X', 'X', 'X', 'X'),
('Tuyêt-Nga', 'Nguyên', 'Association des Éditeurs belges', '328', '', 'X', '', 'X'),
('Michel', 'Munier', 'Librairie Le Chat Perché', '222', 'X', 'X', '', ''),
('Cédric', 'Neveu', 'Comité d\'Histoire Régionale', '226', '', '', 'X', 'X'),
('', 'Les Moustichats', 'La Plume Colmarienne', '207', 'X', 'X', '', ''),
('Véronique', 'Mougin', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X'),
('Roland', 'Moser', 'Reber Éditions | Couloir du Temps', '327', 'X', 'X', 'X', 'X'),
('Jessica', 'Motron', 'L\'Alsacienne Indépendante', '303', 'X', 'X', 'X', 'X'),
('Élodie', 'Morgen', 'L\'Alsacienne Indépendante', '303', 'X', 'X', 'X', 'X'),
('Simone', 'Morgenthaler', 'La Nuée Bleue | I.D. l\'Édition', '309 | 311', 'X', 'X', 'X', 'X'),
('Brigitte', 'Moreau', 'Association des Éditeurs belges', '328', '', 'X', '', 'X'),
('Fred', 'Moray', 'Association des Éditeurs belges', '328', '', 'X', '', ''),
('Marion', 'Miquel', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Patrick', 'Milano', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Niels', 'Minkmar', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Jean-Christophe', 'Meyer', 'Éditions du Tourneciel', '332', 'X', 'X', 'X', 'X'),
('Aude ', 'Meunier', 'Association des Éditeurs belges', '328', '', 'X', 'X', ''),
('Alexis', 'Metzinger', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', ''),
('Kokouvi Roméo', 'Messa-Gavo', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Ian', 'McGuire', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X'),
('Bertrand', 'Merle', 'Médiapop', '319', 'X', 'X', 'X', 'X'),
('Kate', 'Mc Alistair', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X'),
('Caroline', 'Masse', 'Association des Éditeurs belges', '328', '', 'X', '', ''),
('Martine', 'Maurer Khachoyan', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Anne-Sophie', 'Martin', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X'),
('Laure', 'Manel', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Ian', 'Manook', 'Librairie Pleine Page', '308', '', 'X', 'X', 'X'),
('Mathias', 'Malzieu', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?'),
('Joël', 'Mallet', 'La Capsule', '501', 'X', 'X', 'X', 'X'),
('Gabrielle', 'Makli', 'Auxilivre', '302', 'X', 'X', 'X', 'X'),
('Thierry', 'Maire', 'La Capsule', '501', 'X', 'X', 'X', 'X'),
('', 'Maïlis', 'L\'Alsacienne Indépendante', '303', 'X', 'X', 'X', 'X'),
('Joseph', 'Macé-Scaron', 'Espace Culturel E. Leclerc', '323', '', '', '', ''),
('Perrine', 'M. Schaller', 'I.D. l\'Édition', '311', 'X', 'X', '', ''),
('Nathalie', 'Ludwig', 'La Plume Colmarienne', '207', '', '', 'X', 'X'),
('Philippe', 'Lutz', 'Médiapop', '319', 'X', 'X', 'X', 'X'),
('Sophie', 'Loubière', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X'),
('', 'Lola', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Michel', 'Loetscher', 'Auxilivre', '302', 'X', 'X', 'X', 'X'),
('Hervé', 'Lévy', 'Médiapop', '319', 'X', 'X', 'X', 'X'),
('Éric', 'Libiot', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Charlotte', 'Léman', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?'),
('Florian', 'Leaune', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Michaël', 'Landolt', 'Comité d\'Histoire Régionale', '226', '', '', '', ''),
('Jacqueline', 'Lahsen', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Pierre', 'Kretz', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', 'X', 'X'),
('Isabelle', 'Lagarrigue', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X'),
('', 'Kraffab', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('', 'KP Illustratrice', 'L\'Esprit BD', '504', 'X', 'X', 'X', 'X'),
('Jean-François', 'Kovar', 'La Nuée Bleue / Ebra éditions', '309', '', 'X', '', ''),
('Pierre', 'Koenig', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Hadrien ', 'Klent (en attente)', 'Librairie Pleine Page', '308', '?', '?', 'X', 'X'),
('Jack', 'Koch', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Pierre', 'Klein', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('René', 'Kill', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Françoise', 'Kerymer', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X'),
('Julia', 'Kerninon', 'Editions l\'Iconoclaste', '222', 'X', 'X', 'X', ''),
('Nicolas ', 'Kempf', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', 'X', 'X'),
('Gilbert', 'Keller', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Cynthia', 'Kafka', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?'),
('Alessia', 'Karre', 'Association des Éditeurs belges', '328', '', '', '', 'X'),
('Marie-Christine', 'Jung', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X'),
('Frank', 'Jung', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X'),
('Florence', 'Jou', 'Librairie Le Chat Perché', '222', '', 'X', 'X', 'X'),
('Dominique', 'Jarrassé', 'Comité d\'Histoire Régionale', '226', 'X', 'X', 'X', 'X'),
('Sophie', 'Jomain', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Jeanfi', 'Janssens', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Jean-Marie', 'Jaeger', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Agnès', 'Jaeger', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Virginie', 'Humbrecht', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X'),
('Sandrine', 'Holder', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Florian', 'Hensel', 'Comité d\'Histoire Régionale', '226', 'X', 'X', 'X', 'X'),
('Léo', 'Henry', 'Librairie Le Chat Perché', '222', 'X', 'X', '', ''),
('Joël', 'Henry', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', ''),
('Eva', 'Hébert', 'Éditions du Tourneciel', '332', 'X', 'X', '', ''),
('Serge', 'Hastom', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X'),
('Amélie', 'Hanser', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Éric', 'Halphen', 'Librairie Pleine Page', '308', '', '', '', ''),
('Martine', 'Haas-Nunge', 'Auxilivre', '302', 'X', 'X', 'X', 'X'),
('Nathalie', 'Haberstroh', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Francis', 'Guthleben', 'Reber Éditions | Couloir du Temps', '327', 'X', 'X', 'X', 'X'),
('Hervé', 'Gueth', 'Auxilivre', '302', 'X', 'X', 'X', 'X'),
('Dominique', 'Guibbert', 'Reber Éditions | Couloir du Temps', '327', '', 'X', '', 'X'),
('André', 'Groshans', 'Auxilivre', '302', 'X', 'X', 'X', 'X'),
('Pablo', 'Gubitsch', 'Association des Éditeurs belges', '328', 'X', '', '', ''),
('Olivier ', 'Grondeau', 'Editions l\'Iconoclaste', '222', 'X', 'X', 'X', 'X'),
('Florence', ' Griffond ', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X'),
('Laure', 'Gouraige', 'Librairie Pleine Page', '308', '', '', '', ''),
('Delphine', 'Giraud', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?'),
('Raphaëlle', 'Giordano', 'Librairie Pleine Page', '308', 'X', 'X', '', ''),
('Clémence ', 'Germain', 'Le monde de Théo', '218', '', 'X', '', 'X'),
('Sandrine', 'Gendreau', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X'),
('Aurélien', 'Gautherie', 'Librairie Pleine Page', '308', '', '', 'X', 'X'),
('Christophe', 'Gatti', 'Comité d\'Histoire Régionale', '226', 'X', 'X', 'X', 'X'),
('Paul ', 'Gasnier', 'Librairie le Libroscope', '222', 'X', 'X', '', ''),
('Françoise', 'Gardeur', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', '', ''),
('Sylvain', 'Freyburger', 'Médiapop', '319', 'X', 'X', 'X', 'X'),
('Nick', 'Gardel', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Jacques', 'Fortier', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', 'X', 'X'),
('Ena', 'Fitzbel', 'Librairie Pleine Page', '308', 'X', 'X', 'X', ''),
('Benjamin', 'Fogel', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Alex', 'Fick-Muller', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Anouk', 'Filippini', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?'),
('Anne-Gaëlle', 'Féjoz', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', '', ''),
('Roger ', 'Faindt', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X'),
('Françoise', 'Elkouby', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Constantin', 'Enache', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Jean-Luc', 'Eling', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Bénédicte', 'Dupré La Tour', 'Librairie le Libroscope', '222', '', 'X', 'X', 'X'),
('Lara', 'Dopff', 'Éditions Phloème', '223', 'X', 'X', 'X', 'X'),
('Francis', 'Dopff', 'Éditions Phloème', '223', 'X', 'X', 'X', 'X'),
('Abibou', 'Diouf', 'Librairie Pleine Page', '308', '', '', '', ''),
('Ndongo', 'Diop', 'Association des Éditeurs belges', '328', '', '', 'X', ''),
('Bruno', 'Dinant', 'Association des Éditeurs belges', '328', '', 'X', '', 'X'),
('Adeline', 'Dieudonné', 'Editions l\'Iconoclaste', '222', 'X', 'X', 'X', ''),
('Sonia', 'Devillers', 'Librairie RUC', '304', 'X', 'X', '', ''),
('Maxine', 'Delly', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Erwan', 'Desbois', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Christian', 'Debast', 'Association des Éditeurs belges', '328', '', '', '', 'X'),
('Philippe', 'De Riemaecker', 'Association des Éditeurs belges', '328', '', 'X', '', ''),
('Audrey', 'De Matos', 'Association des Éditeurs belges', '328', '', '', 'X', ''),
('Prescille', 'De Rekenlere', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X'),
('Stéphanie', 'De Bussierre', 'Éditions Akinomé', '318', 'X', 'X', 'X', 'X'),
('Christine', 'Daux', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X'),
('Coralie', 'Darcy', 'L\'Alsacienne Indépendante', '303', 'X', '', '', ''),
('Véronique', 'Daul', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Linda', 'Da Silva', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X'),
('Caroline ', 'Costa', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X'),
('Jade', 'Corbeau', 'Éditions du Petit Caveau', '312', 'X', 'X', 'X', 'X'),
('Laura', 'Collins', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Camille', 'Colva', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Bernard', 'Colin', 'Éditions Rebelyne', '303', 'X', 'X', 'X', 'X'),
('Monique', 'Coant-Blond', 'Association des Éditeurs belges', '328', 'X', '', '', ''),
('Monique', 'Clausse', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Caroline', 'Claude-Bronner', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', ''),
('Michel', 'Chevallier', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Fred', 'Cimbao', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X'),
('Jean-Pierre', 'Chassard', 'I.D. l\'Édition | Librairie RUC', '311|304', 'X', 'X', 'X', 'X'),
('Naëlle', 'Charles', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X'),
('Ambre ', 'Chalumeau', 'Editions l\'Iconoclaste', '222', 'X', 'X', 'X', 'X'),
('Muriel', 'Chacon', 'Comité féd Asso langue et Cullture Alsace et Moselle', '403', '', '', 'X', 'X'),
('Maloria', 'Cassis', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X'),
('Catherine', 'Ceylac', 'Espace Culturel E. Leclerc', '323', '', '', '', ''),
('Maurice', 'Carrez', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', ''),
('Christophe', 'Carmona', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Annie', 'Camacho', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Cécile', 'Cabanac', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('André', 'Cabaret', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Pierre-Louis', 'Buzzi', 'Comité d\'Histoire Régionale', '226', '', '', '', ''),
('Sandra', 'Butch', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('John', 'Bullit', 'Éditions Rebelyne', '303', 'X', 'X', '', ''),
('David', 'Bulle', 'La Capsule', '501', 'X', 'X', 'X', 'X'),
('Gabriel', 'Braeuner', 'I.D. l\'Édition', '311', '', '', 'X', 'X'),
('Victorien', 'Bornéat', 'Librairie Le Chat Perché', '222', 'X', 'X', '', ''),
('Anne-Lyse', 'Blasco', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X'),
('Marie-Andrée', 'Bohn', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X'),
('Romain', 'Blandre', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', ''),
('Emily', 'Blaine', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '', ''),
('Georges', 'Bischoff', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', ''),
('Pierre', 'Bieber', 'Comité féd Asso langue et Cullture Alsace et Moselle', '403', 'X', 'X', 'X', 'X'),
('Catherine', 'Benhamou', 'Librairie Le Chat Perché', '222', '', '', 'X', 'X'),
('Lucie', 'Bernard', 'L\'Alsacienne Indépendante', '303', '', 'X', 'X', ''),
('Sabine', 'Bengel', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X'),
('Jean-Pierre', 'Beck', 'Auxilivre', '302', 'X', 'X', 'X', 'X'),
('Marie', 'Bellarry', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X'),
('André', 'Bechler', 'Reber Éditions | Couloir du Temps', '327', 'X', 'X', 'X', 'X'),
('Alain', 'Bauer', 'Librairie RUC', '304', 'X', 'X', '', ''),
('Hugues', 'Baum', 'Médiapop', '319', 'X', 'X', 'X', 'X'),
('Sabine', 'Barth', 'Auxilivre', '302', 'X', 'X', 'X', 'X'),
('Marie', 'Battinger', 'Librairie RUC', '304', 'X', 'X', 'X', 'X'),
('Solène', 'Bakowski', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X'),
('Lilie', 'Bagage', 'La Capsule', '501', 'X', 'X', 'X', 'X'),
('Virginie ', 'Avril', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X'),
('Baptiste', 'Antoine', 'Comité d\'Histoire Régionale', '226', 'X', 'X', 'X', 'X'),
('Vanessa', 'Arenaga', 'Association des Éditeurs belges', '328', '', '', 'X', 'X'),
('Roland', 'Anstett', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X'),
('Bénédicte', 'Ammar', 'L\'Esprit BD', '504', 'X', 'X', 'X', 'X'),
('Ninon', 'Amey', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X'),
('Christian', 'Albecker', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X'),
('Martin', 'Adamiec', 'Éditions du Tourneciel', '332', '', '', 'X', 'X'),
('Auteurs', '', '', '', '', '', '', ''),
('Prénom ', 'Nom ', 'Exposants', 'Stand ', 'matin', 'après-midi', ' matin', 'après-midi '),
('', '', '', '', 'Samedi', '', 'Dimanche', '');

-- --------------------------------------------------------

--
-- Structure de la table `stand`
--

DROP TABLE IF EXISTS `stand`;
CREATE TABLE IF NOT EXISTS `stand` (
  `num` int NOT NULL,
  `x1` int DEFAULT NULL,
  `y1` int DEFAULT NULL,
  `x2` int DEFAULT NULL,
  `y2` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
