-- phpMyAdmin SQL Dump
-- version 5.2.2deb1+deb13u1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : lun. 09 nov. 2026 à 10:10
-- Version du serveur : 11.8.6-MariaDB-0+deb13u1 from Debian
-- Version de PHP : 8.4.26

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
-- Structure de la table `ecrire`
--

CREATE TABLE `ecrire` (
  `idPersonne` int(11) NOT NULL,
  `idLivre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `ecrire`
--

INSERT INTO `ecrire` (`idPersonne`, `idLivre`) VALUES
(23, 1),
(155, 2),
(155, 3),
(28, 4),
(127, 5),
(117, 6),
(67, 7),
(83, 8),
(11, 10),
(195, 11),
(105, 12),
(150, 13),
(205, 14),
(93, 15),
(68, 16),
(71, 17),
(137, 18),
(198, 19),
(14, 20),
(14, 21),
(14, 22),
(200, 23),
(126, 24),
(235, 25),
(107, 26),
(107, 27),
(157, 28),
(88, 30),
(171, 31),
(199, 31),
(309, 32),
(270, 33),
(146, 35),
(209, 36),
(119, 38),
(41, 40),
(97, 41),
(91, 42),
(116, 43),
(95, 44),
(193, 45),
(194, 46),
(43, 47),
(43, 48),
(83, 49),
(314, 50),
(162, 51);

-- --------------------------------------------------------

--
-- Structure de la table `editeur`
--

CREATE TABLE `editeur` (
  `id` int(11) NOT NULL,
  `nom` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `editeur`
--

INSERT INTO `editeur` (`id`, `nom`) VALUES
(1, 'Nuée Bleue'),
(2, 'Albin Michel'),
(3, 'Faubourg'),
(4, 'Buch-Chastel'),
(5, 'Esthétiques du Divers'),
(6, 'Robert Laffont'),
(7, 'Gallimard'),
(8, 'éditions Kobalann'),
(9, 'Récamier'),
(10, 'Rivages/Noir,'),
(11, 'Presses de la Cité'),
(12, 'Harper Collins'),
(13, 'Iconoclaste'),
(14, ''),
(15, 'Rivages/Noir'),
(16, 'Calmann-LévyA travers les histoires de leurs héroïnes'),
(17, 'First'),
(18, 'Auzou'),
(19, 'Flammarion'),
(20, 'Éditions de la Chimère'),
(21, 'L’École des loisirs'),
(22, 'éditions Auzou'),
(23, 'Buchet-Chastel'),
(24, 'Calmann-Lévy'),
(25, 'First éditions'),
(26, 'Fleuve éditions '),
(27, 'éditions Stock'),
(28, 'éditions du Faubourg'),
(29, 'éditions du Cherche Midi'),
(30, 'éditions Altura'),
(31, 'éditions Hurlevent'),
(32, 'Belfond'),
(33, 'éditions de l’Attente'),
(34, 'Tripode'),
(35, 'Le Cherche Midi'),
(36, 'La Nuée bleue'),
(37, 'éditions Intranquilles'),
(38, '« Vieux'),
(39, 'éditions Gründ');

-- --------------------------------------------------------

--
-- Structure de la table `evenement`
--

CREATE TABLE `evenement` (
  `id` int(11) NOT NULL,
  `typeevenement` varchar(30) DEFAULT NULL,
  `titre` varchar(80) DEFAULT NULL,
  `stitre` varchar(80) DEFAULT NULL,
  `public` varchar(80) DEFAULT NULL,
  `commentaire` varchar(1000) DEFAULT NULL,
  `debut` datetime DEFAULT NULL,
  `fin` datetime DEFAULT NULL,
  `idAnimateur` int(11) DEFAULT NULL,
  `numLieu` int(11) DEFAULT NULL,
  `type` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `evenement`
--

INSERT INTO `evenement` (`id`, `typeevenement`, `titre`, `stitre`, `public`, `commentaire`, `debut`, `fin`, `idAnimateur`, `numLieu`, `type`) VALUES
(1, NULL, 'vendredi 20 novembre à la Comédie de Colmar', NULL, NULL, 'Mathias Malzieu (lecture, chant)Miky Biky (guitares, claviers)concert lecture en partenariat avec la Comédie de Colmar \nMathias Malzieu, chanteur du groupe Dionysos et auteur reconnu pour son univers poétique et imaginaire, ouvrira le Festival du livre de Colmar avec un spectacle mêlant littérature et musique. À l’occasion de la sortie prochaine de son nouveau roman, il proposera une performance originale associant lectures, chansons, rock et humour. Accompagné du guitariste Miky Biky, alias Michaël Ponton, il plongera le public dans son monde à la fois féerique, mélancolique et fantaisiste, où la poésie, l’hiver et les contes initiatiques occupent une place centrale. Une invitation à découvrir une œuvre libre, sensible et intergénérationnelle.\nRenseignements et billetterie https://comedie-colmar.com/spectacle/187.mathias-malzieu?m=2026-11 \n', '2026-11-20 20:00:00', NULL, NULL, 523, 'Le Off du Festival'),
(2, NULL, 'Georges BISCHOFF, Ego histoire d’un enfant sage', NULL, NULL, 'L\'historien Georges Bischoff s\'est prêté à l\'exercice des Mémoires d\'enfance, avec le brio qu\'on lui connaît. Né à Guebwiller en 1950, il se souvient avoir été l\'enfant le plus joli et le plus sage du monde ! Une « ego-histoire » où sa prime jeunesse en Alsace résonne avec les grandes évolutions de notre société.\n', '2026-11-21 10:30:00', NULL, NULL, 512, 'HISTOIRE'),
(3, NULL, 'Les histoires extraordinaires de Mathias Malzieu', NULL, NULL, 'À travers ses romans, de La mécanique du cœur au Journal d’un vampire en pyjama, en passant par le dernier en date, Roman de l’avent : un Noël sur la Lune, Mathias Malzieu, chanteur du groupe Dionysos, déploie un univers à part, au carrefour du conte, de la poésie et de la culture rock.Le temps d’une rencontre, plongez avec lui dans ces mondes extraordinaires et baroques, totalement à part dans le paysage littéraire français.\n', '2026-11-21 10:30:00', NULL, 329, 511, 'GRAND ENTRETIEN'),
(4, NULL, 'Passeurs de culture', NULL, NULL, 'François Kerymer, romancière et arrière-petite-fille de Joseph Gibert, revient sur l’épopée familiale des célèbres librairies Gibert, aujourd’hui en difficulté économique, et sur le rôle essentiel de « passeurs d’histoires » des librairies. À ses côtés, Victorien Bornéat analyse cette question de la démocratisation culturelle et ses nombreux échecs.Ensemble, ils dialogueront sur la transmission, l’accès aux livres et les moyens de (re)construire une culture véritablement partagée.\n', '2026-11-21 10:30:00', NULL, NULL, 513, 'RENDEZ-VOUS'),
(5, NULL, 'Dominique Jarrassé', NULL, NULL, 'L’historien de l’art Dominique Jarrassé, spécialiste du patrimoine juif français, revient sur trois siècles d’histoire des synagogues françaises dans un ouvrage monumental, richement illustré et documenté. La variété des formes architecturales prises par ces synagogues témoigne des évolutions historiques, sociologiques et religieuses qu’a connues la communauté juive française depuis son émancipation en 1791. \n', '2026-11-21 11:30:00', NULL, NULL, 512, 'HISTOIRE'),
(6, NULL, 'Entre mémoire familiale et grande Histoire', NULL, NULL, 'Dialogue autour de deux récits intimes bouleversants, dans lesquels la mémoire familiale croise la grande Histoire : l’incroyable évasion d’un convoi de la mort d’un côté, la quête d’un piano spolié par les nazis de l’autre. Une conversation sur la transmission et ce que peut l’écriture pour honorer la mémoire des disparus.\n', '2026-11-21 11:30:00', NULL, 329, 511, 'RENDEZ-VOUS'),
(7, NULL, 'Une vie consacrée à un oiseau', NULL, NULL, 'Michel Munier, père de Vincent Munier, célèbre photographe animalier récompensé, en début d’année, par le César du meilleur film documentaire pour « Le Chant des forêts », est un fervent défenseur des vieilles forêts des Vosges depuis des décennies. Dès les années 1970, il a arpenté le massif par tous les temps et fait la rencontre déterminante de cet oiseau rare, aux mœurs discrètes et mystérieuses : le grand tétras.Il nous en raconte sa longue observation, les nuits d’affût pour vivre quelques secondes de grâce et de beauté.\n', '2026-11-21 11:30:00', NULL, 330, 513, 'GRAND ENTRETIEN'),
(8, NULL, 'Les cent ans de la Société d\'Histoire de la Vallée de Munster', NULL, NULL, 'En 2026, la Société d’histoire de la ville et de la vallée de Munster célèbre son centenaire. À cette occasion, l’historien et folkloriste Gérard Leser retrace l’histoire de cette association et son rôle dans la préservation du patrimoine historique et culturel de la vallée.\n', '2026-11-21 14:00:00', NULL, NULL, 512, 'HISTOIRE'),
(9, NULL, 'Échappées belles ', NULL, NULL, 'Que se passe-t-il lorsque nos vies tournent en boucle ou se trouvent enfermées entre quatre murs ? À l\'occasion de la parution de leurs nouveaux romans, les romancières Fabienne Périneau et Solène Bakowski croisent leurs regards autour des trajectoires exceptionnelles de femmes qui tentent de s\'affranchir de leurs prisons, réelles ou intérieures.Une ode à l\'aventure, à la liberté et à l\'art.\n', '2026-11-21 14:00:00', NULL, 503, 513, 'RENDEZ-VOUS'),
(10, NULL, ' « Que peut la culture face aux tourments du monde ?  »', NULL, NULL, '', '2026-11-21 14:30:00', NULL, NULL, 511, 'RENDEZ-VOUS INAUGURAL'),
(11, NULL, 'Du document au livre (Table ronde)', NULL, NULL, 'Alexis Metzinger est un auteur, producteur et réalisateur. Après des études de lettres classiques et d’histoire de l’art Strasbourg, puis de cinéma à Nancy, il commence sa carrière dans l’audiovisuel comme monteur en 2004 et 2006 sur différents films documentaires de la réalisatrice Anne Imbert. En 2004, il crée avec son frère Yannis la société de production \"Cerigo Films\", basée à Strasbourg. Yannis et Alexis Metzinger ont produit plus d’une quinzaine de films pour la télévision, documentaires, courts métrages,\n', '2026-11-21 15:00:00', NULL, NULL, 518, 'HISTOIRE'),
(12, NULL, 'Histoires à faire peur ', NULL, NULL, 'Derrière le crime, le serial killer et l’enquête qui fondent bien souvent le roman policier, celui-ci reflète bien d’autres préoccupations qui dépassent le genre lui-même. Du thriller au polar social en passant par le roman à suspense, le roman noir s’est érigé en miroir éclatant de nos sociétés au fil des années, pour nous parler d’identité, d’inégalités sociales, de corruption, de violence et de bien d’autres choses encore. Dialogue entre trois écrivains aux sensibilités aussi proches que distinctes.\n', '2026-11-21 15:00:00', NULL, 142, 513, 'RENDEZ-VOUS'),
(13, NULL, 'Les miroirs sourient à ceux qui s’aiment ', NULL, NULL, 'De livre en livre, l’autrice de « Ta deuxième vie commence quand tu comprends que tu n\'en as qu\'une », nous mène sur le chemin de l’apaisement, du bien-être, de l’accord avec soi-même. Marraine du Salon en 2025, Raphaëlle Giordano revient avec ce nouveau roman qui explore le regard que l\'on porte sur son propre reflet, les complexes corporels et la magie de la création artistique.\n', '2026-11-21 15:00:00', NULL, 333, 514, 'GRAND ENTRETIEN'),
(14, NULL, 'Des histoires de familles', NULL, NULL, 'Avec Dans la jungle, la romancière à succès Adeline Dieudonné dissèque jusqu’au drame l’emprise toxique au sein d’une famille bourgeoise. Dans son premier roman L’âge de déplaire, Abibou Diouf interroge pour sa part le poids des traditions et des masculinités imposées dans l’intimité des foyers sénégalais. Tous deux explorent, chacun(e) à leur manière, le prix de la liberté face aux injonctions.\n', '2026-11-21 16:00:00', NULL, 335, 511, 'RENDEZ-VOUS'),
(15, NULL, 'Des histoires comme récits initiatiques ', NULL, NULL, 'A travers les histoires de leurs héroïnes, sur les routes de Floride au milieu des années 80 ou sur un campus californien à l’occasion d’un programme expérimental, Isabelle Lagarrigue et Laurence Peyrin mettent en lumière l’empreinte indélébile de la jeunesse, des secrets et des silences qui brisent des trajectoires toutes tracées.Dialogue entre deux voix sensibles de la littérature contemporaine.\n', '2026-11-21 16:00:00', NULL, 333, 513, 'RENDEZ-VOUS'),
(16, NULL, 'Une histoire du crime', NULL, NULL, 'Alain Bauer, décortique depuis des années les faces obscures de notre humanité. Des premiers meurtres de la Préhistoire aux menaces contemporaines, en passant par les guerres, le terrorisme et les grandes affaires de notre siècle, parmi lesquelles l’Affaire Epstein, et à l’occasion de ce grand entretien, le célèbre criminologue lit et nous raconte l’Histoire à travers le prisme du crime.\n', '2026-11-21 16:00:00', NULL, 334, 514, 'GRAND ENTRETIEN'),
(17, NULL, 'avec Carène Ponte', NULL, NULL, 'Et si vous partagiez un moment de lecture privilégié avec une autrice ?Le Festival du Livre de Colmar vous invite à découvrir les reading parties, des rencontres littéraires originales et conviviales, en petit comité. Au programme : la lecture du premier chapitre par l’autrice invitée, une parenthèse de lecture et un temps d’échange pour partager impressions et coups de cœur.\n', '2026-11-21 16:30:00', NULL, 503, 518, 'READING PARTY'),
(18, NULL, 'Réinventer nos liens ', NULL, NULL, 'Rencontre croisée autour de deux fresques chorales puissantes de cette rentrée littéraire. À travers l\'errance de l’adolescence et de la jeunesse chez Joséphine Tassy, et les non-ditsfamiliaux chez Julia Kerninon, les deux romancières explorent la façon avec laquelle le temps abîme ou réinvente nos liens.\n', '2026-11-21 17:00:00', NULL, 329, 511, 'RENDEZ-VOUS'),
(19, NULL, 'Étonnants voyageurs ', NULL, NULL, 'Deux regards, deux générations, deux écritures mais un même goût pour la route, le voyage et les rencontres. Par la voie du polar, avec Ian Manook, comme par celle du reportage sous la plume de Serge Hastom, les pérégrinations se transforment en épopées pour mieux raconter la complexité des territoires et de leurs populations, tantôt en Israël et Palestine, en Russie ou au Mexique, tantôt en Corée du Sud ou dans le grand Nord.\n', '2026-11-21 17:00:00', NULL, 335, 513, 'RENDEZ-VOUS'),
(20, NULL, 'Le drame intime, miroir des tragédies du monde', NULL, NULL, 'Dans La collision, Paul Gasnier décortique l’enchaînement dramatique ayant entraîné la mort de sa mère, tragiquement percutée à Lyon par un jeune homme de 18 ans en plein rodéo urbain. Dans « Vladimir m’a pris Vadim », il raconte comment la guerre lancée par Poutine à l’Ukraine a brisé le lien avec son cousin.Plus que de simples récits de deuil, réel ou symbolique, ces textes puissants racontent comment le drame personnel peut se transformer en un miroir des fractures de notre époque, et combien les grandes tragédies du monde s’immiscent dans notre intimité et façonnent les convictions.\n', '2026-11-21 17:00:00', NULL, 334, 514, 'GRAND ENTRETIEN'),
(21, NULL, 'La médiation historique en bande dessinée ', NULL, NULL, 'Pourquoi les actes les plus barbares sont-ils si souvent commis par les hommes les plus ordinaires ? Un mari assassine brutalement la femme qu\'il disait aimer, une mère tue son enfant à la naissance, un petit délinquant prépare une tuerie … Ces crimes suscitent à chaque fois l\'incrédulité et la stupéfaction de l’entourage et des médias : « c’était quelqu’un sans histoire ». Exploration de la banalité du Mal avec Jacques Pradel, le plus célèbre observateur du monde judiciaire, et Daniel Zagury, le psychiatre renommé pour ses travaux auprès des tueurs en série.\n', '2026-11-21 18:00:00', NULL, 330, 511, 'RENDEZ-VOUS'),
(22, NULL, 'Passeurs d’histoires, créateurs de liens', NULL, NULL, 'Écrire, illustrer, éditer, conseiller des livres… et les faire vivre bien au-delà de leurs pages. Caroline Millet, Mickaël Brun-Arnaud et Sarah Abel ont fait de leur passion pour les histoires le cœur de leur activité, tout en fédérant autour de leurs univers de véritables communautés sur les réseaux sociaux.Comment partage-t-on ce que l’on aime avec des milliers de lecteurs ? Comment création, transmission et réseaux sociaux se nourrissent-ils aujourd’hui les uns les autres ? Et comment transforme-t-on une passion en aventure créative et professionnelle ?Trois parcours et trois façons d’être, chacun à sa manière, passeur d’histoires.\n', '2026-11-21 18:00:00', NULL, 503, 513, 'RENDEZ-VOUS'),
(23, NULL, 'Des histoires de cinéma', NULL, NULL, 'Avec Fabien ONTENIENTE, Alors, on n’attend pas Fabien ? (éditions Stock)Réalisateur de comédies populaires devenues cultes, en tête desquelles la saga « Camping »avec Franck Dubosc, Fabien Onteniente nous raconte son parcours hors-norme, de Michel Audiard venu poser sa caméra au bas de chez lui alors qu’il était enfant jusqu’aux succès l’ayant rendu célèbre, en passant par les rencontres ayant changé sa vie, les échecs ou les coulisses du métier. Un livre qui se déguste comme une chanson populaire. Une parenthèse enchantée. Le tout avec une sincérité qui fait du bien.A', '2026-11-21 18:00:00', NULL, NULL, 514, 'GRAND ENTRETIEN'),
(24, NULL, 'la bibliothèque \"hors les murs\" du Réseau des bibliothèques de Colmar', NULL, NULL, 'Laissez-vous emporter par le plaisir de lire ! Romans, BD, mangas, presse et magazines : les bibliothécaires ont réuni pour vous leurs coups de cœur et les dernières nouveautés.Entre jeux de langage, belles plumes et découvertes littéraires, la bibliopause du Festival vous invite à savourer les mots sous toutes leurs formes…une pause lecture au coeur de l\'effervescence du salon !\n', '2026-11-21 00:00:00', NULL, NULL, NULL, 'BiBlio\'Pause'),
(25, NULL, 'Reliure, lithographie, imprimerie et exposition', NULL, NULL, 'Découvrez de nombreuses techniques lors d\'animations et de démonstrations. Le stand propose aussi une vente de lithographies.L\'atelier musée des arts sera présent tout au long du week-end ! \n', '2026-11-21 00:00:00', NULL, NULL, 525, 'ANIMATION'),
(26, NULL, 'tient salon', NULL, NULL, 'Les structures culturelles colmariennes vous donnent rendez-vous dans leur salon cosy ! Découvrez les programmations de la Comédie de Colmar, du Théâtre municipal, de la Salle Europe, du Lézard et de l\'Opéra national du Rhin.Animations et surprises au programme tout au long du week-end !\n', '2026-11-21 00:00:00', NULL, NULL, 529, 'Le PANIER CULTURE'),
(27, NULL, 'Les podcasts du mur des noms Proposé par le Comité d’Histoire Régional', NULL, NULL, 'Cette exposition met en lumière une sélection parmi les dix épisodes du podcast, dix épisodes pour autant d’itinéraires de vie d’Alsaciens et Mosellans tués pendant la Seconde Guerre mondiale.  À travers ces vies, c’est la mémoire des incorporés de force, victimes civiles, soldats sous uniforme français, juifs, résistants, témoins de Jéhovah, homosexuels, tsiganes et malades psychiatriques qui est partagée. Les noms de ces près de 44 000 victimes seront inscrits au Mur des Noms.\nUne exposition au cœur des archives qui ont permis de retracer le parcours de ces dix hommes, femmes et enfants. Chacun de ces documents, chacune de ces photographies raconte tant leur histoire que le travail de mémoire entrepris par les descendants ou par les associations mémorielles.\n', '2026-11-21 00:00:00', NULL, NULL, 527, 'EXPOSITION'),
(28, NULL, 'Arthur Rimbaud  \"de la poésie lumineuse aux voyages et aux explorations\"', NULL, NULL, 'Proposé par Ginkgo éditeur\nLa vie extraordinaire d’Arthur Rimbaud (1854 - 1891), qui tout jeune à Charleville (Ardennes) brillant élève, se lança avec talent dans la poésie ; puis arriva à Paris à l’époque de la Commune à la conquête du monde littéraire. Il passa d’une vie tumultueuse à des voyages et errances en Europe et dans le Monde. Après un rejet total de la poésie, ce lumineux poète décida de devenir négociant, explorateur, photographe en Abyssinie et à Aden (Arabie), au bord de la mer Rouge. Il y séjourna durant les 11 dernières années de sa vie.\n', '2026-11-21 00:00:00', NULL, NULL, 531, 'EXPOSITION'),
(29, NULL, 'Des secrets qui ressurgissent ', NULL, NULL, 'Devenues au fil des années trois plumes majeures du thriller psychologique en France, Sophie Loubière, Laure Rollier et Anouk Shutterberg se retrouvent autour d’un même territoire : celui du passé et de ses secrets qui refont surface.Chacune à leur manière, elles explorent les traumas enfouis, les blessures familiales et lamanipulation psychologique qui nous rongent et nous détruisent.\n', '2026-11-22 10:30:00', NULL, 504, 511, 'RENDEZ-VOUS'),
(30, NULL, 'Société des Écrivains d\'Alsace, de Lorraine et du Territoire de Belfort', NULL, NULL, 'Comme chaque année, la SEALB attribue le prix de littérature « Albert Schweitzer », et le prix de poésie « Claude Vigée ». Les livres des lauréats seront présentés à cette occasion.\n', '2026-11-22 10:30:00', NULL, NULL, 513, 'REMISE DE PRIX DE LA SEALB'),
(31, NULL, 'Bâtir le monde d’après ', NULL, NULL, 'Face au dérèglement climatique, à la prolifération des déchets, au complotisme ou àl’effondrement technologique, Bénédicte Dupré La Tour, Florence Jou et Hadrien Klent opposent la résistance, la solidarité locale et la réinvention joyeuse de nos modes de vie.Ensemble, ils décryptent la bataille des récits contemporains et la force des utopies pour penser et bâtir le monde d’après.\n', '2026-11-22 10:30:00', NULL, 330, 514, 'RENDEZ-VOUS'),
(32, NULL, 'Richard Edmond Schalck', NULL, NULL, '', '2026-11-22 00:00:00', NULL, NULL, NULL, 'HISTOIRE'),
(33, NULL, 'Femme de télé', NULL, NULL, 'Pendant 23 ans, Catherine Ceylac a cuisiné, piqué, caressé et souvent aimé les 1752 invités qu\'elle a reçus dans son émission emblématique, « Thé ou Café ».À l’occasion de ce grand entretien, elle nous raconte l\'histoire d\'une femme qui, dans les années 1970, est entrée par effraction dans le monde de l\'audiovisuel public avec l\'ambition de colorer sa vie. Elle raconte les embûches rencontrées, le combat pour exister dans un milieu très masculin et obtenir ses galons, la reconnaissance du public.Ce récit est aussi celui d\'un engagement viscéral envers les femmes.\n', '2026-11-22 11:30:00', NULL, 332, 511, 'RENDEZ-VOUS'),
(34, NULL, 'Le kiosque lecture de Litter\'Al', NULL, NULL, 'Ils sont romanciers, auteurs pour la jeunesse, traducteurs, scénaristes, essayistes, ils explorent tous les sujets et tous travaillent en Alsace et sont membres de l\'association Littér\'Al. Pendant près d’une heure, ils vont partager avec le public leur coup de cœur pour un livre d\'un autre : le regard d\'un écrivain sur le travail d\'un autre écrivain. C\'est le Kiosque de LIttér\'Al.\n', '2026-11-22 11:30:00', NULL, NULL, 513, 'RENDEZ-VOUS'),
(35, NULL, 'Une histoire de liberté ', NULL, NULL, 'Alors qu\'il séjourne dans une auberge de Chiraz, en Iran, Olivier Grondeau, voyageur épris de liberté, est arrêté par la police, qui l\'accuse de collecter des informations pour des pays étrangers. Enfermé dans une cellule de prison exiguë, ce passionné de littérature mobilise tout ce qui peut lui apporter de la lumière, de la poésie persane aux chansons de Britney Spears.À travers une expérience si singulière, qu’il partage avec nous, il touche des thèmes universels : la liberté, la peur, la survie, l’identité, la force de l’art.\n', '2026-11-22 11:30:00', NULL, 329, 514, 'RENDEZ-VOUS'),
(36, NULL, 'Sandrine Gendreau, La femme corbeau', NULL, NULL, 'Quatre siècles avant notre ère, dans la forêt de l’actuelle Moselle. À l’équinoxe d’automne, Kulkour, une druide celte, est capturée par une tribu ennemie. Commence pour elle un voyage peuplé de mystères, de rencontres et de dangers, qui la mènera jusqu’à la lointaine Méditerranée. Durant ce périple, elle apprendra à entrer en symbiose avec la nature et les dieux, et deviendra la femme corbeau.\n', '2026-11-22 11:30:00', NULL, NULL, 512, 'HISTOIRE'),
(37, NULL, 'La force d’en rire ', NULL, NULL, 'À l’occasion de la publication de son autobiographie, l’humoriste Jeanfi Janssens remonte avec nous le fil de sa vie, de son enfance dans le Nord à son succès sur scène. Des difficultés rencontrées lorsqu’il était jeune à son homosexualité vécue dans le secret, en passant par une escroquerie amoureuse qui l’a lourdement endetté ou encore la disparition de son frère, il nous raconte également son passé de steward et dix-sept années chez Air France, et le chemin qui l’a finalement conduit à se lancer dans l’humour à 40 ans.\n', '2026-11-22 14:00:00', NULL, 329, 511, 'GRAND ENTRETIEN'),
(38, NULL, 'Des animaux et des humains', NULL, NULL, 'Les regards croisés de trois autrices qui placent la question de la sensibilité animale au cœur de leur écriture. Dans « Grave », Laure Gouraige explore l’intimité et la légitimité du deuil faisant suite à la perte de son chat. De son côté, Sylvie Pérenne, dans « Mado des oiseaux », interroge notre manière de cohabiter avec l’animal et, plus largement, avec le vivant, entre douleur intime et fusion avec la nature. Enfin, Stéphanie Pérez nous conte le récit bouleversant d’un chien qui réconcilie les humains avec leur humanité, au cœur du chaos.\n', '2026-11-22 14:00:00', NULL, 333, 513, 'RENDEZ-VOUS'),
(39, NULL, 'La liste de lecture d’Ambre Chalumeau', NULL, NULL, 'Elle est sans doute la meilleure des « passeuses d’histoires » : Ambre Chalumeau, journaliste, romancière, passée par « Quotidien » cinq années durant, nous parle des livres et des auteurs et autrices qui comptent.Des succès planétaires et des phénomènes de société, des textes courts et de très longs, des essais qui aident à comprendre le réel ou des romans d’évasion. Des livres qui font du bien pendant quelques heures ou qui changent une vie à jamais.\n', '2026-11-22 14:00:00', NULL, 332, 514, 'GRAND ENTRETIEN'),
(40, NULL, 'Jacques Fortier, Les coquelicots de Tambov', NULL, NULL, 'Jacques Fortier est l’auteur de dix romans policiers régionaux dans la collection des « Enquêtes rhénanes » chez Le Verger Éditeur depuis 2009\n', '2026-11-22 14:00:00', NULL, 29, 512, 'HISTOIRE'),
(41, NULL, ' Nouveaux regards sur l’incorporation de force', NULL, NULL, 'L\'incorporation de force constitue depuis des décennies un élément structurant de la mémoire alsacienne et mosellane. Toutes les familles du territoire, ou presque, ont en effet été concernées par ce crime de guerre, perpétré entre 1942 et 1945. Certaines ont parlé, d\'autres se sont tues. Aujourd\'hui, plus de 80 ans après la fin de la guerre, une parole nouvelle se fait jour. Le Comité d\'Histoire Régionale, en partenariat avec la Fédération des Sociétés d’histoire et d’archéologie d’Alsace (FSHAA), invite le public à suivre une discussion entre plusieurs historiens et acteurs du champ mémoriel venus témoigner de leurs pratiques professionnelles.\n', '2026-11-22 15:00:00', NULL, 505, 514, 'RENDEZ-VOUS'),
(42, NULL, 'Une histoire de la pop culture', NULL, NULL, '', '2026-11-22 15:00:00', NULL, 329, 532, 'Table ronde'),
(43, NULL, 'avec Mathilde Paris', NULL, NULL, 'Et si vous partagiez un moment de lecture privilégié avec une autrice ?Le Festival du Livre de Colmar vous invite à découvrir les reading parties, des rencontres littéraires originales et conviviales, en petit comité. Au programme : la lecture du premier chapitre par l’autrice invitée, une parenthèse de lecture et un temps d’échange pour partager impressions et coups de cœur.\n', '2026-11-22 15:00:00', NULL, 337, 518, 'READING PARTY'),
(44, NULL, 'Voyage dans l’enfer du Grand Nord', NULL, NULL, 'Après l’immense succès de son précédent roman, « Dans les eaux du Grand Nord », l’écrivain britannique Ian McGuire est de retour avec un nouveau livre, qu’il viendra spécialement nous présenter à Colmar : « White River », ou l’histoire d’une expédition pour mettre la main sur un gisement d’or en baie d’Hudson, en 1766, qui tourne à l’enchaînement épique d’épreuves et de violences de toutes sortes.Un roman d’une impressionnante noirceur, mais aussi débordant d’humanité, qui ne vous laissera pas indifférent.\n', '2026-11-22 16:00:00', NULL, 332, 511, 'GRAND ENTRETIEN'),
(45, NULL, 'Du triathlon au go fast « la double vie de Nessim Kerkour »', NULL, NULL, 'À 32 ans, Nessim Kerkouri a déjà vécu mille vies : maladie infantile, adolescence heurtée, sport de haut niveau, trafic de drogues, prison, réinsertion. Une vie comme un roman, traversée de rencontres étonnantes, qu’il s’est efforcé de mettre par écrit lorsqu’il était en détention. Son témoignage sincère et chargé d’adrénaline est un récit de sport autant qu’un polar et une quête de sens.\n', '2026-11-22 16:00:00', NULL, 328, 513, 'GRAND ENTRETIEN'),
(46, NULL, ' The CHERRYCHORDS / Country Folk (DE)', NULL, NULL, 'Elke et Niels, forment The CHERRYCHORDS en 2005. Après leur aventure au sein du groupe Rock « Shegoesbang », ils décident de privilégier l’interprétation de leurs compositions en « duo acoustique » pour finalement formé un « trio » avec Dean Blondin à la contrebasse.Leurs textes évoquent l\'amour de la nature, l’amitié, la spiritualité mais aussi des thèmes moins conventionnels et plus personnels, tout ça dans un genre musical proche de la musique folk et country US dont Neil Young , Gram Parsons, Alison Krauss font partie de leurs influences.\n', '2026-11-22 17:00:00', NULL, NULL, 511, 'CONCERT DE CLÔTURE'),
(47, NULL, 'la bibliothèque \"hors les murs\" du Réseau des bibliothèques de Colmar', NULL, NULL, 'Laissez-vous emporter par le plaisir de lire ! Romans, BD, mangas, presse et magazines : les bibliothécaires ont réuni pour vous leurs coups de cœur et les dernières nouveautés.Entre jeux de langage, belles plumes et découvertes littéraires, la bibliopause du Festival vous invite à savourer les mots sous toutes leurs formes…une pause lecture au coeur de l\'effervescence du salon !\n', '2026-11-22 00:00:00', NULL, NULL, NULL, 'BiBlio\'Pause'),
(48, NULL, 'Reliure, lithographie, imprimerie et exposition', NULL, NULL, 'Découvrez de nombreuses techniques lors d\'animations et de démonstrations. Le stand propose aussi une vente de lithographies.L\'atelier musée des arts sera présent tout au long du week-end ! \n', '2026-11-22 00:00:00', NULL, NULL, 525, 'ANIMATION'),
(49, NULL, 'Le PANIER CULTURE tient salon', NULL, NULL, 'Les structures culturelles colmariennes vous donnent rendez-vous dans leur salon cosy ! Découvrez les programmations de la Comédie de Colmar, du Théâtre municipal, de la Salle Europe, du Lézard et de l\'Opéra national du Rhin.Animations et surprises au programme tout au long du week-end !\n', '2026-11-22 00:00:00', NULL, NULL, 533, 'PANIER CULTURE'),
(50, NULL, 'Les podcasts du mur des noms Proposé par le Comité d’Histoire Régional', NULL, NULL, 'Cette exposition met en lumière une sélection parmi les dix épisodes du podcast, dix épisodes pour autant d’itinéraires de vie d’Alsaciens et Mosellans tués pendant la Seconde Guerre mondiale.  À travers ces vies, c’est la mémoire des incorporés de force, victimes civiles, soldats sous uniforme français, juifs, résistants, témoins de Jéhovah, homosexuels, tsiganes et malades psychiatriques qui est partagée. Les noms de ces près de 44 000 victimes seront inscrits au Mur des Noms.\nUne exposition au cœur des archives qui ont permis de retracer le parcours de ces dix hommes, femmes et enfants. Chacun de ces documents, chacune de ces photographies raconte tant leur histoire que le travail de mémoire entrepris par les descendants ou par les associations mémorielles.\n', '2026-11-22 00:00:00', NULL, NULL, 527, 'EXPOSITION'),
(51, NULL, 'Arthur Rimbaud', NULL, NULL, 'La vie extraordinaire d’Arthur Rimbaud (1854 - 1891), qui tout jeune à Charleville (Ardennes) brillant élève, se lança avec talent dans la poésie ; puis arriva à Paris à l’époque de la Commune à la conquête du monde littéraire. Il passa d’une vie tumultueuse à des voyages et errances en Europe et dans le Monde. Après un rejet total de la poésie, ce lumineux poète décida de devenir négociant, explorateur, photographe en Abyssinie et à Aden (Arabie), au bord de la mer Rouge. Il y séjourna durant les 11 dernières années de sa vie.\n', '2026-11-22 00:00:00', NULL, NULL, NULL, 'EXPOSITION');

-- --------------------------------------------------------

--
-- Structure de la table `exposant`
--

CREATE TABLE `exposant` (
  `id` int(11) NOT NULL,
  `numLieu` int(11) DEFAULT NULL,
  `nom` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `exposant`
--

INSERT INTO `exposant` (`id`, `numLieu`, `nom`) VALUES
(1, 332, 'Éditions du Tourneciel'),
(2, 309, 'La Nuée Bleue / Ebra éditions'),
(3, 323, 'Espace Culturel E. Leclerc'),
(4, 504, 'L\'Esprit BD'),
(5, 311, 'I.D. l\'Édition'),
(6, 227, 'Comité d\'Histoire Régionale'),
(7, 328, 'Association des Éditeurs belges'),
(8, 501, 'La Capsule'),
(9, 308, 'Librairie Pleine Page'),
(10, 302, 'Auxilivre'),
(11, 304, 'Librairie RUC'),
(12, 319, 'Médiapop'),
(13, 327, 'Reber Éditions '),
(15, 306, 'ALL Bourgogne Franche-Comté'),
(16, 222, 'Librairie Le Chat Perché'),
(17, 303, 'L\'Alsacienne Indépendante'),
(19, 207, 'La Plume Colmarienne'),
(20, 213, 'Salon littéraire de Colmar'),
(21, 303, 'Éditions Rebelyne'),
(22, 222, 'Editions l\'Iconoclaste'),
(23, 222, 'Librairie le Libroscope'),
(24, 312, 'Éditions du Petit Caveau'),
(25, 318, 'Éditions Akinomé'),
(26, 224, 'Éditions Phloème'),
(27, 218, 'Le monde de Théo'),
(28, 309, 'La Nuée Bleue '),
(29, 311, ' I.D. l\'Édition'),
(30, 311, 'I.D. l\'Édition '),
(31, 302, ' Auxilivre '),
(32, 301, 'Librairie Biblique Certitude'),
(33, 315, 'Bastian Éditions'),
(34, 233, 'Heimetsproch un tràdition'),
(36, 402, 'Le Texte et la Parole'),
(37, 413, 'Librairie La Bouquinette'),
(38, 422, 'Éditions l\'Inattendue'),
(39, 427, 'Arlequin Éditions'),
(40, 420, 'Itak Éditions'),
(41, 412, 'Éditions Père Fouettard'),
(42, 425, 'Le Jardin des Mots'),
(43, 413, 'Librairie La Bouquinette '),
(44, 411, ' Alice Éditions'),
(45, 409, 'Éditions Le Pont du Vent'),
(46, 411, 'Alice Éditions'),
(47, 332, 'Éditions du Tourneciel'),
(48, 309, 'La Nuée Bleue / Ebra éditions'),
(49, 323, 'Espace Culturel E. Leclerc'),
(50, 504, 'L\'Esprit BD'),
(51, 311, 'I.D. l\'Édition'),
(52, 227, 'Comité d\'Histoire Régionale'),
(53, 328, 'Association des Éditeurs belges'),
(54, 501, 'La Capsule'),
(55, 308, 'Librairie Pleine Page'),
(56, 302, 'Auxilivre'),
(57, 304, 'Librairie RUC'),
(58, 319, 'Médiapop'),
(59, 327, 'Reber Éditions '),
(61, 306, 'ALL Bourgogne Franche-Comté'),
(62, 222, 'Librairie Le Chat Perché'),
(63, 303, 'L\'Alsacienne Indépendante'),
(65, 207, 'La Plume Colmarienne'),
(66, 213, 'Salon littéraire de Colmar'),
(67, 303, 'Éditions Rebelyne'),
(68, 222, 'Editions l\'Iconoclaste'),
(69, 222, 'Librairie le Libroscope'),
(70, 312, 'Éditions du Petit Caveau'),
(71, 318, 'Éditions Akinomé'),
(72, 224, 'Éditions Phloème'),
(73, 218, 'Le monde de Théo'),
(74, 309, 'La Nuée Bleue '),
(75, 311, ' I.D. l\'Édition'),
(76, 311, 'I.D. l\'Édition '),
(77, 302, ' Auxilivre '),
(78, 301, 'Librairie Biblique Certitude'),
(79, 315, 'Bastian Éditions'),
(80, 233, 'Heimetsproch un tràdition'),
(82, 402, 'Le Texte et la Parole'),
(83, 413, 'Librairie La Bouquinette'),
(84, 422, 'Éditions l\'Inattendue'),
(85, 427, 'Arlequin Éditions'),
(86, 420, 'Itak Éditions'),
(87, 412, 'Éditions Père Fouettard'),
(88, 425, 'Le Jardin des Mots'),
(89, 413, 'Librairie La Bouquinette '),
(90, 411, ' Alice Éditions'),
(91, 409, 'Éditions Le Pont du Vent'),
(92, 411, 'Alice Éditions'),
(93, 332, 'Éditions du Tourneciel'),
(94, 309, 'La Nuée Bleue / Ebra éditions'),
(95, 323, 'Espace Culturel E. Leclerc'),
(96, 504, 'L\'Esprit BD'),
(97, 311, 'I.D. l\'Édition'),
(98, 227, 'Comité d\'Histoire Régionale'),
(99, 328, 'Association des Éditeurs belges'),
(100, 501, 'La Capsule'),
(101, 308, 'Librairie Pleine Page'),
(102, 302, 'Auxilivre'),
(103, 304, 'Librairie RUC'),
(104, 319, 'Médiapop'),
(105, 327, 'Reber Éditions '),
(107, 306, 'ALL Bourgogne Franche-Comté'),
(108, 222, 'Librairie Le Chat Perché'),
(109, 303, 'L\'Alsacienne Indépendante'),
(111, 207, 'La Plume Colmarienne'),
(112, 213, 'Salon littéraire de Colmar'),
(113, 303, 'Éditions Rebelyne'),
(114, 222, 'Editions l\'Iconoclaste'),
(115, 222, 'Librairie le Libroscope'),
(116, 312, 'Éditions du Petit Caveau'),
(117, 318, 'Éditions Akinomé'),
(118, 224, 'Éditions Phloème'),
(119, 218, 'Le monde de Théo'),
(120, 309, 'La Nuée Bleue '),
(121, 311, ' I.D. l\'Édition'),
(122, 311, 'I.D. l\'Édition '),
(123, 302, ' Auxilivre '),
(124, 301, 'Librairie Biblique Certitude'),
(125, 315, 'Bastian Éditions'),
(126, 233, 'Heimetsproch un tràdition'),
(128, 402, 'Le Texte et la Parole'),
(129, 413, 'Librairie La Bouquinette'),
(130, 422, 'Éditions l\'Inattendue'),
(131, 427, 'Arlequin Éditions'),
(132, 420, 'Itak Éditions'),
(133, 412, 'Éditions Père Fouettard'),
(134, 425, 'Le Jardin des Mots'),
(135, 413, 'Librairie La Bouquinette '),
(136, 411, ' Alice Éditions'),
(137, 409, 'Éditions Le Pont du Vent'),
(138, 411, 'Alice Éditions'),
(139, 332, 'Éditions du Tourneciel'),
(140, 309, 'La Nuée Bleue / Ebra éditions'),
(141, 323, 'Espace Culturel E. Leclerc'),
(142, 504, 'L\'Esprit BD'),
(143, 311, 'I.D. l\'Édition'),
(144, 227, 'Comité d\'Histoire Régionale'),
(145, 328, 'Association des Éditeurs belges'),
(146, 501, 'La Capsule'),
(147, 308, 'Librairie Pleine Page'),
(148, 302, 'Auxilivre'),
(149, 304, 'Librairie RUC'),
(150, 319, 'Médiapop'),
(151, 327, 'Reber Éditions '),
(153, 306, 'ALL Bourgogne Franche-Comté'),
(154, 222, 'Librairie Le Chat Perché'),
(155, 303, 'L\'Alsacienne Indépendante'),
(157, 207, 'La Plume Colmarienne'),
(158, 213, 'Salon littéraire de Colmar'),
(159, 303, 'Éditions Rebelyne'),
(160, 222, 'Editions l\'Iconoclaste'),
(161, 222, 'Librairie le Libroscope'),
(162, 312, 'Éditions du Petit Caveau'),
(163, 318, 'Éditions Akinomé'),
(164, 224, 'Éditions Phloème'),
(165, 218, 'Le monde de Théo'),
(166, 309, 'La Nuée Bleue '),
(167, 311, ' I.D. l\'Édition'),
(168, 311, 'I.D. l\'Édition '),
(169, 302, ' Auxilivre '),
(170, 301, 'Librairie Biblique Certitude'),
(171, 315, 'Bastian Éditions'),
(172, 233, 'Heimetsproch un tràdition'),
(174, 402, 'Le Texte et la Parole'),
(175, 413, 'Librairie La Bouquinette'),
(176, 422, 'Éditions l\'Inattendue'),
(177, 427, 'Arlequin Éditions'),
(178, 420, 'Itak Éditions'),
(179, 412, 'Éditions Père Fouettard'),
(180, 425, 'Le Jardin des Mots'),
(181, 413, 'Librairie La Bouquinette '),
(182, 411, ' Alice Éditions'),
(183, 409, 'Éditions Le Pont du Vent'),
(184, 411, 'Alice Éditions'),
(185, 332, 'Éditions du Tourneciel'),
(186, 309, 'La Nuée Bleue / Ebra éditions'),
(187, 323, 'Espace Culturel E. Leclerc'),
(188, 504, 'L\'Esprit BD'),
(189, 311, 'I.D. l\'Édition'),
(190, 227, 'Comité d\'Histoire Régionale'),
(191, 328, 'Association des Éditeurs belges'),
(192, 501, 'La Capsule'),
(193, 308, 'Librairie Pleine Page'),
(194, 302, 'Auxilivre'),
(195, 304, 'Librairie RUC'),
(196, 319, 'Médiapop'),
(197, 327, 'Reber Éditions '),
(199, 306, 'ALL Bourgogne Franche-Comté'),
(200, 222, 'Librairie Le Chat Perché'),
(201, 303, 'L\'Alsacienne Indépendante'),
(203, 207, 'La Plume Colmarienne'),
(204, 213, 'Salon littéraire de Colmar'),
(205, 303, 'Éditions Rebelyne'),
(206, 222, 'Editions l\'Iconoclaste'),
(207, 222, 'Librairie le Libroscope'),
(208, 312, 'Éditions du Petit Caveau'),
(209, 318, 'Éditions Akinomé'),
(210, 224, 'Éditions Phloème'),
(211, 218, 'Le monde de Théo'),
(212, 309, 'La Nuée Bleue '),
(213, 311, ' I.D. l\'Édition'),
(214, 311, 'I.D. l\'Édition '),
(215, 302, ' Auxilivre '),
(216, 301, 'Librairie Biblique Certitude'),
(217, 315, 'Bastian Éditions'),
(218, 233, 'Heimetsproch un tràdition'),
(220, 402, 'Le Texte et la Parole'),
(221, 413, 'Librairie La Bouquinette'),
(222, 422, 'Éditions l\'Inattendue'),
(223, 427, 'Arlequin Éditions'),
(224, 420, 'Itak Éditions'),
(225, 412, 'Éditions Père Fouettard'),
(226, 425, 'Le Jardin des Mots'),
(227, 413, 'Librairie La Bouquinette '),
(228, 411, ' Alice Éditions'),
(229, 409, 'Éditions Le Pont du Vent'),
(230, 411, 'Alice Éditions'),
(231, 332, 'Éditions du Tourneciel'),
(232, 309, 'La Nuée Bleue / Ebra éditions'),
(233, 323, 'Espace Culturel E. Leclerc'),
(234, 504, 'L\'Esprit BD'),
(235, 311, 'I.D. l\'Édition'),
(236, 227, 'Comité d\'Histoire Régionale'),
(237, 328, 'Association des Éditeurs belges'),
(238, 501, 'La Capsule'),
(239, 308, 'Librairie Pleine Page'),
(240, 302, 'Auxilivre'),
(241, 304, 'Librairie RUC'),
(242, 319, 'Médiapop'),
(243, 327, 'Reber Éditions '),
(245, 306, 'ALL Bourgogne Franche-Comté'),
(246, 222, 'Librairie Le Chat Perché'),
(247, 303, 'L\'Alsacienne Indépendante'),
(249, 207, 'La Plume Colmarienne'),
(250, 213, 'Salon littéraire de Colmar'),
(251, 303, 'Éditions Rebelyne'),
(252, 222, 'Editions l\'Iconoclaste'),
(253, 222, 'Librairie le Libroscope'),
(254, 312, 'Éditions du Petit Caveau'),
(255, 318, 'Éditions Akinomé'),
(256, 224, 'Éditions Phloème'),
(257, 218, 'Le monde de Théo'),
(258, 309, 'La Nuée Bleue '),
(259, 311, ' I.D. l\'Édition'),
(260, 311, 'I.D. l\'Édition '),
(261, 302, ' Auxilivre '),
(262, 301, 'Librairie Biblique Certitude'),
(263, 315, 'Bastian Éditions'),
(264, 233, 'Heimetsproch un tràdition'),
(266, 402, 'Le Texte et la Parole'),
(267, 413, 'Librairie La Bouquinette'),
(268, 422, 'Éditions l\'Inattendue'),
(269, 427, 'Arlequin Éditions'),
(270, 420, 'Itak Éditions'),
(271, 412, 'Éditions Père Fouettard'),
(272, 425, 'Le Jardin des Mots'),
(273, 413, 'Librairie La Bouquinette '),
(274, 411, ' Alice Éditions'),
(275, 409, 'Éditions Le Pont du Vent'),
(276, 411, 'Alice Éditions');

-- --------------------------------------------------------

--
-- Structure de la table `exposer`
--

CREATE TABLE `exposer` (
  `idExposant` int(11) NOT NULL,
  `idPersonne` int(11) NOT NULL,
  `samedi_am` tinyint(1) DEFAULT NULL,
  `samedi_pm` tinyint(1) DEFAULT NULL,
  `dimanche_am` tinyint(1) DEFAULT NULL,
  `dimanche_pm` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `exposer`
--

INSERT INTO `exposer` (`idExposant`, `idPersonne`, `samedi_am`, `samedi_pm`, `dimanche_am`, `dimanche_pm`) VALUES
(1, 2, 0, 0, 1, 1),
(1, 108, 1, 1, 0, 0),
(1, 167, 1, 1, 1, 1),
(1, 230, 0, 1, 0, 0),
(2, 3, 0, 0, 1, 1),
(2, 19, 0, 0, 1, 1),
(2, 23, 1, 1, 0, 0),
(2, 25, 1, 1, 0, 0),
(2, 39, 1, 1, 0, 0),
(2, 48, 1, 1, 0, 0),
(2, 59, 0, 0, 1, 1),
(2, 84, 1, 1, 1, 1),
(2, 91, 0, 0, 1, 1),
(2, 109, 1, 1, 0, 0),
(2, 120, 0, 0, 1, 1),
(2, 121, 0, 0, 1, 1),
(2, 125, 1, 1, 1, 1),
(2, 133, 0, 1, 0, 0),
(2, 136, 1, 1, 1, 1),
(2, 158, 0, 0, 1, 1),
(2, 165, 1, 1, 0, 0),
(2, 210, 0, 0, 1, 1),
(2, 222, 1, 1, 0, 0),
(2, 232, 1, 1, 0, 0),
(2, 254, 0, 0, 1, 1),
(3, 4, 1, 1, 1, 1),
(3, 9, 1, 1, 1, 1),
(3, 24, 1, 1, 0, 0),
(3, 40, 1, 1, 1, 1),
(3, 41, 0, 0, 0, 0),
(3, 44, 1, 1, 1, 1),
(3, 56, 1, 1, 1, 1),
(3, 81, 1, 1, 0, 0),
(3, 94, 1, 1, 0, 0),
(3, 122, 1, 1, 0, 0),
(3, 141, 1, 1, 0, 0),
(3, 146, 1, 1, 1, 1),
(3, 150, 0, 0, 0, 0),
(3, 155, 1, 1, 1, 0),
(3, 198, 1, 1, 1, 0),
(3, 200, 1, 1, 0, 0),
(3, 205, 1, 1, 1, 1),
(3, 214, 1, 1, 0, 0),
(3, 233, 1, 1, 0, 0),
(3, 234, 1, 1, 0, 0),
(4, 5, 1, 1, 1, 1),
(4, 227, 1, 1, 1, 1),
(4, 228, 1, 1, 1, 1),
(5, 6, 1, 1, 1, 1),
(5, 29, 0, 0, 1, 1),
(5, 33, 1, 1, 1, 1),
(5, 36, 1, 1, 1, 1),
(5, 38, 1, 1, 1, 1),
(5, 45, 1, 1, 1, 1),
(5, 52, 1, 1, 1, 1),
(5, 58, 1, 1, 1, 1),
(5, 75, 1, 1, 1, 1),
(5, 76, 1, 1, 1, 1),
(5, 80, 1, 1, 1, 1),
(5, 114, 1, 1, 1, 1),
(5, 115, 1, 1, 1, 1),
(5, 124, 1, 1, 1, 1),
(5, 128, 1, 1, 1, 1),
(5, 129, 1, 1, 1, 1),
(5, 149, 1, 1, 0, 0),
(5, 204, 1, 1, 1, 1),
(5, 217, 1, 1, 1, 1),
(5, 226, 0, 0, 1, 1),
(5, 240, 1, 1, 1, 1),
(5, 247, 1, 1, 1, 1),
(5, 251, 0, 0, 1, 1),
(5, 255, 1, 1, 1, 1),
(6, 7, 1, 1, 1, 1),
(6, 34, 0, 0, 1, 1),
(6, 89, 1, 1, 1, 1),
(6, 111, 1, 1, 1, 1),
(6, 117, 1, 1, 1, 1),
(6, 139, 0, 0, 1, 1),
(6, 180, 0, 0, 1, 1),
(6, 185, 0, 0, 1, 1),
(7, 8, 0, 0, 1, 1),
(7, 50, 1, 0, 0, 0),
(7, 61, 0, 0, 1, 0),
(7, 63, 0, 1, 0, 0),
(7, 64, 0, 0, 0, 1),
(7, 69, 0, 1, 0, 1),
(7, 70, 0, 0, 1, 0),
(7, 99, 1, 0, 0, 0),
(7, 123, 0, 0, 0, 1),
(7, 159, 0, 1, 0, 0),
(7, 166, 0, 1, 1, 0),
(7, 171, 0, 1, 0, 0),
(7, 172, 0, 1, 0, 1),
(7, 181, 0, 1, 0, 1),
(7, 199, 0, 1, 0, 0),
(7, 239, 0, 0, 0, 1),
(7, 243, 0, 1, 0, 1),
(7, 245, 1, 0, 0, 1),
(8, 10, 1, 1, 1, 1),
(8, 31, 1, 1, 1, 1),
(8, 152, 1, 1, 1, 1),
(8, 154, 1, 1, 1, 1),
(9, 11, 1, 1, 1, 1),
(9, 55, 1, 1, 1, 1),
(9, 71, 0, 0, 0, 0),
(9, 82, 1, 1, 1, 0),
(9, 90, 0, 0, 1, 1),
(9, 93, 1, 1, 0, 0),
(9, 95, 0, 0, 0, 0),
(9, 105, 0, 0, 0, 0),
(9, 113, 1, 1, 1, 1),
(9, 130, 0, 0, 1, 1),
(9, 137, 1, 1, 1, 1),
(9, 157, 0, 1, 1, 1),
(9, 161, 1, 1, 1, 1),
(9, 162, 1, 1, 1, 1),
(9, 194, 1, 1, 1, 1),
(9, 195, 1, 1, 1, 1),
(9, 209, 1, 1, 1, 1),
(9, 219, 1, 1, 1, 1),
(9, 221, 1, 1, 1, 1),
(9, 225, 0, 0, 0, 0),
(10, 12, 1, 1, 1, 1),
(10, 17, 1, 1, 1, 1),
(10, 98, 1, 1, 1, 1),
(10, 100, 1, 1, 1, 1),
(10, 103, 1, 1, 1, 1),
(10, 144, 1, 1, 1, 1),
(10, 153, 1, 1, 1, 1),
(10, 182, 1, 1, 1, 1),
(10, 183, 1, 1, 1, 1),
(10, 242, 1, 1, 1, 1),
(10, 244, 1, 1, 1, 1),
(11, 13, 1, 1, 1, 1),
(11, 14, 1, 1, 0, 0),
(11, 35, 1, 1, 1, 1),
(11, 66, 1, 1, 1, 1),
(11, 67, 1, 1, 0, 0),
(11, 83, 1, 1, 1, 1),
(11, 104, 1, 1, 1, 1),
(11, 143, 1, 1, 1, 1),
(11, 156, 1, 1, 1, 1),
(11, 169, 1, 1, 1, 1),
(11, 184, 1, 1, 1, 1),
(11, 187, 0, 0, 0, 0),
(11, 201, 1, 1, 1, 1),
(11, 202, 1, 1, 1, 1),
(11, 215, 1, 1, 1, 1),
(11, 241, 1, 1, 1, 1),
(11, 248, 1, 1, 1, 1),
(11, 259, 1, 1, 1, 1),
(11, 261, 1, 1, 1, 1),
(11, 271, 1, 1, 1, 1),
(11, 276, 1, 1, 1, 1),
(11, 282, 1, 1, 1, 1),
(11, 305, 0, 0, 1, 1),
(11, 308, 1, 1, 1, 1),
(11, 321, 1, 1, 1, 1),
(11, 322, 1, 1, 1, 1),
(11, 327, 1, 1, 1, 1),
(12, 15, 1, 1, 1, 1),
(12, 85, 1, 1, 1, 1),
(12, 142, 1, 1, 1, 1),
(12, 148, 1, 1, 1, 1),
(12, 163, 1, 1, 1, 1),
(13, 16, 1, 1, 1, 1),
(13, 101, 0, 1, 0, 1),
(13, 102, 1, 1, 1, 1),
(13, 175, 1, 1, 1, 1),
(15, 18, 1, 1, 1, 1),
(15, 26, 1, 1, 1, 1),
(15, 78, 1, 1, 1, 1),
(15, 79, 1, 1, 0, 0),
(15, 87, 1, 1, 0, 0),
(15, 96, 1, 1, 1, 1),
(15, 189, 1, 1, 1, 1),
(15, 213, 1, 1, 1, 1),
(15, 236, 1, 1, 1, 1),
(15, 237, 0, 0, 1, 1),
(16, 20, 0, 0, 1, 1),
(16, 28, 1, 1, 0, 0),
(16, 62, 1, 1, 1, 1),
(16, 107, 1, 1, 1, 1),
(16, 110, 1, 1, 0, 0),
(16, 119, 0, 1, 1, 1),
(16, 127, 1, 1, 1, 1),
(16, 177, 1, 1, 1, 1),
(16, 179, 1, 1, 0, 0),
(16, 192, 1, 1, 1, 1),
(16, 197, 0, 0, 1, 1),
(16, 253, 1, 1, 1, 1),
(17, 21, 0, 1, 1, 0),
(17, 57, 1, 0, 0, 0),
(17, 173, 1, 1, 1, 1),
(17, 176, 1, 1, 1, 1),
(19, 27, 1, 1, 1, 1),
(19, 37, 1, 1, 1, 1),
(19, 46, 1, 1, 1, 1),
(19, 49, 1, 1, 1, 1),
(19, 53, 1, 1, 1, 1),
(19, 65, 1, 1, 1, 1),
(19, 77, 1, 1, 1, 1),
(19, 86, 1, 1, 1, 1),
(19, 106, 1, 1, 1, 1),
(19, 112, 1, 1, 1, 1),
(19, 132, 1, 1, 1, 1),
(19, 138, 1, 1, 1, 1),
(19, 140, 1, 1, 1, 1),
(19, 147, 0, 0, 1, 1),
(19, 160, 1, 1, 1, 1),
(19, 164, 1, 1, 1, 1),
(19, 168, 1, 1, 1, 1),
(19, 170, 1, 1, 1, 1),
(19, 191, 1, 1, 1, 1),
(19, 196, 1, 1, 1, 1),
(19, 203, 1, 1, 1, 1),
(19, 206, 1, 1, 1, 1),
(19, 211, 1, 1, 1, 1),
(19, 216, 1, 1, 1, 1),
(19, 218, 1, 1, 1, 1),
(19, 224, 1, 1, 1, 1),
(19, 249, 1, 1, 1, 1),
(19, 252, 1, 1, 1, 1),
(20, 30, 1, 1, 1, 1),
(21, 32, 1, 1, 0, 0),
(21, 51, 1, 1, 1, 1),
(21, 208, 0, 0, 1, 1),
(21, 212, 1, 1, 1, 1),
(22, 43, 1, 1, 1, 1),
(22, 68, 1, 1, 1, 0),
(22, 97, 1, 1, 1, 1),
(22, 126, 1, 1, 1, 0),
(22, 235, 1, 1, 1, 1),
(23, 47, 1, 1, 1, 1),
(23, 74, 0, 1, 1, 1),
(23, 88, 1, 1, 0, 0),
(23, 116, 1, 1, 1, 1),
(23, 118, 1, 1, 1, 1),
(23, 131, 1, 1, 1, 1),
(23, 186, 1, 1, 1, 1),
(23, 190, 1, 1, 1, 1),
(23, 193, 1, 1, 1, 1),
(23, 223, 1, 1, 1, 1),
(23, 265, 1, 1, 1, 1),
(23, 277, 1, 1, 1, 1),
(23, 279, 1, 1, 1, 1),
(23, 291, 1, 1, 1, 1),
(23, 292, 1, 1, 1, 1),
(23, 314, 1, 1, 1, 1),
(23, 323, 1, 1, 1, 1),
(24, 54, 1, 1, 1, 1),
(24, 246, 1, 1, 1, 1),
(25, 60, 1, 1, 1, 1),
(26, 72, 1, 1, 1, 1),
(26, 73, 1, 1, 1, 1),
(26, 188, 1, 1, 1, 1),
(27, 92, 0, 1, 0, 1),
(28, 174, 1, 1, 1, 1),
(29, 174, 1, 1, 1, 1),
(31, 204, 1, 1, 1, 1),
(32, 207, 1, 1, 1, 1),
(33, 220, 1, 1, 1, 1),
(33, 250, 1, 1, 1, 1),
(34, 231, 0, 0, 1, 1),
(34, 238, 0, 0, 1, 1),
(34, 257, 1, 1, 0, 0),
(36, 258, 1, 1, 1, 1),
(36, 285, 1, 1, 1, 1),
(36, 286, 1, 1, 1, 1),
(36, 325, 1, 1, 1, 1),
(37, 260, 1, 1, 1, 1),
(37, 262, 1, 1, 1, 1),
(37, 266, 1, 1, 1, 1),
(37, 267, 1, 1, 0, 0),
(37, 268, 1, 1, 1, 1),
(37, 270, 1, 1, 1, 1),
(37, 274, 1, 1, 1, 1),
(37, 275, 1, 1, 1, 1),
(37, 278, 1, 1, 0, 0),
(37, 281, 1, 1, 1, 1),
(37, 283, 0, 0, 1, 1),
(37, 284, 0, 0, 1, 1),
(37, 289, 1, 1, 0, 0),
(37, 293, 1, 1, 1, 1),
(37, 294, 1, 1, 1, 1),
(37, 298, 1, 1, 1, 1),
(37, 299, 0, 0, 1, 1),
(37, 301, 1, 1, 1, 1),
(37, 309, 1, 1, 0, 0),
(37, 312, 1, 1, 1, 1),
(37, 313, 1, 1, 1, 1),
(37, 315, 1, 1, 0, 0),
(37, 316, 1, 1, 1, 1),
(37, 317, 0, 0, 1, 1),
(37, 319, 1, 1, 1, 1),
(37, 320, 1, 1, 1, 0),
(37, 324, 1, 1, 1, 1),
(37, 326, 1, 1, 1, 1),
(38, 263, 1, 1, 0, 0),
(38, 287, 0, 0, 1, 1),
(38, 288, 1, 1, 1, 1),
(38, 296, 0, 0, 1, 1),
(38, 297, 1, 1, 1, 1),
(38, 300, 0, 0, 1, 1),
(38, 302, 1, 1, 1, 1),
(38, 307, 1, 1, 0, 0),
(38, 310, 1, 1, 0, 0),
(39, 264, 1, 1, 1, 1),
(40, 269, 1, 1, 1, 1),
(41, 273, 1, 1, 1, 1),
(42, 280, 0, 1, 0, 1),
(42, 318, 0, 0, 1, 1),
(44, 294, 1, 1, 1, 1),
(45, 303, 0, 0, 1, 1),
(45, 306, 1, 1, 1, 1),
(46, 304, 1, 1, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `genre`
--

CREATE TABLE `genre` (
  `genre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `genre`
--

INSERT INTO `genre` (`genre`) VALUES
('alsatique'),
('BD'),
('cuisine'),
('histoire'),
('policier'),
('roman'),
('SF');

-- --------------------------------------------------------

--
-- Structure de la table `import`
--

CREATE TABLE `import` (
  `COL 1` varchar(43) DEFAULT NULL,
  `COL 2` varchar(18) DEFAULT NULL,
  `COL 3` varchar(52) DEFAULT NULL,
  `COL 4` varchar(7) DEFAULT NULL,
  `COL 5` varchar(6) DEFAULT NULL,
  `COL 6` varchar(10) DEFAULT NULL,
  `COL 7` varchar(8) DEFAULT NULL,
  `COL 8` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `import`
--

INSERT INTO `import` (`COL 1`, `COL 2`, `COL 3`, `COL 4`, `COL 5`, `COL 6`, `COL 7`, `COL 8`) VALUES
('Martin', 'Adamiec', 'Éditions du Tourneciel', '332', '', '', 'X', 'X\n'),
('Christian', 'Albecker', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X\n'),
('Ninon', 'Amey', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X\n'),
('Bénédicte', 'Ammar', 'L\'Esprit BD', '504', 'X', 'X', 'X', 'X\n'),
('Roland', 'Anstett', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Baptiste', 'Antoine', 'Comité d\'Histoire Régionale', '227', 'X', 'X', 'X', 'X\n'),
('Vanessa', 'Arenaga', 'Association des Éditeurs belges', '328', '', '', 'X', 'X\n'),
('Virginie ', 'Avril', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X\n'),
('Lilie', 'Bagage', 'La Capsule', '501', 'X', 'X', 'X', 'X\n'),
('Solène', 'Bakowski', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X\n'),
('Sabine', 'Barth', 'Auxilivre', '302', 'X', 'X', 'X', 'X\n'),
('Marie', 'Battinger', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Alain', 'Bauer', 'Librairie RUC', '304', 'X', 'X', '', '\n'),
('Hugues', 'Baum', 'Médiapop', '319', 'X', 'X', 'X', 'X\n'),
('André', 'Bechler', 'Reber Éditions | Couloir du Temps', '327', 'X', 'X', 'X', 'X\n'),
('Jean-Pierre', 'Beck', 'Auxilivre', '302', 'X', 'X', 'X', 'X\n'),
('Marie', 'Bellarry', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X\n'),
('Sabine', 'Bengel', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X\n'),
('Catherine', 'Benhamou', 'Librairie Le Chat Perché', '222', '', '', 'X', 'X\n'),
('Lucie', 'Bernard', 'L\'Alsacienne Indépendante', '303', '', 'X', 'X', '\n'),
('Pierre', 'Bieber', 'Comité féd Asso langue et Cullture Alsace et Moselle', '403', 'X', 'X', 'X', 'X\n'),
('Georges', 'Bischoff', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', '\n'),
('Emily', 'Blaine', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '', '\n'),
('Romain', 'Blandre', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', '\n'),
('Anne-Lyse', 'Blasco', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X\n'),
('Marie-Andrée', 'Bohn', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Victorien', 'Bornéat', 'Librairie Le Chat Perché', '222', 'X', 'X', '', '\n'),
('Gabriel', 'Braeuner', 'I.D. l\'Édition', '311', '', '', 'X', 'X\n'),
('Yannik', 'Bruni', 'Salon littéraire de Colmar', '213', 'X', 'X', 'X', 'X\n'),
('David', 'Bulle', 'La Capsule', '501', 'X', 'X', 'X', 'X\n'),
('John', 'Bullit', 'Éditions Rebelyne', '303', 'X', 'X', '', '\n'),
('Sandra', 'Butch', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Pierre-Louis', 'Buzzi', 'Comité d\'Histoire Régionale', '227', '', '', 'X', 'X\n'),
('Cécile', 'Cabanac', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('André', 'Cabaret', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Annie', 'Camacho', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Christophe', 'Carmona', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Maurice', 'Carrez', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', '\n'),
('Maloria', 'Cassis', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X\n'),
('Catherine', 'Ceylac', 'Espace Culturel E. Leclerc', '323', '', '', '', '\n'),
('Muriel', 'Chacon', 'Comité féd Asso langue et Cullture Alsace et Moselle', '403', '', '', 'X', 'X\n'),
('Ambre ', 'Chalumeau', 'Editions l\'Iconoclaste', '222', 'X', 'X', 'X', 'X\n'),
('Naëlle', 'Charles', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X\n'),
('Jean-Pierre', 'Chassard', 'I.D. l\'Édition ', '311', 'X', 'X', 'X', 'X\n'),
('Michel', 'Chevallier', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Fred', 'Cimbao', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Caroline', 'Claude-Bronner', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', '\n'),
('Monique', 'Clausse', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Monique', 'Coant-Blond', 'Association des Éditeurs belges', '328', 'X', '', '', '\n'),
('Bernard', 'Colin', 'Éditions Rebelyne', '303', 'X', 'X', 'X', 'X\n'),
('Laura', 'Collins', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Camille', 'Colva', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Jade', 'Corbeau', 'Éditions du Petit Caveau', '312', 'X', 'X', 'X', 'X\n'),
('Caroline ', 'Costa', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X\n'),
('Linda', 'Da Silva', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X\n'),
('Coralie', 'Darcy', 'L\'Alsacienne Indépendante', '303', 'X', '', '', '\n'),
('Véronique', 'Daul', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Christine', 'Daux', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X\n'),
('Stéphanie', 'De Bussierre', 'Éditions Akinomé', '318', 'X', 'X', 'X', 'X\n'),
('Audrey', 'De Matos', 'Association des Éditeurs belges', '328', '', '', 'X', '\n'),
('Prescille', 'De Rekenlere', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X\n'),
('Philippe', 'De Riemaecker', 'Association des Éditeurs belges', '328', '', 'X', '', '\n'),
('Christian', 'Debast', 'Association des Éditeurs belges', '328', '', '', '', 'X\n'),
('Maxine', 'Delly', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Erwan', 'Desbois', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Sonia', 'Devillers', 'Librairie RUC', '304', 'X', 'X', '', '\n'),
('Adeline', 'Dieudonné', 'Editions l\'Iconoclaste', '222', 'X', 'X', 'X', '\n'),
('Bruno', 'Dinant', 'Association des Éditeurs belges', '328', '', 'X', '', 'X\n'),
('Ndongo', 'Diop', 'Association des Éditeurs belges', '328', '', '', 'X', '\n'),
('Abibou', 'Diouf', 'Librairie Pleine Page', '308', '', '', '', '\n'),
('Lara', 'Dopff', 'Éditions Phloème', '224', 'X', 'X', 'X', 'X\n'),
('Francis', 'Dopff', 'Éditions Phloème', '224', 'X', 'X', 'X', 'X\n'),
('Bénédicte', 'Dupré La Tour', 'Librairie le Libroscope', '222', '', 'X', 'X', 'X\n'),
('Jean-Luc', 'Eling', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Françoise', 'Elkouby', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Constantin', 'Enache', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Roger ', 'Faindt', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X\n'),
('Anne-Gaëlle', 'Féjoz', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', '', '\n'),
('Alex', 'Fick-Muller', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Anouk', 'Filippini', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?\n'),
('Ena', 'Fitzbel', 'Librairie Pleine Page', '308', 'X', 'X', 'X', '\n'),
('Benjamin', 'Fogel', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Jacques', 'Fortier', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', 'X', 'X\n'),
('Sylvain', 'Freyburger', 'Médiapop', '319', 'X', 'X', 'X', 'X\n'),
('Nick', 'Gardel', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Françoise', 'Gardeur', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', '', '\n'),
('Paul ', 'Gasnier', 'Librairie le Libroscope', '222', 'X', 'X', '', '\n'),
('Christophe', 'Gatti', 'Comité d\'Histoire Régionale', '227', 'X', 'X', 'X', 'X\n'),
('Aurélien', 'Gautherie', 'Librairie Pleine Page', '308', '', '', 'X', 'X\n'),
('Sandrine', 'Gendreau', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X\n'),
('Clémence ', 'Germain', 'Le monde de Théo', '218', '', 'X', '', 'X\n'),
('Raphaëlle', 'Giordano', 'Librairie Pleine Page', '308', 'X', 'X', '', '\n'),
('Delphine', 'Giraud', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?\n'),
('Laure', 'Gouraige', 'Librairie Pleine Page', '308', '', '', '', '\n'),
('Florence', ' Griffond ', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X\n'),
('Olivier ', 'Grondeau', 'Editions l\'Iconoclaste', '222', 'X', 'X', 'X', 'X\n'),
('André', 'Groshans', 'Auxilivre', '302', 'X', 'X', 'X', 'X\n'),
('Pablo', 'Gubitsch', 'Association des Éditeurs belges', '328', 'X', '', '', '\n'),
('Hervé', 'Gueth', 'Auxilivre', '302', 'X', 'X', 'X', 'X\n'),
('Dominique', 'Guibbert', 'Reber Éditions | Couloir du Temps', '327', '', 'X', '', 'X\n'),
('Francis', 'Guthleben', 'Reber Éditions | Couloir du Temps', '327', 'X', 'X', 'X', 'X\n'),
('Martine', 'Haas-Nunge', 'Auxilivre', '302', 'X', 'X', 'X', 'X\n'),
('Nathalie', 'Haberstroh', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Éric', 'Halphen', 'Librairie Pleine Page', '308', '', '', '', '\n'),
('Amélie', 'Hanser', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Serge', 'Hastom', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X\n'),
('Eva', 'Hébert', 'Éditions du Tourneciel', '332', 'X', 'X', '', '\n'),
('Joël', 'Henry', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', '\n'),
('Léo', 'Henry', 'Librairie Le Chat Perché', '222', 'X', 'X', '', '\n'),
('Florian', 'Hensel', 'Comité d\'Histoire Régionale', '227', 'X', 'X', 'X', 'X\n'),
('Sandrine', 'Holder', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Virginie', 'Humbrecht', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X\n'),
('Agnès', 'Jaeger', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Jean-Marie', 'Jaeger', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Jeanfi', 'Janssens', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Dominique', 'Jarrassé', 'Comité d\'Histoire Régionale', '227', 'X', 'X', 'X', 'X\n'),
('Sophie', 'Jomain', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Florence', 'Jou', 'Librairie Le Chat Perché', '222', '', 'X', 'X', 'X\n'),
('Frank', 'Jung', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X\n'),
('Marie-Christine', 'Jung', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X\n'),
('Cynthia', 'Kafka', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?\n'),
('Alessia', 'Karre', 'Association des Éditeurs belges', '328', '', '', '', 'X\n'),
('Gilbert', 'Keller', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Nicolas ', 'Kempf', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', 'X', 'X\n'),
('Julia', 'Kerninon', 'Editions l\'Iconoclaste', '222', 'X', 'X', 'X', '\n'),
('Françoise', 'Kerymer', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X\n'),
('René', 'Kill', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Pierre', 'Klein', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Hadrien ', 'Klent (en attente)', 'Librairie Pleine Page', '308', '?', '?', 'X', 'X\n'),
('Jack', 'Koch', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Pierre', 'Koenig', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Jean-François', 'Kovar', 'La Nuée Bleue / Ebra éditions', '309', '', 'X', '', '\n'),
('Pierre', 'Kretz', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', 'X', 'X\n'),
('Isabelle', 'Lagarrigue', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X\n'),
('Jacqueline', 'Lahsen', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Michaël', 'Landolt', 'Comité d\'Histoire Régionale', '227', '', '', 'X', 'X\n'),
('Florian', 'Leaune', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Charlotte', 'Léman', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?\n'),
('Hervé', 'Lévy', 'Médiapop', '319', 'X', 'X', 'X', 'X\n'),
('Éric', 'Libiot', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Michel', 'Loetscher', 'Auxilivre', '302', 'X', 'X', 'X', 'X\n'),
('Sophie', 'Loubière', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X\n'),
('Nathalie', 'Ludwig', 'La Plume Colmarienne', '207', '', '', 'X', 'X\n'),
('Philippe', 'Lutz', 'Médiapop', '319', 'X', 'X', 'X', 'X\n'),
('Perrine', 'M. Schaller', 'I.D. l\'Édition', '311', 'X', 'X', '', '\n'),
('Joseph', 'Macé-Scaron', 'Espace Culturel E. Leclerc', '323', '', '', '', '\n'),
('Thierry', 'Maire', 'La Capsule', '501', 'X', 'X', 'X', 'X\n'),
('Gabrielle', 'Makli', 'Auxilivre', '302', 'X', 'X', 'X', 'X\n'),
('Joël', 'Mallet', 'La Capsule', '501', 'X', 'X', 'X', 'X\n'),
('Mathias', 'Malzieu', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', '?\n'),
('Laure', 'Manel', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Ian', 'Manook', 'Librairie Pleine Page', '308', '', 'X', 'X', 'X\n'),
('Anne-Sophie', 'Martin', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X\n'),
('Caroline', 'Masse', 'Association des Éditeurs belges', '328', '', 'X', '', '\n'),
('Martine', 'Maurer Khachoyan', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Kate', 'Mc Alistair', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X\n'),
('Ian', 'McGuire', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X\n'),
('Bertrand', 'Merle', 'Médiapop', '319', 'X', 'X', 'X', 'X\n'),
('Kokouvi Roméo', 'Messa-Gavo', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Alexis', 'Metzinger', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', '\n'),
('Aude ', 'Meunier', 'Association des Éditeurs belges', '328', '', 'X', 'X', '\n'),
('Jean-Christophe', 'Meyer', 'Éditions du Tourneciel', '332', 'X', 'X', 'X', 'X\n'),
('Patrick', 'Milano', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Niels', 'Minkmar', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Marion', 'Miquel', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Fred', 'Moray', 'Association des Éditeurs belges', '328', '', 'X', '', '\n'),
('Brigitte', 'Moreau', 'Association des Éditeurs belges', '328', '', 'X', '', 'X\n'),
('Élodie', 'Morgen', 'L\'Alsacienne Indépendante', '303', 'X', 'X', 'X', 'X\n'),
('Simone', 'Morgenthaler', 'La Nuée Bleue | I.D. l\'Édition', '309|311', 'X', 'X', 'X', 'X\n'),
('Roland', 'Moser', 'Reber Éditions | Couloir du Temps', '327', 'X', 'X', 'X', 'X\n'),
('Jessica', 'Motron', 'L\'Alsacienne Indépendante', '303', 'X', 'X', 'X', 'X\n'),
('Véronique', 'Mougin', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X\n'),
('Michel', 'Munier', 'Librairie Le Chat Perché', '222', 'X', 'X', '', '\n'),
('Cédric', 'Neveu', 'Comité d\'Histoire Régionale', '227', '', '', 'X', 'X\n'),
('Tuyêt-Nga', 'Nguyên', 'Association des Éditeurs belges', '328', '', 'X', '', 'X\n'),
('Minh Thuyen', 'Nhu', 'Auxilivre', '302', 'X', 'X', 'X', 'X\n'),
('Nathalie', 'Nhu', 'Auxilivre', '302', 'X', 'X', 'X', 'X\n'),
('Claire', 'Norton', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Françoise', 'Olivier-Utard', 'Comité d\'Histoire Régionale', '227', '', '', 'X', 'X\n'),
('Virginie', 'Ollagnier', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Fabien', 'Onteniente', 'Librairie RUC', '304', '', '', '', '\n'),
('Yves', 'Ouallet', 'Éditions Phloème', '224', 'X', 'X', 'X', 'X\n'),
('Nicole', 'Oudin', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X\n'),
('Bernard', 'Pascuitto', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('L.M.', 'Péquignot', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Anne', 'Percin', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X\n'),
('Sylvie ', 'Pérenne', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Stéphanie', 'Perez', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X\n'),
('Fabienne', 'Périneau', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X\n'),
('Gilles', 'Petitdemange', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Jocelyn', 'Peyret', 'Librairie Le Chat Perché', '222', '', '', 'X', 'X\n'),
('Laurence', 'Peyrin', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', '\n'),
('Olivier', 'Pirnay', 'Association des Éditeurs belges', '328', '', 'X', '', '\n'),
('Carène', 'Ponte', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?\n'),
('Nico', 'Prat', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Alexandra ', 'Puppinck Bortoli', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Michel', 'Rederon', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Sylvie', 'Reff', 'I.D. l\'Édition | Auxilivre ', '311|302', 'X', 'X', 'X', 'X\n'),
('Antoine', 'Renand', 'Espace Culturel E. Leclerc', '323', 'X', 'X', 'X', 'X\n'),
('Clara', 'Renard', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Daniel', 'Reutenauer', 'Librairie Biblique Certitude', '301', 'X', 'X', 'X', 'X\n'),
('Patrick', 'Richard', 'Éditions Rebelyne', '303', '', '', 'X', 'X\n'),
('Laure', 'Rollier', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X\n'),
('Suzanne', 'Roth', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X\n'),
('Stéphane', 'Rougier', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Nathalie', 'Rouyer', 'Éditions Rebelyne', '303', 'X', 'X', 'X', 'X\n'),
('Allan', 'Ryan', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X\n'),
('Clarisse', 'Sabard', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?\n'),
('Virginie ', 'Saint-Martin', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Cédric', 'Sauriat', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Richard', 'Schalck', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Suzel', 'Schmitt', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Stéphane', 'Schmucker', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X\n'),
('Sandra', 'Schuhler-Bastian', 'Bastian Éditions', '315', 'X', 'X', 'X', 'X\n'),
('Francis', 'Schull', 'Librairie Pleine Page', '308', 'X', 'X', 'X', 'X\n'),
('Jean-François', 'Schwaiger', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', '\n'),
('Geneviève ', 'Senger', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Elebora', 'Sentier', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Anouk', 'Shutterberg', 'Librairie Pleine Page', '308', '', '', '', '\n'),
('Yann', 'Siefert', 'I.D. l\'Édition', '311', '', '', 'X', 'X\n'),
('Soum Phone', 'Singharat', 'L\'Esprit BD', '504', 'X', 'X', 'X', 'X\n'),
('Christophe', 'Sonesaksith', 'L\'Esprit BD', '504', 'X', 'X', 'X', 'X\n'),
('Jean-Louis', 'Spiesser', 'Comité féd Asso langue et Cullture Alsace et Moselle', '403', 'X', 'X', 'X', 'X\n'),
('Dan', 'Steffan', 'Éditions du Tourneciel', '332', '', 'X', '', '\n'),
('Estelle', 'Strub', 'Heimetsproch un tràdition', '233', '', '', 'X', 'X\n'),
('Jean-Pierre', 'Stucki-Darsch', 'La Nuée Bleue / Ebra éditions', '309', 'X', 'X', '', '\n'),
('Niko', 'Tackian', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?\n'),
('Sophie', 'Tal Men', 'Espace Culturel E. Leclerc', '323', 'X', 'X', '?', '?\n'),
('Joséphine', 'Tassy', 'Editions l\'Iconoclaste', '222', 'X', 'X', 'X', 'X\n'),
('Lucien', 'Tramontana', 'ALL Bourgogne Franche-Comté', '306', 'X', 'X', 'X', 'X\n'),
('Jacques-Olivier', 'Trompas', 'ALL Bourgogne Franche-Comté', '306', '', '', 'X', 'X\n'),
('Evelyne', 'Troxler', 'Heimetsproch un tràdition', '233', '', '', 'X', 'X\n'),
('Fébronie', 'Tsassis', 'Association des Éditeurs belges', '328', '', '', '', 'X\n'),
('Joëlle', 'Umbdenstock', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Mickaël', 'Uras', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Jean-Pierre', 'Vançon', 'Auxilivre', '302', 'X', 'X', 'X', 'X\n'),
('Cindy', 'Vandermeulen', 'Association des Éditeurs belges', '328', '', 'X', '', 'X\n'),
('Rose-Marie', 'Van-Thom', 'Auxilivre', '302', 'X', 'X', 'X', 'X\n'),
('Manuel', 'Verlange', 'Association des Éditeurs belges', '328', 'X', '', '', 'X\n'),
('Jean', 'Vigne', 'Éditions du Petit Caveau', '312', 'X', 'X', 'X', 'X\n'),
('Denis', 'Voigne', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Tristan', 'Vuano', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Karine', 'W. Meyer', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Jean-Philippe', 'Wagner', 'Bastian Éditions', '315', 'X', 'X', 'X', 'X\n'),
('Serge', 'Weber', 'I.D. l\'Édition', '311', '', '', 'X', 'X\n'),
('Hugues', 'Werlé', 'La Plume Colmarienne', '207', 'X', 'X', 'X', 'X\n'),
('Marine', 'Westphal', 'Librairie Le Chat Perché', '222', 'X', 'X', 'X', 'X\n'),
('Julien-Thomas', 'Will', 'La Nuée Bleue / Ebra éditions', '309', '', '', 'X', 'X\n'),
('Anne-Marie', 'Wimmer', 'I.D. l\'Édition', '311', 'X', 'X', 'X', 'X\n'),
('Bernard', 'Wittmann', 'Comité féd Asso langue et Cullture Alsace et Moselle', '403', 'X', 'X', '', '\n'),
('Edgar', 'Zeidler', 'Heimetsproch un tràdition', '233', 'X', 'X', '', '\n'),
('Jeunesse | Hall 4 et librairies partenaires', '', '', '', '', '', '', '\n'),
('Pascal', 'Alexandre', 'Le Texte et la Parole', '402', 'X', 'X', 'X', 'X\n'),
('Maïwenn', 'Alix', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Emilie', 'Angebault', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Fanny', 'Anthony', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Gaël', 'Aymon', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Iwona', 'Barzasi', 'Éditions l\'Inattendue', '422', 'X', 'X', '', '\n'),
('Alix', 'Bellac', 'Arlequin Éditions', '427', 'X', 'X', 'X', 'X\n'),
('Enzo', 'Berkati', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Sandy', 'Bizzozzero', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Rosalinde', 'Bonnet', 'Librairie La Bouquinette', '413', 'X', 'X', '', '\n'),
('Crescence', 'Bouvarel', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Jean-Baptiste', 'Bozzi', 'Itak Éditions', '420', 'X', 'X', 'X', 'X\n'),
('Mickaël', 'Brun-Arnaud', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Lorena', 'Calderon', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Laurent', 'Cardon', 'Éditions Père Fouettard', '412', 'X', 'X', 'X', 'X\n'),
('Thierry', 'Chapeau', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Alexandre', 'Chardin', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Aurélie', 'Chien Chow Chine', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Magali', 'Clavelet', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Charline', 'Colette', 'Librairie La Bouquinette', '413', 'X', 'X', '', '\n'),
('Benoît', 'Debecker', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Julian', 'Delgrange', 'Le Jardin des Mots', '425', '', 'X', '', 'X\n'),
('Maëlle', 'Desart', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Stéphanie', 'Desbenoit', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Marie', 'Dorléans', 'Librairie La Bouquinette', '413', '', '', 'X', 'X\n'),
('Alice', 'Dozier', 'Librairie La Bouquinette', '413', '', '', 'X', 'X\n'),
('Jacques-Marie', 'Duchêne', 'Le Texte et la Parole', '402', 'X', 'X', 'X', 'X\n'),
('Catherine ', 'Duchêne', 'Le Texte et la Parole', '402', 'X', 'X', 'X', 'X\n'),
('Emilie', 'Fischesser', 'Éditions l\'Inattendue', '422', '', '', 'X', 'X\n'),
('Gaëlle', 'Fratelli', 'Éditions l\'Inattendue', '422', 'X', 'X', 'X', 'X\n'),
('Claire', 'Frossard', 'Librairie La Bouquinette', '413', 'X', 'X', '', '\n'),
('Maxime', 'Gillio', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Quentin', 'Girardclos', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Christian', 'Heinrich', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Florence', 'Jenner Metz', 'Librairie La Bouquinette | Alice Éditions', '413|411', 'X', 'X', 'X', 'X\n'),
('Camille', 'Kromer', 'Éditions l\'Inattendue', '422', '', '', 'X', 'X\n'),
('Xavier', 'Lhomme', 'Éditions l\'Inattendue', '422', 'X', 'X', 'X', 'X\n'),
('Erik', 'L\'Homme', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Colombe', 'Linotte', 'Librairie La Bouquinette', '413', '', '', 'X', 'X\n'),
('Virginie', 'Loth', 'Éditions l\'Inattendue', '422', '', '', 'X', 'X\n'),
('Jean-Luc', 'Marcastel', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Julian', 'Marchais', 'Éditions l\'Inattendue', '422', 'X', 'X', 'X', 'X\n'),
('Lorraine', 'Marchand', 'Éditions Le Pont du Vent', '409', '', '', 'X', 'X\n'),
('Marie-Astrid', 'Masson', 'Alice Éditions', '411', 'X', 'X', 'X', '\n'),
('Philippe', 'Matter', 'Librairie RUC', '304', '', '', 'X', 'X\n'),
('Isabelle', 'Meyer', 'Éditions Le Pont du Vent', '409', 'X', 'X', 'X', 'X\n'),
('Caroline ', 'Meyer', 'Éditions l\'Inattendue', '422', 'X', 'X', '', '\n'),
('Cyrille', 'Meyer', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Caroline', 'Millet', 'Librairie La Bouquinette', '413', 'X', 'X', '', '\n'),
('Anne', 'Mongeot', 'Éditions l\'Inattendue', '422', 'X', 'X', '', '\n'),
('Marine ', 'Orenga', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Jérémy', 'Pailler', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Mathilde ', 'Paris', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Clotilde', 'Perrin', 'Librairie La Bouquinette', '413', 'X', 'X', '', '\n'),
('Jérôme', 'Peyrat', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Frédéric', 'Pillot', 'Librairie La Bouquinette', '413', '', '', 'X', 'X\n'),
('Florence', 'Pirot', 'Le Jardin des Mots', '425', '', '', 'X', 'X\n'),
('Pascal', 'Prévot', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Sophie ', 'Rigal-Goulard', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', '\n'),
('Eugène', 'Santangelo', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Laetitia', 'Sivi', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n'),
('Tom', 'Sorroldoni', 'Librairie le Libroscope', '222', 'X', 'X', 'X', 'X\n'),
('Adèle', 'Tariel', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Anne', 'Théréné', 'Le Texte et la Parole', '402', 'X', 'X', 'X', 'X\n'),
('Camille', 'Tisserand', 'Librairie La Bouquinette', '413', 'X', 'X', 'X', 'X\n'),
('Aude', 'Ziegelmeyer', 'Librairie RUC', '304', 'X', 'X', 'X', 'X\n');

-- --------------------------------------------------------

--
-- Structure de la table `lieu`
--

CREATE TABLE `lieu` (
  `num` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `hall` int(11) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `x1` int(11) DEFAULT NULL,
  `y1` int(11) DEFAULT NULL,
  `x2` int(11) DEFAULT NULL,
  `y2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `lieu`
--

INSERT INTO `lieu` (`num`, `nom`, `hall`, `type`, `x1`, `y1`, `x2`, `y2`) VALUES
(207, '207', 2, 'stand', NULL, NULL, NULL, NULL),
(213, '213', 2, 'stand', NULL, NULL, NULL, NULL),
(218, '218', 2, 'stand', NULL, NULL, NULL, NULL),
(222, '222', 2, 'stand', NULL, NULL, NULL, NULL),
(224, '224', 2, 'stand', NULL, NULL, NULL, NULL),
(227, '227', 2, 'stand', NULL, NULL, NULL, NULL),
(233, '233', 2, 'stand', NULL, NULL, NULL, NULL),
(301, '301', 3, 'stand', NULL, NULL, NULL, NULL),
(302, '302', 3, 'stand', NULL, NULL, NULL, NULL),
(303, '303', 3, 'stand', NULL, NULL, NULL, NULL),
(304, '304', 3, 'stand', NULL, NULL, NULL, NULL),
(306, '306', 3, 'stand', NULL, NULL, NULL, NULL),
(308, '308', 3, 'stand', NULL, NULL, NULL, NULL),
(309, '309', 3, 'stand', NULL, NULL, NULL, NULL),
(311, '311', 3, 'stand', NULL, NULL, NULL, NULL),
(312, '312', 3, 'stand', NULL, NULL, NULL, NULL),
(315, '315', 3, 'stand', NULL, NULL, NULL, NULL),
(318, '318', 3, 'stand', NULL, NULL, NULL, NULL),
(319, '319', 3, 'stand', NULL, NULL, NULL, NULL),
(323, '323', 3, 'stand', NULL, NULL, NULL, NULL),
(327, '327', 3, 'stand', NULL, NULL, NULL, NULL),
(328, '328', 3, 'stand', NULL, NULL, NULL, NULL),
(332, '332', 3, 'stand', NULL, NULL, NULL, NULL),
(402, '402', 4, 'stand', NULL, NULL, NULL, NULL),
(403, '403', 4, 'stand', NULL, NULL, NULL, NULL),
(409, '409', 4, 'stand', NULL, NULL, NULL, NULL),
(411, '411', 4, 'stand', NULL, NULL, NULL, NULL),
(412, '412', 4, 'stand', NULL, NULL, NULL, NULL),
(413, '413', 4, 'stand', NULL, NULL, NULL, NULL),
(420, '420', 4, 'stand', NULL, NULL, NULL, NULL),
(422, '422', 4, 'stand', NULL, NULL, NULL, NULL),
(425, '425', 4, 'stand', NULL, NULL, NULL, NULL),
(427, '427', 4, 'stand', NULL, NULL, NULL, NULL),
(501, '501', 5, 'stand', NULL, NULL, NULL, NULL),
(504, '504', 5, 'stand', NULL, NULL, NULL, NULL),
(505, NULL, 5, 'théatre', NULL, NULL, NULL, NULL),
(506, NULL, 5, 'théatre', NULL, NULL, NULL, NULL),
(511, 'Ma tasse de thé', 5, 'théatre', NULL, NULL, NULL, NULL),
(512, 'Café de l’histoire', 5, 'théatre', NULL, NULL, NULL, NULL),
(513, 'Café littéraire', 5, 'théatre', NULL, NULL, NULL, NULL),
(514, 'Le temps des mots', 5, 'théatre', NULL, NULL, NULL, NULL),
(515, 'Caf? de l’histoire', 5, 'théatre', NULL, NULL, NULL, NULL),
(516, 'Ma tasse de th?', 5, 'théatre', NULL, NULL, NULL, NULL),
(517, 'Caf? litt?raire', 5, 'théatre', NULL, NULL, NULL, NULL),
(518, 'Salle Riesling', 5, 'théatre', NULL, NULL, NULL, NULL),
(519, '', 5, 'théatre', NULL, NULL, NULL, NULL),
(520, 'Hall 1', 5, 'théatre', NULL, NULL, NULL, NULL),
(521, 'Hall 2', 5, 'théatre', NULL, NULL, NULL, NULL),
(522, 'Hall 3', 5, 'théatre', NULL, NULL, NULL, NULL),
(523, 'la Comédie de Colmar', 1, 'théatre', NULL, NULL, NULL, NULL),
(524, 'la Com?die de Colmar', 1, 'théatre', NULL, NULL, NULL, NULL),
(525, 'L\'atelier musée des arts de Ribeauvillé', 1, 'théatre', NULL, NULL, NULL, NULL),
(526, 'La Stampfelfabrik', 2, 'théatre', NULL, NULL, NULL, NULL),
(527, 'Région Grand Est', 2, 'théatre', NULL, NULL, NULL, NULL),
(528, 'Les Amis de la Bibliothèque de Colmar', 3, 'théatre', NULL, NULL, NULL, NULL),
(529, 'Stand 103 : Panier Culture', 1, 'théatre', NULL, NULL, NULL, NULL),
(530, 'Amandine Lefebvre', 1, 'théatre', NULL, NULL, NULL, NULL),
(531, 'Ginkgo éditeur', 3, 'théatre', NULL, NULL, NULL, NULL),
(532, 'Scène Pop Culture', 5, 'théatre', NULL, NULL, NULL, NULL),
(533, 'Panier Culture', 1, 'théatre', NULL, NULL, NULL, NULL),
(534, '(Amandine Lefebvre)', 1, 'théatre', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `livre`
--

CREATE TABLE `livre` (
  `id` int(11) NOT NULL,
  `titre` varchar(80) DEFAULT NULL,
  `resume` varchar(1000) DEFAULT NULL,
  `idEditeur` int(11) DEFAULT NULL,
  `genre` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `livre`
--

INSERT INTO `livre` (`id`, `titre`, `resume`, `idEditeur`, `genre`) VALUES
(1, 'Dans le bric-à-brac de ma mémoire ', NULL, 1, NULL),
(2, 'Roman de l’avent : un Noël sur la Lune', NULL, 22, NULL),
(3, 'L’homme qui écoutait battre le cœur des chats', NULL, 2, NULL),
(4, 'L’exclusion culturelle ', NULL, 3, NULL),
(5, 'Les passeurs d’histoires ', NULL, 23, NULL),
(6, 'Synagogue de France', NULL, 5, NULL),
(7, 'Le fabuleux piano', NULL, 6, NULL),
(8, 'Les évadés du Convoi 53', NULL, 7, NULL),
(9, 'L’oiseau-forêt', NULL, 8, NULL),
(10, 'Miracles', NULL, 9, NULL),
(11, 'Les récidives', NULL, 9, NULL),
(12, ' Un sort enviable', NULL, 15, NULL),
(13, ' Les remplacés', NULL, 11, NULL),
(14, 'La fille de Jonathan Becker', NULL, 12, NULL),
(15, 'Les miroirs sourient à ceux qui s’aiment', NULL, 9, NULL),
(16, 'Dans la jungle', NULL, 13, NULL),
(17, 'L’âge de déplaire', NULL, 2, NULL),
(18, ' Le groupe', NULL, 9, NULL),
(19, 'Là où le ciel murmure', NULL, 24, NULL),
(20, 'Une autre histoire du crime', NULL, 25, NULL),
(21, 'La vérité sur le système Epstein', NULL, 25, NULL),
(22, 'Il faut sauver nos enfants', NULL, 25, NULL),
(23, 'Te retrouver en autome', NULL, 26, NULL),
(24, 'La Dernière des Wilberforce', NULL, 13, NULL),
(25, 'Vagabondes', NULL, 13, NULL),
(26, 'Et Dieu dans tout ça', NULL, 27, NULL),
(27, 'Pisser dans les cours d’eau', NULL, 28, NULL),
(28, 'Minjung', NULL, 19, NULL),
(29, 'Corée du Nord : marathon en pays interdit', NULL, 29, NULL),
(30, 'La collision', NULL, 7, NULL),
(31, 'De gré ou de force. Le choix de Franz', NULL, 30, NULL),
(32, 'Verveine et l’équinoxe d’automne', NULL, 20, NULL),
(33, 'Les Contes de Bellécorce : L\'atelier Grand-Feuille', NULL, 21, NULL),
(34, 'Les Brumes de Glenhollow', NULL, 31, NULL),
(35, 'Accident ', NULL, 32, NULL),
(36, 'Artefact', NULL, 9, NULL),
(37, 'Zones à défendre', NULL, 19, NULL),
(38, 'Vermeilles', NULL, 33, NULL),
(39, 'Le jour zéro', NULL, 34, NULL),
(40, 'Intime', NULL, 35, NULL),
(41, 'Joseph dans la nuit', NULL, 13, NULL),
(42, ' La femme corbeau', NULL, 36, NULL),
(43, 'La force d’en rire', NULL, 12, NULL),
(44, 'Grave', NULL, 37, NULL),
(45, 'Mado des oiseaux', NULL, 24, NULL),
(46, 'Le Berger d’Alep', NULL, 9, NULL),
(47, 'Liste de lecture', NULL, 13, NULL),
(48, 'Les Vivants', NULL, 27, NULL),
(49, 'créateur des éditions Playlist SocietyÉric LIBIOT', NULL, 38, NULL),
(50, 'Nos amours boréales', NULL, 22, NULL),
(51, 'White River', NULL, 15, NULL),
(52, 'Double vie', NULL, 19, NULL);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `LivreEditeurPersonneExposant`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `LivreEditeurPersonneExposant` (
`id` int(11)
,`titre` varchar(80)
,`resume` varchar(1000)
,`genre` varchar(20)
,`idEditeur` int(11)
,`editeur` varchar(80)
,`idPersonne` int(11)
,`nom` varchar(50)
,`prenom` varchar(50)
,`civilite` varchar(20)
,`idExposant` int(11)
,`nomExposant` varchar(50)
,`idEvenement` int(11)
,`titreEvenement` varchar(80)
,`debut` datetime
,`typeEvenement` varchar(30)
);

-- --------------------------------------------------------

--
-- Structure de la table `personne`
--

CREATE TABLE `personne` (
  `id` int(11) NOT NULL,
  `civilite` varchar(20) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `biographie` varchar(1000) DEFAULT NULL,
  `specialite` varchar(20) DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `personne`
--

INSERT INTO `personne` (`id`, `civilite`, `prenom`, `nom`, `biographie`, `specialite`, `photo`, `type`) VALUES
(2, NULL, 'Martin', 'Adamiec', NULL, 'auteur', NULL, NULL),
(3, NULL, 'Christian', 'Albecker', NULL, 'auteur', NULL, NULL),
(4, NULL, 'Ninon', 'Amey', NULL, 'auteur', NULL, NULL),
(5, NULL, 'Bénédicte', 'Ammar', NULL, 'auteur', NULL, NULL),
(6, NULL, 'Roland', 'Anstett', NULL, 'auteur', NULL, NULL),
(7, NULL, 'Baptiste', 'Antoine', NULL, 'auteur', NULL, NULL),
(8, NULL, 'Vanessa', 'Arenaga', NULL, 'auteur', NULL, NULL),
(9, NULL, 'Virginie ', 'Avril', NULL, 'auteur', NULL, NULL),
(10, NULL, 'Lilie', 'Bagage', NULL, 'auteur', NULL, NULL),
(11, NULL, 'Solène', 'Bakowski', NULL, 'auteur', NULL, NULL),
(12, NULL, 'Sabine', 'Barth', NULL, 'auteur', NULL, NULL),
(13, NULL, 'Marie', 'Battinger', NULL, 'auteur', NULL, NULL),
(14, NULL, 'Alain', 'Bauer', NULL, 'auteur', 'assets/photos/BAUER Alain © Astrid di Crollalanza.png', 'RV'),
(15, NULL, 'Hugues', 'Baum', NULL, 'auteur', NULL, NULL),
(16, NULL, 'André', 'Bechler', NULL, 'auteur', NULL, NULL),
(17, NULL, 'Jean-Pierre', 'Beck', NULL, 'auteur', NULL, NULL),
(18, NULL, 'Marie', 'Bellarry', NULL, 'auteur', NULL, NULL),
(19, NULL, 'Sabine', 'Bengel', NULL, 'auteur', NULL, NULL),
(20, NULL, 'Catherine', 'Benhamou', NULL, 'auteur', NULL, NULL),
(21, NULL, 'Lucie', 'Bernard', NULL, 'auteur', NULL, NULL),
(22, NULL, 'Pierre', 'Bieber', NULL, 'auteur', NULL, NULL),
(23, NULL, 'Georges', 'Bischoff', NULL, 'auteur', NULL, NULL),
(24, NULL, 'Emily', 'Blaine', NULL, 'auteur', NULL, NULL),
(25, NULL, 'Romain', 'Blandre', NULL, 'auteur', NULL, NULL),
(26, NULL, 'Anne-Lyse', 'Blasco', NULL, 'auteur', NULL, NULL),
(27, NULL, 'Marie-Andrée', 'Bohn', NULL, 'auteur', NULL, NULL),
(28, NULL, 'Victorien', 'Bornéat', NULL, 'auteur', 'assets/photos/BORNEAT Victorien par Margot de Rochefort.jpeg', 'RV'),
(29, NULL, 'Gabriel', 'Braeuner', NULL, 'auteur', NULL, NULL),
(30, NULL, 'Yannik', 'Bruni', NULL, 'auteur', NULL, NULL),
(31, NULL, 'David', 'Bulle', NULL, 'auteur', NULL, NULL),
(32, NULL, 'John', 'Bullit', NULL, 'auteur', NULL, NULL),
(33, NULL, 'Sandra', 'Butch', NULL, 'auteur', NULL, NULL),
(34, NULL, 'Pierre-Louis', 'Buzzi', NULL, 'auteur', NULL, NULL),
(35, NULL, 'Cécile', 'Cabanac', NULL, 'auteur', NULL, NULL),
(36, NULL, 'André', 'Cabaret', NULL, 'auteur', NULL, NULL),
(37, NULL, 'Annie', 'Camacho', NULL, 'auteur', NULL, NULL),
(38, NULL, 'Christophe', 'Carmona', NULL, 'auteur', NULL, NULL),
(39, NULL, 'Maurice', 'Carrez', NULL, 'auteur', NULL, NULL),
(40, NULL, 'Maloria', 'Cassis', NULL, 'auteur', NULL, NULL),
(41, NULL, 'Catherine', 'Ceylac', NULL, 'auteur', NULL, 'RV'),
(42, NULL, 'Muriel', 'Chacon', NULL, 'auteur', NULL, NULL),
(43, NULL, 'Ambre ', 'Chalumeau', NULL, 'auteur', 'assets/photos/CHALUMEAU Ambre @Dorian Prost-ok.jpg', 'RV'),
(44, NULL, 'Naëlle', 'Charles', NULL, 'auteur', NULL, NULL),
(45, NULL, 'Jean-Pierre', 'Chassard', NULL, 'auteur', NULL, NULL),
(46, NULL, 'Michel', 'Chevallier', NULL, 'auteur', NULL, NULL),
(47, NULL, 'Fred', 'Cimbao', NULL, 'auteur', NULL, NULL),
(48, NULL, 'Caroline', 'Claude-Bronner', NULL, 'auteur', NULL, NULL),
(49, NULL, 'Monique', 'Clausse', NULL, 'auteur', NULL, NULL),
(50, NULL, 'Monique', 'Coant-Blond', NULL, 'auteur', NULL, NULL),
(51, NULL, 'Bernard', 'Colin', NULL, 'auteur', NULL, NULL),
(52, NULL, 'Laura', 'Collins', NULL, 'auteur', NULL, NULL),
(53, NULL, 'Camille', 'Colva', NULL, 'auteur', NULL, NULL),
(54, NULL, 'Jade', 'Corbeau', NULL, 'auteur', NULL, NULL),
(55, NULL, 'Caroline ', 'Costa', NULL, 'auteur', NULL, NULL),
(56, NULL, 'Linda', 'Da Silva', NULL, 'auteur', NULL, NULL),
(57, NULL, 'Coralie', 'Darcy', NULL, 'auteur', NULL, NULL),
(58, NULL, 'Véronique', 'Daul', NULL, 'auteur', NULL, NULL),
(59, NULL, 'Christine', 'Daux', NULL, 'auteur', NULL, NULL),
(60, NULL, 'Stéphanie', 'De Bussierre', NULL, 'auteur', NULL, NULL),
(61, NULL, 'Audrey', 'De Matos', NULL, 'auteur', NULL, NULL),
(62, NULL, 'Prescille', 'De Rekenlere', NULL, 'auteur', NULL, NULL),
(63, NULL, 'Philippe', 'De Riemaecker', NULL, 'auteur', NULL, NULL),
(64, NULL, 'Christian', 'Debast', NULL, 'auteur', NULL, NULL),
(65, NULL, 'Maxine', 'Delly', NULL, 'auteur', NULL, NULL),
(66, NULL, 'Erwan', 'Desbois', NULL, 'auteur', 'assets/photos/DESBOIS Erwan (pas de crédit).jpg', 'RV'),
(67, NULL, 'Sonia', 'Devillers', NULL, 'auteur', 'assets/photos/DEVILLERS Sonia (c) Pascal Ito.jpg', 'RV'),
(68, NULL, 'Adeline', 'Dieudonné', NULL, 'auteur', 'assets/photos/DIEUDONNE Adeline ©jerome-bonnet.jpg', 'RV'),
(69, NULL, 'Bruno', 'Dinant', NULL, 'auteur', NULL, NULL),
(70, NULL, 'Ndongo', 'Diop', NULL, 'auteur', NULL, NULL),
(71, NULL, 'Abibou', 'Diouf', NULL, 'auteur', NULL, 'RV'),
(72, NULL, 'Lara', 'Dopff', NULL, 'auteur', NULL, NULL),
(73, NULL, 'Francis', 'Dopff', NULL, 'auteur', NULL, NULL),
(74, NULL, 'Bénédicte', 'Dupré La Tour', NULL, 'auteur', NULL, 'RV'),
(75, NULL, 'Jean-Luc', 'Eling', NULL, 'auteur', NULL, NULL),
(76, NULL, 'Françoise', 'Elkouby', NULL, 'auteur', NULL, NULL),
(77, NULL, 'Constantin', 'Enache', NULL, 'auteur', NULL, NULL),
(78, NULL, 'Roger ', 'Faindt', NULL, 'auteur', NULL, NULL),
(79, NULL, 'Anne-Gaëlle', 'Féjoz', NULL, 'auteur', NULL, NULL),
(80, NULL, 'Alex', 'Fick-Muller', NULL, 'auteur', NULL, NULL),
(81, NULL, 'Anouk', 'Filippini', NULL, 'auteur', 'assets/photos/FILIPPINI Anouk Portrait.JPG', NULL),
(82, NULL, 'Ena', 'Fitzbel', NULL, 'auteur', NULL, NULL),
(83, NULL, 'Benjamin', 'Fogel', NULL, 'auteur', 'assets/photos/FOGEL Benjamin ((c) Alexis Fogel.jpg', 'RV'),
(84, NULL, 'Jacques', 'Fortier', NULL, 'auteur', NULL, NULL),
(85, NULL, 'Sylvain', 'Freyburger', NULL, 'auteur', NULL, NULL),
(86, NULL, 'Nick', 'Gardel', NULL, 'auteur', NULL, NULL),
(87, NULL, 'Françoise', 'Gardeur', NULL, 'auteur', NULL, NULL),
(88, NULL, 'Paul ', 'Gasnier', NULL, 'auteur', 'assets/photos/GASNIER Paul 2025_Francesca_Mantovani´┐¢Gallimard_87A4734.jpg', 'RV'),
(89, NULL, 'Christophe', 'Gatti', NULL, 'auteur', NULL, NULL),
(90, NULL, 'Aurélien', 'Gautherie', NULL, 'auteur', NULL, NULL),
(91, NULL, 'Sandrine', 'Gendreau', NULL, 'auteur', NULL, NULL),
(92, NULL, 'Clémence ', 'Germain', NULL, 'auteur', NULL, NULL),
(93, NULL, 'Raphaëlle', 'Giordano', NULL, 'auteur', 'assets/photos/GIORDANO Raphaëlle 2026 © Philipe Matzas.jpg', 'RV'),
(94, NULL, 'Delphine', 'Giraud', NULL, 'auteur', NULL, NULL),
(95, NULL, 'Laure', 'Gouraige', NULL, 'auteur', 'assets/photos/GOURAIGE Laure - (c) Dorian Prost.jpg', 'RV'),
(96, NULL, 'Florence', ' Griffond ', NULL, 'auteur', NULL, NULL),
(97, NULL, 'Olivier ', 'Grondeau', NULL, 'auteur', 'assets/photos/GRONDEAU Olivier ©dorian—prost-ok.jpg', 'RV'),
(98, NULL, 'André', 'Groshans', NULL, 'auteur', NULL, NULL),
(99, NULL, 'Pablo', 'Gubitsch', NULL, 'auteur', NULL, NULL),
(100, NULL, 'Hervé', 'Gueth', NULL, 'auteur', NULL, NULL),
(101, NULL, 'Dominique', 'Guibbert', NULL, 'auteur', NULL, NULL),
(102, NULL, 'Francis', 'Guthleben', NULL, 'auteur', NULL, NULL),
(103, NULL, 'Martine', 'Haas-Nunge', NULL, 'auteur', NULL, NULL),
(104, NULL, 'Nathalie', 'Haberstroh', NULL, 'auteur', NULL, NULL),
(105, NULL, 'Éric', 'Halphen', NULL, 'auteur', 'assets/photos/HALPHEN Eric 2026-6.jpg', 'RV'),
(106, NULL, 'Amélie', 'Hanser', NULL, 'auteur', NULL, NULL),
(107, NULL, 'Serge', 'Hastom', NULL, 'auteur', 'assets/photos/HASTOM Serge.jpeg', 'RV'),
(108, NULL, 'Eva', 'Hébert', NULL, 'auteur', NULL, NULL),
(109, NULL, 'Joël', 'Henry', NULL, 'auteur', NULL, NULL),
(110, NULL, 'Léo', 'Henry', NULL, 'auteur', NULL, NULL),
(111, NULL, 'Florian', 'Hensel', NULL, 'auteur', NULL, NULL),
(112, NULL, 'Sandrine', 'Holder', NULL, 'auteur', NULL, NULL),
(113, NULL, 'Virginie', 'Humbrecht', NULL, 'auteur', NULL, NULL),
(114, NULL, 'Agnès', 'Jaeger', NULL, 'auteur', NULL, NULL),
(115, NULL, 'Jean-Marie', 'Jaeger', NULL, 'auteur', NULL, NULL),
(116, NULL, 'Jeanfi', 'Janssens', NULL, 'auteur', 'assets/photos/JANSSENS Jeanfi (c) Olivier Seignette 2 3.jpg', 'RV'),
(117, NULL, 'Dominique', 'Jarrassé', NULL, 'auteur', NULL, NULL),
(118, NULL, 'Sophie', 'Jomain', NULL, 'auteur', NULL, NULL),
(119, NULL, 'Florence', 'Jou', NULL, 'auteur', 'assets/photos/JOU Florence © Bénédicte Roscot 03.jpg', 'RV'),
(120, NULL, 'Frank', 'Jung', NULL, 'auteur', NULL, NULL),
(121, NULL, 'Marie-Christine', 'Jung', NULL, 'auteur', NULL, NULL),
(122, NULL, 'Cynthia', 'Kafka', NULL, 'auteur', NULL, NULL),
(123, NULL, 'Alessia', 'Karre', NULL, 'auteur', NULL, NULL),
(124, NULL, 'Gilbert', 'Keller', NULL, 'auteur', NULL, NULL),
(125, NULL, 'Nicolas ', 'Kempf', NULL, 'auteur', NULL, NULL),
(126, NULL, 'Julia', 'Kerninon', NULL, 'auteur', 'assets/photos/KERNINON julia (c) dorian—prost-ok.jpg', 'RV'),
(127, NULL, 'Françoise', 'Kerymer', NULL, 'auteur', 'assets/photos/KERYMER Françoise par Stéphanie Melon.jpg', 'RV'),
(128, NULL, 'René', 'Kill', NULL, 'auteur', NULL, NULL),
(129, NULL, 'Pierre', 'Klein', NULL, 'auteur', NULL, NULL),
(130, NULL, 'Hadrien ', 'Klent (en attente)', NULL, 'auteur', NULL, 'RV'),
(131, NULL, 'Jack', 'Koch', NULL, 'auteur', NULL, NULL),
(132, NULL, 'Pierre', 'Koenig', NULL, 'auteur', NULL, NULL),
(133, NULL, 'Jean-François', 'Kovar', NULL, 'auteur', NULL, NULL),
(136, NULL, 'Pierre', 'Kretz', NULL, 'auteur', NULL, NULL),
(137, NULL, 'Isabelle', 'Lagarrigue', NULL, 'auteur', 'assets/photos/LAGARRIGUE ISABELLE@Melania Avanzato taille réduite.jpg', 'RV'),
(138, NULL, 'Jacqueline', 'Lahsen', NULL, 'auteur', NULL, NULL),
(139, NULL, 'Michaël', 'Landolt', NULL, 'auteur', NULL, NULL),
(140, NULL, 'Florian', 'Leaune', NULL, 'auteur', NULL, NULL),
(141, NULL, 'Charlotte', 'Léman', NULL, 'auteur', NULL, NULL),
(142, NULL, 'Hervé', 'Lévy', NULL, 'auteur', NULL, NULL),
(143, NULL, 'Éric', 'Libiot', NULL, 'auteur', 'assets/photos/LIBIOT Eric.jpg', 'RV'),
(144, NULL, 'Michel', 'Loetscher', NULL, 'auteur', NULL, NULL),
(146, NULL, 'Sophie', 'Loubière', NULL, 'auteur', 'assets/photos/LOUBIERE Sophie (c) Chloé Vollmer-Lo.jpg', 'RV'),
(147, NULL, 'Nathalie', 'Ludwig', NULL, 'auteur', NULL, NULL),
(148, NULL, 'Philippe', 'Lutz', NULL, 'auteur', NULL, NULL),
(149, NULL, 'Perrine', 'M. Schaller', NULL, 'auteur', NULL, NULL),
(150, NULL, 'Joseph', 'Macé-Scaron', NULL, 'auteur', 'assets/photos/MACE-SCARON Joseph (c) H.Assouline.jpg', 'RV'),
(152, NULL, 'Thierry', 'Maire', NULL, 'auteur', NULL, NULL),
(153, NULL, 'Gabrielle', 'Makli', NULL, 'auteur', NULL, NULL),
(154, NULL, 'Joël', 'Mallet', NULL, 'auteur', NULL, NULL),
(155, NULL, 'Mathias', 'Malzieu', NULL, 'auteur', 'assets/photos/MALZIEU Mathias © Sébastien Dubois - Didcock.JPG', 'RV'),
(156, NULL, 'Laure', 'Manel', NULL, 'auteur', NULL, NULL),
(157, NULL, 'Ian', 'Manook', NULL, 'auteur', NULL, 'RV'),
(158, NULL, 'Anne-Sophie', 'Martin', NULL, 'auteur', NULL, NULL),
(159, NULL, 'Caroline', 'Masse', NULL, 'auteur', NULL, NULL),
(160, NULL, 'Martine', 'Maurer Khachoyan', NULL, 'auteur', NULL, NULL),
(161, NULL, 'Kate', 'Mc Alistair', NULL, 'auteur', NULL, NULL),
(162, NULL, 'Ian', 'McGuire', NULL, 'auteur', 'assets/photos/McGUIRE Ian 2026 © Paul Wolfgang Webster.jpg', 'RV'),
(163, NULL, 'Bertrand', 'Merle', NULL, 'auteur', NULL, NULL),
(164, NULL, 'Kokouvi Roméo', 'Messa-Gavo', NULL, 'auteur', NULL, NULL),
(165, NULL, 'Alexis', 'Metzinger', NULL, 'auteur', NULL, NULL),
(166, NULL, 'Aude ', 'Meunier', NULL, 'auteur', NULL, NULL),
(167, NULL, 'Jean-Christophe', 'Meyer', NULL, 'auteur', NULL, NULL),
(168, NULL, 'Patrick', 'Milano', NULL, 'auteur', NULL, NULL),
(169, NULL, 'Niels', 'Minkmar', NULL, 'auteur', NULL, NULL),
(170, NULL, 'Marion', 'Miquel', NULL, 'auteur', NULL, NULL),
(171, NULL, 'Fred', 'Moray', NULL, 'auteur', NULL, NULL),
(172, NULL, 'Brigitte', 'Moreau', NULL, 'auteur', NULL, NULL),
(173, NULL, 'Élodie', 'Morgen', NULL, 'auteur', NULL, NULL),
(174, NULL, 'Simone', 'Morgenthaler', NULL, 'auteur', NULL, NULL),
(175, NULL, 'Roland', 'Moser', NULL, 'auteur', NULL, NULL),
(176, NULL, 'Jessica', 'Motron', NULL, 'auteur', NULL, NULL),
(177, NULL, 'Véronique', 'Mougin', 'Véronique Mougin est journaliste spécialisée dans le domaine social et romancière. Elle travaille de 2005 à 2010 à l\'Express puis collabore en free-lance à divers titres de presse (Marianne, Politis, La VO...) et magazines féminins dont Marie-Claire, Elle et Femme actuelle. Son dernier ouvrage À propos d’un village oublié (Flammarion, 2025) est inspiré de l’histoire vraie de sa grand-mère.\n', 'auteur', NULL, NULL),
(179, NULL, 'Michel', 'Munier', NULL, 'auteur', 'assets/photos/MUNIER Michel 3 (c) Vincent Munier.jpg', 'RV'),
(180, NULL, 'Cédric', 'Neveu', NULL, 'auteur', 'assets/photos/NEVEU Cédric crédit Nomades Dominique Hennequin.png', NULL),
(181, NULL, 'Tuyêt-Nga', 'Nguyên', NULL, 'auteur', NULL, NULL),
(182, NULL, 'Minh Thuyen', 'Nhu', NULL, 'auteur', NULL, NULL),
(183, NULL, 'Nathalie', 'Nhu', NULL, 'auteur', NULL, NULL),
(184, NULL, 'Claire', 'Norton', NULL, 'auteur', NULL, NULL),
(185, NULL, 'Françoise', 'Olivier-Utard', NULL, 'auteur', NULL, NULL),
(186, NULL, 'Virginie', 'Ollagnier', NULL, 'auteur', NULL, NULL),
(187, NULL, 'Fabien', 'Onteniente', NULL, 'auteur', 'assets/photos/ONTENIENTE Fabien 39 V3 © Astrid di Crollalanza.jpg', 'RV'),
(188, NULL, 'Yves', 'Ouallet', NULL, 'auteur', NULL, NULL),
(189, NULL, 'Nicole', 'Oudin', NULL, 'auteur', NULL, NULL),
(190, NULL, 'Bernard', 'Pascuitto', NULL, 'auteur', NULL, NULL),
(191, NULL, 'L.M.', 'Péquignot', NULL, 'auteur', NULL, NULL),
(192, NULL, 'Anne', 'Percin', NULL, 'auteur', NULL, NULL),
(193, NULL, 'Sylvie ', 'Pérenne', NULL, 'auteur', 'assets/photos/Sylvie Pérenne.jpg', 'RV'),
(194, NULL, 'Stéphanie', 'Perez', NULL, 'auteur', 'assets/photos/PEREZ Stéphanie2@ Melania Avanzato.jpg', 'RV'),
(195, NULL, 'Fabienne', 'Périneau', NULL, 'auteur', NULL, NULL),
(196, NULL, 'Gilles', 'Petitdemange', NULL, 'auteur', NULL, NULL),
(197, NULL, 'Jocelyn', 'Peyret', NULL, 'auteur', NULL, NULL),
(198, NULL, 'Laurence', 'Peyrin', NULL, 'auteur', 'assets/photos/PEYRIN Laurence  © Astrid di Crollalanza2.jpg', 'RV'),
(199, NULL, 'Olivier', 'Pirnay', NULL, 'auteur', NULL, NULL),
(200, NULL, 'Carène', 'Ponte', NULL, 'auteur', NULL, NULL),
(201, NULL, 'Nico', 'Prat', NULL, 'auteur', 'assets/photos/PRAT Nico (pas de rédit).jpg', 'RV'),
(202, NULL, 'Alexandra ', 'Puppinck Bortoli', NULL, 'auteur', NULL, NULL),
(203, NULL, 'Michel', 'Rederon', NULL, 'auteur', NULL, NULL),
(204, NULL, 'Sylvie', 'Reff', NULL, 'auteur', NULL, NULL),
(205, NULL, 'Antoine', 'Renand', NULL, 'auteur', 'assets/photos/RENAND Portrait © Melania Avanzato.JPG', 'RV'),
(206, NULL, 'Clara', 'Renard', NULL, 'auteur', NULL, NULL),
(207, NULL, 'Daniel', 'Reutenauer', NULL, 'auteur', NULL, NULL),
(208, NULL, 'Patrick', 'Richard', NULL, 'auteur', NULL, NULL),
(209, NULL, 'Laure', 'Rollier', NULL, 'auteur', 'assets/photos/ROLLIER Laure @ Melania Avanzato - taille réduite.jpg', 'RV'),
(210, NULL, 'Suzanne', 'Roth', NULL, 'auteur', NULL, NULL),
(211, NULL, 'Stéphane', 'Rougier', NULL, 'auteur', NULL, NULL),
(212, NULL, 'Nathalie', 'Rouyer', NULL, 'auteur', NULL, NULL),
(213, NULL, 'Allan', 'Ryan', NULL, 'auteur', NULL, NULL),
(214, NULL, 'Clarisse', 'Sabard', NULL, 'auteur', NULL, NULL),
(215, NULL, 'Virginie ', 'Saint-Martin', NULL, 'auteur', NULL, NULL),
(216, NULL, 'Cédric', 'Sauriat', NULL, 'auteur', NULL, NULL),
(217, NULL, 'Richard', 'Schalck', NULL, 'auteur', NULL, NULL),
(218, NULL, 'Suzel', 'Schmitt', NULL, 'auteur', NULL, NULL),
(219, NULL, 'Stéphane', 'Schmucker', NULL, 'auteur', NULL, NULL),
(220, NULL, 'Sandra', 'Schuhler-Bastian', NULL, 'auteur', NULL, NULL),
(221, NULL, 'Francis', 'Schull', NULL, 'auteur', NULL, NULL),
(222, NULL, 'Jean-François', 'Schwaiger', NULL, 'auteur', NULL, NULL),
(223, NULL, 'Geneviève ', 'Senger', NULL, 'auteur', NULL, NULL),
(224, NULL, 'Elebora', 'Sentier', NULL, 'auteur', NULL, NULL),
(225, NULL, 'Anouk', 'Shutterberg', NULL, 'auteur', 'assets/photos/SHUTTERBERG Anouk @ Melania Avanzato taille réduite.jpg', 'RV'),
(226, NULL, 'Yann', 'Siefert', NULL, 'auteur', NULL, NULL),
(227, NULL, 'Soum Phone', 'Singharat', NULL, 'auteur', NULL, NULL),
(228, NULL, 'Christophe', 'Sonesaksith', NULL, 'auteur', NULL, NULL),
(229, NULL, 'Jean-Louis', 'Spiesser', NULL, 'auteur', NULL, NULL),
(230, NULL, 'Dan', 'Steffan', NULL, 'auteur', NULL, NULL),
(231, NULL, 'Estelle', 'Strub', NULL, 'auteur', NULL, NULL),
(232, NULL, 'Jean-Pierre', 'Stucki-Darsch', NULL, 'auteur', NULL, NULL),
(233, NULL, 'Niko', 'Tackian', NULL, 'auteur', NULL, NULL),
(234, NULL, 'Sophie', 'Tal Men', NULL, 'auteur', NULL, NULL),
(235, NULL, 'Joséphine', 'Tassy', NULL, 'auteur', 'assets/photos/TASSY Josephine ©dorian_prost-ok.jpg', 'RV'),
(236, NULL, 'Lucien', 'Tramontana', NULL, 'auteur', NULL, NULL),
(237, NULL, 'Jacques-Olivier', 'Trompas', NULL, 'auteur', NULL, NULL),
(238, NULL, 'Evelyne', 'Troxler', NULL, 'auteur', NULL, NULL),
(239, NULL, 'Fébronie', 'Tsassis', NULL, 'auteur', NULL, NULL),
(240, NULL, 'Joëlle', 'Umbdenstock', NULL, 'auteur', NULL, NULL),
(241, NULL, 'Mickaël', 'Uras', NULL, 'auteur', NULL, NULL),
(242, NULL, 'Jean-Pierre', 'Vançon', NULL, 'auteur', NULL, NULL),
(243, NULL, 'Cindy', 'Vandermeulen', NULL, 'auteur', NULL, NULL),
(244, NULL, 'Rose-Marie', 'Van-Thom', NULL, 'auteur', NULL, NULL),
(245, NULL, 'Manuel', 'Verlange', NULL, 'auteur', NULL, NULL),
(246, NULL, 'Jean', 'Vigne', NULL, 'auteur', NULL, NULL),
(247, NULL, 'Denis', 'Voigne', NULL, 'auteur', NULL, NULL),
(248, NULL, 'Tristan', 'Vuano', NULL, 'auteur', NULL, NULL),
(249, NULL, 'Karine', 'W. Meyer', NULL, 'auteur', NULL, NULL),
(250, NULL, 'Jean-Philippe', 'Wagner', NULL, 'auteur', NULL, NULL),
(251, NULL, 'Serge', 'Weber', NULL, 'auteur', NULL, NULL),
(252, NULL, 'Hugues', 'Werlé', NULL, 'auteur', NULL, NULL),
(253, NULL, 'Marine', 'Westphal', NULL, 'auteur', NULL, NULL),
(254, NULL, 'Julien-Thomas', 'Will', NULL, 'auteur', NULL, NULL),
(255, NULL, 'Anne-Marie', 'Wimmer', NULL, 'auteur', NULL, NULL),
(256, NULL, 'Bernard', 'Wittmann', NULL, 'auteur', NULL, NULL),
(257, NULL, 'Edgar', 'Zeidler', NULL, 'auteur', NULL, NULL),
(258, NULL, 'Pascal', 'Alexandre', NULL, 'auteur', 'assets/photos/Alexandre Chardin.jpg', NULL),
(259, NULL, 'Maïwenn', 'Alix', NULL, 'auteur', NULL, 'J'),
(260, NULL, 'Emilie', 'Angebault', 'Aussi loin qu\'elle s\'en souvienne, Émilie Angebault a toujours été entourée de crayons, de papier, de ciseaux, de tissu et de livres. Après cinq ans à l’Ecole Supérieure des Arts Décoratifs de Strasbourg, elle devient plasticienne et illustratrice et travaille pour plusieurs éditeurs jeunesse. \n', 'auteur', 'assets/photos/Emilie Angebault.jpg', 'J'),
(261, NULL, 'Fanny', 'Anthony', NULL, 'auteur', NULL, 'J'),
(262, NULL, 'Gaël', 'Aymon', 'Gaël Aymon a été acteur, scénariste, réalisateur, producteur et a enseigné le théâtre aux enfants et aux adolescents. Il écrit depuis 2010 des albums et des romans pour la jeunesse. Ses livres, à l’écriture poétique ou brute, mais toujours exigeante, ont obtenu de nombreuses récompenses. Il a été nominé à deux reprises (2023 et 2024) au Prix Astrid Lindgren, « le Nobel de la littérature jeunesse », pour l\'ensemble de son œuvre.\n', 'auteur', 'assets/photos/Gaël Aymon.jpg', 'J'),
(263, NULL, 'Iwona', 'Barzasi', NULL, 'auteur', NULL, NULL),
(264, NULL, 'Alix', 'Bellac', NULL, 'auteur', NULL, NULL),
(265, NULL, 'Enzo', 'Berkati', NULL, 'auteur', NULL, 'J'),
(266, NULL, 'Sandy', 'Bizzozzero', NULL, 'auteur', NULL, 'J'),
(267, NULL, 'Rosalinde', 'Bonnet', 'Rosalinde Bonnet est autrice-illustratrice jeunesse. Après deux ans à l\'Ecole des Beaux-Arts de Versailles, elle intègre l\'École Nationale Supérieure des Arts Décoratifs de Paris, dont elle sort diplômée quatre ans plus tard. Depuis, elle a écrit et illustré de nombreux livres parus en France, en Angleterre et aux Etats-Unis. Elle est aussi designer textile et créatrice de jouets.\n', 'auteur', 'assets/photos/Rosalinde Bonnet.jpg', 'J'),
(268, NULL, 'Crescence', 'Bouvarel', NULL, 'auteur', NULL, 'J'),
(269, NULL, 'Jean-Baptiste', 'Bozzi', NULL, 'auteur', NULL, NULL),
(270, NULL, 'Mickaël', 'Brun-Arnaud', NULL, 'auteur', NULL, 'J'),
(271, NULL, 'Lorena', 'Calderon', NULL, 'auteur', NULL, 'J'),
(273, NULL, 'Laurent', 'Cardon', NULL, 'auteur', NULL, NULL),
(274, NULL, 'Thierry', 'Chapeau', NULL, 'auteur', NULL, 'J'),
(275, NULL, 'Alexandre', 'Chardin', 'Alexandre Chardin est auteur pour la jeunesse. Il s’inspire d’ailleurs beaucoup de ses deux garçons pour écrire ses histoires. Après des études de lettres, il devient professeur de français. Depuis 2001 il enseigne au collège de Saint-Amarin. Son premier album, Petit lapin rêve de gloire (2013), est paru chez Casterman. Il a publié des romans et des albums chez différents éditeurs jeunesse. Sa nouveauté Sa majesté des ombres est parue au mois de mars aux éditions Auzou.\n', 'auteur', 'assets/photos/Alexandre Chardin.jpg', 'J'),
(276, NULL, 'Aurélie', 'Chien Chow Chine', NULL, 'auteur', NULL, 'J'),
(277, NULL, 'Magali', 'Clavelet', 'Magali Clavelet est autrice et illustratrice. Après avoir un temps hésité entre les arts et le cinéma, elle sort diplômée de l’École Émile-Cohl à Lyon. Depuis, elle a écrit et illustré de nombreux albums pour la jeunesse, chez différents éditeurs. Elle aime raconter des histoires aux enfants et adore dessiner les animaux ! \n', 'auteur', 'assets/photos/Magali Clavelet.jpg', 'J'),
(278, NULL, 'Charline', 'Colette', NULL, 'auteur', 'assets/photos/Charline Colette.jpg', 'J'),
(279, NULL, 'Benoît', 'Debecker', NULL, 'auteur', NULL, 'J'),
(280, NULL, 'Julian', 'Delgrange', NULL, 'auteur', NULL, NULL),
(281, NULL, 'Maëlle', 'Desart', NULL, 'auteur', NULL, 'J'),
(282, NULL, 'Stéphanie', 'Desbenoit', 'Après une année préparatoire à l’Académie Charpentier, Stéphanie Desbenoit intègre l’Ecole Professionnelle Supérieur d’Art et d’Architecture de la Ville de Paris, dans laquelle elle se spécialise en illustration. Elle est inspirée par la nature sauvage, les animaux et les paysages oniriques. Ses illustrations pimpantes et poétiques réveillent l’animal qui ronronne en chacun de nous.\n', 'auteur', 'assets/photos/Stéphanie Desbenoit.jpg', 'J'),
(283, NULL, 'Marie', 'Dorléans', NULL, 'auteur', NULL, 'J'),
(284, NULL, 'Alice', 'Dozier', NULL, 'auteur', NULL, 'J'),
(285, NULL, 'Jacques-Marie', 'Duchêne', NULL, 'auteur', NULL, NULL),
(286, NULL, 'Catherine ', 'Duchêne', NULL, 'auteur', NULL, NULL),
(287, NULL, 'Emilie', 'Fischesser', NULL, 'auteur', NULL, NULL),
(288, NULL, 'Gaëlle', 'Fratelli', NULL, 'auteur', NULL, NULL),
(289, NULL, 'Claire', 'Frossard', 'Après ses études à l’Ecole Supérieure des Arts Décoratifs de Strasbourg, dont elle est sortie diplômée en 2002, Claire Frossard, originaire de la région parisienne a décidé de s’installer en Alsace. Elle y travaille en compagnie d’autres illustrateurs à l’atelier de la rue de l’Aimant. Elle travaille beaucoup pour la presse spécialisée en petite enfance.\n', 'auteur', 'assets/photos/Claire Frossard.jpg', 'J'),
(291, NULL, 'Maxime', 'Gillio', NULL, 'auteur', NULL, 'J'),
(292, NULL, 'Quentin', 'Girardclos', 'Quentin Girardclos a suivi une formation en bande dessinée au lycée Auguste Renoir, à Paris. Il obtient un BTS Design graphique et un DMA Illustration dans cette même école. Désormais installé à Strasbourg, il partage son temps entre les métiers de graphiste et d’illustrateur. Il est également membre fondateur du collectif \"Mangeurs de pierres\", dédié à la micro-édition.\n', 'auteur', 'assets/photos/Quentin Girardclos.jpg', 'J'),
(293, NULL, 'Christian', 'Heinrich', NULL, 'auteur', NULL, 'J'),
(294, NULL, 'Florence', 'Jenner Metz', NULL, 'auteur', NULL, 'J'),
(296, NULL, 'Camille', 'Kromer', NULL, 'auteur', NULL, NULL),
(297, NULL, 'Xavier', 'Lhomme', NULL, 'auteur', NULL, NULL),
(298, NULL, 'Erik', 'L\'Homme', NULL, 'auteur', NULL, 'J'),
(299, NULL, 'Colombe', 'Linotte', NULL, 'auteur', NULL, 'J'),
(300, NULL, 'Virginie', 'Loth', NULL, 'auteur', NULL, NULL),
(301, NULL, 'Jean-Luc', 'Marcastel', 'Grand lecteur, Jean-Luc dévore les œuvres de Dumas, Lovecraft et Tolkien. Après avoir enseigné l’histoire-géographie pendant plusieurs années, il se tourne vers l’écriture et publie ses premiers romans en 2009. Il se distingue dans le genre de la fantasy en s’inspirant des légendes et des folklores régionaux. En 2015, il remporte le Grand Prix de l’imaginaire.\n', 'auteur', 'assets/photos/Jean-Luc Marcastel.jpg', 'J'),
(302, NULL, 'Julian', 'Marchais', NULL, 'auteur', NULL, NULL),
(303, NULL, 'Lorraine', 'Marchand', NULL, 'auteur', NULL, NULL),
(304, NULL, 'Marie-Astrid', 'Masson', NULL, 'auteur', NULL, NULL),
(305, NULL, 'Philippe', 'Matter', NULL, 'auteur', NULL, 'J'),
(306, NULL, 'Isabelle', 'Meyer', NULL, 'auteur', NULL, NULL),
(307, NULL, 'Caroline ', 'Meyer', NULL, 'auteur', NULL, NULL),
(308, NULL, 'Cyrille', 'Meyer', NULL, 'auteur', NULL, 'J'),
(309, NULL, 'Caroline', 'Millet', NULL, 'auteur', NULL, 'J'),
(310, NULL, 'Anne', 'Mongeot', NULL, 'auteur', NULL, NULL),
(312, NULL, 'Marine ', 'Orenga', NULL, 'auteur', NULL, 'J'),
(313, NULL, 'Jérémy', 'Pailler', 'Jérémy Pailler travaille sur des projets d’illustration variés, allant du livre à l’affiche de cinéma, en passant par le court métrage d’animation. Il a participé à plusieurs résidences d’artistes à l’étranger, notamment en Islande et en Thaïlande. Titulaire d’un doctorat en arts plastiques, il vit aujourd’hui à Limoges. Le Pays du grand ciel est son premier album publié chez Kaléidoscope.\n', 'auteur', 'assets/photos/Jérémy Pailler.jpg', 'J'),
(314, NULL, 'Mathilde ', 'Paris', NULL, 'auteur', NULL, 'J'),
(315, NULL, 'Clotilde', 'Perrin', 'Le voyage dans les images de Clotilde Perrin a commencé dans les Vosges, là où elle est née. Elle a fait des études de communication visuelle à l’école Estienne avant de suivre les cours d’illustration de l’Ecole Supérieure des arts décoratifs de Strasbourg. Depuis, elle a illustré de nombreux livres, s’inspirant souvent de la nature vosgienne de son enfance, où il est possible de rencontrer des bêtes sauvages comme des êtres imaginaires.\n', 'auteur', 'assets/photos/Clotilde Perrin.jpg', 'J'),
(316, NULL, 'Jérôme', 'Peyrat', 'Il crée sa première BD à 7 ans puis étudie à l’Ecole Supérieure des Arts Décoratifs de Strasbourg. Depuis 2000 il illustre pour de nombreuses maisons d’éditions telles Fleurus, Magnard, Bordas, La Martinière, Ricochet… Il a gagné le Prix du livre de la montagne 2019 pour son ouvrage Dans ma montagne paru aux éditions du Père Fouettard en 2017. Il enseigne également à l’Ecole d’Arts plastiques de Colmar.\n', 'auteur', 'assets/photos/Jérôme Peyrat.jpg', 'J'),
(317, NULL, 'Frédéric', 'Pillot', NULL, 'auteur', NULL, 'J'),
(318, NULL, 'Florence', 'Pirot', NULL, 'auteur', NULL, NULL),
(319, NULL, 'Pascal', 'Prévot', NULL, 'auteur', NULL, 'J'),
(320, NULL, 'Sophie ', 'Rigal-Goulard', NULL, 'auteur', 'assets/photos/Sophie Rigal-Goulard.jpg', 'J'),
(321, NULL, 'Eugène', 'Santangelo', NULL, 'auteur', NULL, 'J'),
(322, NULL, 'Laetitia', 'Sivi', NULL, 'auteur', NULL, 'J'),
(323, NULL, 'Tom', 'Sorroldoni', NULL, 'auteur', NULL, 'J'),
(324, NULL, 'Adèle', 'Tariel', 'Adèle Tariel est née dans un coin de campagne et vit désormais en région parisienne où elle garde une nostalgie de la nature. Aujourd’hui journaliste depuis 14 ans en presse jeunesse chez Playbac presse (éditeur du Petit Quotidien et Mon Quotidien), elle a commencé à écrire des histoires après la naissance de sa fille en 2009. Elle a scénarisé de nombreux livres aux éditions Père Fouettard.\n', 'auteur', 'assets/photos/Adèle Tariel.webp', 'J'),
(325, NULL, 'Anne', 'Théréné', NULL, 'auteur', NULL, NULL),
(326, NULL, 'Camille', 'Tisserand', NULL, 'auteur', NULL, 'J'),
(327, NULL, 'Aude', 'Ziegelmeyer', NULL, 'auteur', NULL, 'J'),
(328, NULL, 'Johann', 'Landwerlin', NULL, 'animateur', NULL, NULL),
(329, NULL, 'Antoine', 'Jarry', NULL, 'animateur', NULL, NULL),
(330, NULL, 'Michel', 'Hutt', NULL, 'animateur', NULL, NULL),
(331, NULL, 'Cécile', 'Rivière', NULL, 'animateur', NULL, NULL),
(332, NULL, 'Alexis', 'Weigel', NULL, 'animateur', NULL, NULL),
(333, NULL, 'Pascale', 'Leroy', NULL, 'animateur', NULL, NULL),
(334, NULL, 'Jean-Gauthier', 'Martin', NULL, 'animateur', NULL, NULL),
(335, NULL, 'Jacques', 'Lindecker', NULL, 'animateur', NULL, NULL),
(337, NULL, 'Eva', 'alias', NULL, 'animateur', NULL, NULL),
(502, NULL, 'Modérateur', '', NULL, 'animateur', '../../photos/reduit/NIKOL.JPG', NULL),
(503, NULL, 'Eva', '@posetoievalire', NULL, 'animateur', NULL, NULL),
(504, NULL, 'Christian', 'Ciffre', NULL, 'animateur', NULL, NULL),
(505, NULL, 'FMarie-Claire', 'Vitoux', NULL, 'animateur', NULL, NULL);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `PersonneExposantExposer`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `PersonneExposantExposer` (
`idPersonne` int(11)
,`prenom` varchar(50)
,`nom` varchar(50)
,`specialite` varchar(20)
,`idExposant` int(11)
,`nomExposant` varchar(50)
,`samedi_am` tinyint(1)
,`samedi_pm` tinyint(1)
,`dimanche_am` tinyint(1)
,`dimanche_pm` tinyint(1)
);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `PersonneExposantExposerLieu`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `PersonneExposantExposerLieu` (
`idPersonne` int(11)
,`prenom` varchar(50)
,`nom` varchar(50)
,`specialite` varchar(20)
,`idExposant` int(11)
,`nomExposant` varchar(50)
,`samedi_am` tinyint(1)
,`samedi_pm` tinyint(1)
,`dimanche_am` tinyint(1)
,`dimanche_pm` tinyint(1)
,`numLieu` int(11)
,`nomLieu` varchar(50)
,`hall` int(11)
);

-- --------------------------------------------------------

--
-- Structure de la table `presenter`
--

CREATE TABLE `presenter` (
  `idevenement` int(11) NOT NULL,
  `idlivre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `presenter`
--

INSERT INTO `presenter` (`idevenement`, `idlivre`) VALUES
(2, 1),
(3, 2),
(3, 3),
(4, 4),
(4, 5),
(5, 6),
(6, 7),
(6, 8),
(7, 9),
(9, 10),
(9, 11),
(12, 12),
(12, 13),
(12, 14),
(13, 15),
(14, 16),
(14, 17),
(15, 18),
(15, 19),
(16, 20),
(16, 21),
(16, 22),
(17, 23),
(18, 24),
(18, 25),
(19, 26),
(19, 27),
(19, 28),
(19, 29),
(20, 30),
(21, 31),
(22, 32),
(22, 33),
(22, 34),
(29, 35),
(29, 36),
(31, 37),
(31, 38),
(31, 39),
(33, 40),
(35, 41),
(36, 42),
(37, 43),
(38, 44),
(38, 45),
(38, 46),
(39, 47),
(39, 48),
(42, 49),
(43, 50),
(44, 51),
(45, 52);

-- --------------------------------------------------------

--
-- Structure de la table `specialite`
--

CREATE TABLE `specialite` (
  `specialite` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `specialite`
--

INSERT INTO `specialite` (`specialite`) VALUES
('animateur'),
('auteur'),
('critique'),
('politique');

-- --------------------------------------------------------

--
-- Structure de la table `typeevenement`
--

CREATE TABLE `typeevenement` (
  `type` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `typeevenement`
--

INSERT INTO `typeevenement` (`type`) VALUES
('ANIMATION'),
('ATELIER DE RELIURE'),
('BiBlio\'Pause'),
('CONCERT DE CLÔTURE'),
('EXPOSITION'),
('GRAND ENTRETIEN'),
('HISTOIRE'),
('JEU'),
('LA DICTEE DU FESTIVAL'),
('LE CURIEUX CABINET '),
('Le Off du Festival'),
('Le PANIER CULTURE'),
('Le PANIER CULTURE tient salon'),
('PANIER CULTURE'),
('READING PARTY'),
('REMISE DE PRIX DE LA SEALB'),
('RENDEZ-VOUS'),
('RENDEZ-VOUS INAUGURAL'),
('Table ronde');

-- --------------------------------------------------------

--
-- Structure de la table `typelieu`
--

CREATE TABLE `typelieu` (
  `type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `typelieu`
--

INSERT INTO `typelieu` (`type`) VALUES
('restaurant'),
('stand'),
('théatre'),
('toilettes');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `ecrire`
--
ALTER TABLE `ecrire`
  ADD PRIMARY KEY (`idPersonne`,`idLivre`),
  ADD KEY `fk_ecrire_livre` (`idLivre`);

--
-- Index pour la table `editeur`
--
ALTER TABLE `editeur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `evenement`
--
ALTER TABLE `evenement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_evenement_typeevenment` (`typeevenement`),
  ADD KEY `fk_evenement_lieu` (`numLieu`),
  ADD KEY `fk_evenement_personne` (`idAnimateur`);

--
-- Index pour la table `exposant`
--
ALTER TABLE `exposant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_exposant_lieu` (`numLieu`);

--
-- Index pour la table `exposer`
--
ALTER TABLE `exposer`
  ADD PRIMARY KEY (`idExposant`,`idPersonne`),
  ADD KEY `fk_exposer_personne` (`idPersonne`);

--
-- Index pour la table `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`genre`);

--
-- Index pour la table `lieu`
--
ALTER TABLE `lieu`
  ADD PRIMARY KEY (`num`),
  ADD KEY `fk_lieu_typelieu` (`type`);

--
-- Index pour la table `livre`
--
ALTER TABLE `livre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_livre_editeur` (`idEditeur`),
  ADD KEY `fk_livre_genre` (`genre`);

--
-- Index pour la table `personne`
--
ALTER TABLE `personne`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `prenom` (`prenom`,`nom`),
  ADD KEY `fk_personne_specialite` (`specialite`);

--
-- Index pour la table `presenter`
--
ALTER TABLE `presenter`
  ADD PRIMARY KEY (`idevenement`,`idlivre`),
  ADD KEY `fk_presenter_livre` (`idlivre`);

--
-- Index pour la table `specialite`
--
ALTER TABLE `specialite`
  ADD PRIMARY KEY (`specialite`);

--
-- Index pour la table `typeevenement`
--
ALTER TABLE `typeevenement`
  ADD PRIMARY KEY (`type`);

--
-- Index pour la table `typelieu`
--
ALTER TABLE `typelieu`
  ADD PRIMARY KEY (`type`);

-- --------------------------------------------------------

--
-- Structure de la vue `LivreEditeurPersonneExposant`
--
DROP TABLE IF EXISTS `LivreEditeurPersonneExposant`;

CREATE ALGORITHM=UNDEFINED DEFINER=`phpmyadmin`@`localhost` SQL SECURITY DEFINER VIEW `LivreEditeurPersonneExposant`  AS SELECT `l`.`id` AS `id`, `l`.`titre` AS `titre`, `l`.`resume` AS `resume`, `l`.`genre` AS `genre`, `e`.`id` AS `idEditeur`, `e`.`nom` AS `editeur`, `p`.`id` AS `idPersonne`, `p`.`nom` AS `nom`, `p`.`prenom` AS `prenom`, `p`.`civilite` AS `civilite`, `ex`.`id` AS `idExposant`, `ex`.`nom` AS `nomExposant`, `ev`.`id` AS `idEvenement`, `ev`.`titre` AS `titreEvenement`, `ev`.`debut` AS `debut`, `ev`.`type` AS `typeEvenement` FROM (((((((`livre` `l` left join `editeur` `e` on(`l`.`idEditeur` = `e`.`id`)) left join `ecrire` `ec` on(`l`.`id` = `ec`.`idLivre`)) left join `personne` `p` on(`ec`.`idPersonne` = `p`.`id`)) left join `exposer` `exp` on(`p`.`id` = `exp`.`idPersonne`)) left join `exposant` `ex` on(`exp`.`idExposant` = `ex`.`id`)) left join `presenter` `pr` on(`l`.`id` = `pr`.`idlivre`)) left join `evenement` `ev` on(`pr`.`idevenement` = `ev`.`id`)) ;

-- --------------------------------------------------------

--
-- Structure de la vue `PersonneExposantExposer`
--
DROP TABLE IF EXISTS `PersonneExposantExposer`;

CREATE ALGORITHM=UNDEFINED DEFINER=`phpmyadmin`@`localhost` SQL SECURITY DEFINER VIEW `PersonneExposantExposer`  AS SELECT `ser`.`idPersonne` AS `idPersonne`, `au`.`prenom` AS `prenom`, `au`.`nom` AS `nom`, `au`.`specialite` AS `specialite`, `ser`.`idExposant` AS `idExposant`, `ex`.`nom` AS `nomExposant`, `ser`.`samedi_am` AS `samedi_am`, `ser`.`samedi_pm` AS `samedi_pm`, `ser`.`dimanche_am` AS `dimanche_am`, `ser`.`dimanche_pm` AS `dimanche_pm` FROM ((`exposer` `ser` join `personne` `au` on(`ser`.`idPersonne` = `au`.`id`)) join `exposant` `ex` on(`ser`.`idExposant` = `ex`.`id`)) ;

-- --------------------------------------------------------

--
-- Structure de la vue `PersonneExposantExposerLieu`
--
DROP TABLE IF EXISTS `PersonneExposantExposerLieu`;

CREATE ALGORITHM=UNDEFINED DEFINER=`phpmyadmin`@`localhost` SQL SECURITY DEFINER VIEW `PersonneExposantExposerLieu`  AS SELECT `ser`.`idPersonne` AS `idPersonne`, `p`.`prenom` AS `prenom`, `p`.`nom` AS `nom`, `p`.`specialite` AS `specialite`, `ser`.`idExposant` AS `idExposant`, `ex`.`nom` AS `nomExposant`, `ser`.`samedi_am` AS `samedi_am`, `ser`.`samedi_pm` AS `samedi_pm`, `ser`.`dimanche_am` AS `dimanche_am`, `ser`.`dimanche_pm` AS `dimanche_pm`, `ex`.`numLieu` AS `numLieu`, `l`.`nom` AS `nomLieu`, `l`.`hall` AS `hall` FROM (((`exposer` `ser` join `personne` `p` on(`ser`.`idPersonne` = `p`.`id`)) join `exposant` `ex` on(`ser`.`idExposant` = `ex`.`id`)) join `lieu` `l` on(`ex`.`numLieu` = `l`.`num`)) ;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `ecrire`
--
ALTER TABLE `ecrire`
  ADD CONSTRAINT `fk_ecrire_livre` FOREIGN KEY (`idLivre`) REFERENCES `livre` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ecrire_personne` FOREIGN KEY (`idPersonne`) REFERENCES `personne` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `evenement`
--
ALTER TABLE `evenement`
  ADD CONSTRAINT `fk_evenement_lieu` FOREIGN KEY (`numLieu`) REFERENCES `lieu` (`num`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_evenement_personne` FOREIGN KEY (`idAnimateur`) REFERENCES `personne` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_evenement_typeevenment` FOREIGN KEY (`typeevenement`) REFERENCES `typeevenement` (`type`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `exposant`
--
ALTER TABLE `exposant`
  ADD CONSTRAINT `fk_exposant_lieu` FOREIGN KEY (`numLieu`) REFERENCES `lieu` (`num`);

--
-- Contraintes pour la table `exposer`
--
ALTER TABLE `exposer`
  ADD CONSTRAINT `fk_exposer_exposant` FOREIGN KEY (`idExposant`) REFERENCES `exposant` (`id`),
  ADD CONSTRAINT `fk_exposer_personne` FOREIGN KEY (`idPersonne`) REFERENCES `personne` (`id`);

--
-- Contraintes pour la table `lieu`
--
ALTER TABLE `lieu`
  ADD CONSTRAINT `fk_lieu_typelieu` FOREIGN KEY (`type`) REFERENCES `typelieu` (`type`);

--
-- Contraintes pour la table `livre`
--
ALTER TABLE `livre`
  ADD CONSTRAINT `fk_livre_editeur` FOREIGN KEY (`idEditeur`) REFERENCES `editeur` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_livre_genre` FOREIGN KEY (`genre`) REFERENCES `genre` (`genre`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `personne`
--
ALTER TABLE `personne`
  ADD CONSTRAINT `fk_personne_specialite` FOREIGN KEY (`specialite`) REFERENCES `specialite` (`specialite`);

--
-- Contraintes pour la table `presenter`
--
ALTER TABLE `presenter`
  ADD CONSTRAINT `fk_presenter_evenement` FOREIGN KEY (`idevenement`) REFERENCES `evenement` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_presenter_livre` FOREIGN KEY (`idlivre`) REFERENCES `livre` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
