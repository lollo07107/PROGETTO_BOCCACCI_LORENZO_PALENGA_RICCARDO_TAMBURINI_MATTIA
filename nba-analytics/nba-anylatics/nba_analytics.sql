-- phpMyAdmin SQL Dump
-- version 4.1.4
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2026 alle 10:28
-- Versione del server: 5.6.15-log
-- PHP Version: 5.5.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `nba_analytics`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `giocatore`
--

CREATE TABLE IF NOT EXISTS `giocatore` (
  `ID_giocatore` int(4) NOT NULL,
  `Nome` varchar(100) NOT NULL,
  `Cognome` varchar(100) NOT NULL,
  `Posizione` varchar(20) NOT NULL,
  `Num_Maglia` int(2) NOT NULL,
  `FK_ID_squadra` int(4) NOT NULL,
  PRIMARY KEY (`ID_giocatore`),
  KEY `FK_ID_squadra` (`FK_ID_squadra`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `partita`
--

CREATE TABLE IF NOT EXISTS `partita` (
  `ID_partita` int(4) NOT NULL,
  `ID_casa` int(4) NOT NULL,
  `ID_ospite` int(4) NOT NULL,
  `Data` date NOT NULL,
  `pt_casa` int(3) NOT NULL,
  `pt_ospite` int(3) NOT NULL,
  `status` varchar(100) NOT NULL,
  PRIMARY KEY (`ID_partita`),
  KEY `ID_casa` (`ID_casa`,`ID_ospite`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `squadra`
--

CREATE TABLE IF NOT EXISTS `squadra` (
  `ID_squadra` int(4) NOT NULL,
  `Nome` varchar(100) NOT NULL,
  `Conference` varchar(50) NOT NULL,
  `Abbreviazione` varchar(3) NOT NULL,
  `Città` varchar(100) NOT NULL,
  `Vittorie` int(11) NOT NULL DEFAULT '0',
  `Sconfitte` int(11) NOT NULL DEFAULT '0',
  `Vittorie_pct` decimal(5,3) NOT NULL,
  PRIMARY KEY (`ID_squadra`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `stagione_stat`
--

CREATE TABLE IF NOT EXISTS `stagione_stat` (
  `ID_stat` int(4) NOT NULL,
  `Stagione` int(4) NOT NULL,
  `ppg` decimal(4,1) NOT NULL,
  `rpg` decimal(4,1) NOT NULL,
  `apg` decimal(4,1) NOT NULL,
  `gf_pct` decimal(5,2) NOT NULL,
  `FK_ID_giocatore` int(4) NOT NULL,
  PRIMARY KEY (`ID_stat`),
  KEY `FK_ID_giocatore` (`FK_ID_giocatore`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `utenti`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
