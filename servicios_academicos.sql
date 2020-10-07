-- MariaDB dump 10.17  Distrib 10.5.5-MariaDB, for osx10.15 (x86_64)
--
-- Host: localhost    Database: TramitesServiciosAcademicos
-- ------------------------------------------------------
-- Server version	10.5.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `DiasInhabiles`
--

DROP TABLE IF EXISTS `DiasInhabiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DiasInhabiles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dia` int(10) NOT NULL,
  `activo` smallint(4) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FechasInhabiles`
--

DROP TABLE IF EXISTS `FechasInhabiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FechasInhabiles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `activo` smallint(4) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Reservaciones`
--

DROP TABLE IF EXISTS `Reservaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Reservaciones` (
  `usuario_id` int(10) unsigned NOT NULL,
  `tramite_id` int(10) unsigned NOT NULL,
  `ventanilla_id` int(10) unsigned NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  KEY `Reservaciones_FK` (`usuario_id`),
  KEY `Reservaciones_FK_1` (`tramite_id`),
  KEY `Reservaciones_FK_2` (`ventanilla_id`),
  CONSTRAINT `Reservaciones_FK` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Reservaciones_FK_1` FOREIGN KEY (`tramite_id`) REFERENCES `Tramites` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Reservaciones_FK_2` FOREIGN KEY (`ventanilla_id`) REFERENCES `Ventanillas` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rol` varchar(50) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Permisos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `modulo` varchar(50) NOT NULL,
  `submodulo` varchar(50) NOT NULL,
  `permiso` varchar(50) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `RolesPermisos`
--

DROP TABLE IF EXISTS `RolesPermisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RolesPermisos` (
  `permiso_id` int(10) unsigned NOT NULL,
  `rol_id` int(10) unsigned NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  KEY `RolesPermisos_FK` (`permiso_id`),
  KEY `RolesPermisos_FK_1` (`rol_id`),
  CONSTRAINT `RolesPermisos_FK` FOREIGN KEY (`permiso_id`) REFERENCES `Permisos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `RolesPermisos_FK_1` FOREIGN KEY (`rol_id`) REFERENCES `Roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `RolesTramites`
--

DROP TABLE IF EXISTS `RolesTramites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RolesTramites` (
  `rol_id` int(10) unsigned NOT NULL,
  `tramite_id` int(10) unsigned NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  KEY `RolesTramites_FK` (`tramite_id`),
  KEY `RolesTramites_FK_1` (`rol_id`),
  CONSTRAINT `RolesTramites_FK` FOREIGN KEY (`tramite_id`) REFERENCES `Tramites` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `RolesTramites_FK_1` FOREIGN KEY (`rol_id`) REFERENCES `Roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `RolesUsuarios`
--

DROP TABLE IF EXISTS `RolesUsuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RolesUsuarios` (
  `rol_id` int(10) unsigned NOT NULL,
  `usuario_id` int(10) unsigned NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  KEY `RolesUsuarios_FK` (`usuario_id`),
  KEY `RolesUsuarios_FK_1` (`rol_id`),
  CONSTRAINT `RolesUsuarios_FK` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `RolesUsuarios_FK_1` FOREIGN KEY (`rol_id`) REFERENCES `Roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Tramites`
--

DROP TABLE IF EXISTS `Tramites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tramites` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `duracion` int(10) NOT NULL COMMENT 'Duracion en minutos del tramite',
  `activo` smallint(4) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Usuarios`
--

DROP TABLE IF EXISTS `Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Usuarios` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255),
  `matricula` varchar(15),
  `correo` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `sal` varchar(255) NOT NULL,
  `reset_token` varchar(32),
  `tipo_usuario_id` int(10) unsigned NOT NULL,
  `instituto_id` int(10) unsigned NOT NULL,
  `programa_id` int(10) unsigned NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  KEY `Usuarios_FK` (`tipo_usuario_id`),
  KEY `Usuarios_FK1` (`instituto_id`),
  KEY `Usuarios_FK2` (`programa_id`),
  CONSTRAINT `Usuarios_UK` UNIQUE (correo),
  CONSTRAINT `Usuarios_FK` FOREIGN KEY (`tipo_usuario_id`) REFERENCES `TipoUsuarios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Usuarios_FK1` FOREIGN KEY (`instituto_id`) REFERENCES `Institutos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Usuarios_FK2` FOREIGN KEY (`programa_id`) REFERENCES `Programas` (`id`) ON UPDATE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `TipoUsuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TipoUsuarios` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `Institutos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Institutos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `instituto` varchar(50) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `Programas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Programas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `programa` varchar(50) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `Ventanillas`
--

DROP TABLE IF EXISTS `Ventanillas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Ventanillas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `horas_atencion` int(10) NOT NULL,
  `activo` smallint(4) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-21 23:12:22
