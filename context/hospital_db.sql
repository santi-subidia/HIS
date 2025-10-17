-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2025 at 02:06 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hospital_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `alas`
--

CREATE TABLE `alas` (
  `id` int(11) NOT NULL,
  `id_sector` int(11) NOT NULL,
  `ubicacion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alas`
--

INSERT INTO `alas` (`id`, `id_sector`, `ubicacion`) VALUES
(1, 1, 'Ala Norte'),
(2, 1, 'Ala Sur'),
(3, 1, 'Ala Este'),
(4, 1, 'Ala Oeste'),
(5, 1, 'Ala Central'),
(6, 2, 'Ala Norte'),
(7, 2, 'Ala Sur'),
(8, 2, 'Ala Este'),
(9, 2, 'Ala Oeste'),
(10, 2, 'Ala Central');

-- --------------------------------------------------------

--
-- Table structure for table `antecedentes`
--

CREATE TABLE `antecedentes` (
  `id` int(11) NOT NULL,
  `id_historial` int(11) NOT NULL,
  `id_tipo` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `camas`
--

CREATE TABLE `camas` (
  `id` int(11) NOT NULL,
  `id_habitacion` int(11) NOT NULL,
  `numero_cama` int(11) NOT NULL,
  `estado` enum('ocupada','disponible','mantenimiento') NOT NULL DEFAULT 'disponible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `camas`
--

INSERT INTO `camas` (`id`, `id_habitacion`, `numero_cama`, `estado`) VALUES
(1, 1, 1, 'disponible'),
(2, 2, 1, 'disponible'),
(3, 2, 2, 'disponible'),
(4, 3, 1, 'disponible'),
(5, 4, 1, 'disponible'),
(6, 4, 2, 'disponible'),
(7, 5, 1, 'disponible'),
(8, 6, 1, 'ocupada'),
(9, 6, 2, 'disponible'),
(10, 7, 1, 'disponible'),
(11, 8, 1, 'disponible'),
(12, 8, 2, 'disponible'),
(13, 9, 1, 'disponible'),
(14, 10, 1, 'disponible'),
(15, 10, 2, 'disponible'),
(16, 11, 1, 'disponible'),
(17, 12, 1, 'disponible'),
(18, 12, 2, 'disponible'),
(19, 13, 1, 'disponible'),
(20, 14, 1, 'disponible'),
(21, 14, 2, 'disponible'),
(22, 15, 1, 'disponible'),
(23, 16, 1, 'disponible'),
(24, 16, 2, 'disponible'),
(25, 17, 1, 'disponible'),
(26, 18, 1, 'disponible'),
(27, 18, 2, 'disponible'),
(28, 19, 1, 'disponible'),
(29, 20, 1, 'disponible'),
(30, 20, 2, 'disponible'),
(31, 21, 1, 'disponible'),
(32, 22, 1, 'disponible'),
(33, 22, 2, 'disponible'),
(34, 23, 1, 'disponible'),
(35, 24, 1, 'disponible'),
(36, 24, 2, 'disponible'),
(37, 25, 1, 'disponible'),
(38, 26, 1, 'disponible'),
(39, 26, 2, 'disponible'),
(40, 27, 1, 'disponible'),
(41, 28, 1, 'disponible'),
(42, 28, 2, 'disponible'),
(43, 29, 1, 'disponible'),
(44, 30, 1, 'disponible'),
(45, 30, 2, 'disponible'),
(46, 31, 1, 'disponible'),
(47, 32, 1, 'disponible'),
(48, 32, 2, 'disponible'),
(49, 33, 1, 'disponible'),
(50, 34, 1, 'disponible'),
(51, 34, 2, 'disponible'),
(52, 35, 1, 'disponible'),
(53, 36, 1, 'disponible'),
(54, 36, 2, 'disponible'),
(55, 37, 1, 'disponible'),
(56, 38, 1, 'disponible'),
(57, 38, 2, 'disponible'),
(58, 39, 1, 'disponible'),
(59, 40, 1, 'disponible'),
(60, 40, 2, 'disponible');

-- --------------------------------------------------------

--
-- Table structure for table `contactosemergencias`
--

CREATE TABLE `contactosemergencias` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `id_parentesco` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contactosemergencias`
--

INSERT INTO `contactosemergencias` (`id`, `id_persona`, `id_parentesco`) VALUES
(1, 1, 1),
(2, 13, 3),
(3, 14, 7),
(4, 15, 3),
(5, 16, 3),
(6, 17, 7);

-- --------------------------------------------------------

--
-- Table structure for table `enfermeros`
--

CREATE TABLE `enfermeros` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `fecha_eliminacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `especialidades`
--

CREATE TABLE `especialidades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id` int(11) NOT NULL,
  `codigo` varchar(255) NOT NULL,
  `id_ala` int(11) NOT NULL,
  `capacidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `habitaciones`
--

INSERT INTO `habitaciones` (`id`, `codigo`, `id_ala`, `capacidad`) VALUES
(1, 'HAB-1', 1, 1),
(2, 'HAB-2', 1, 2),
(3, 'HAB-3', 1, 1),
(4, 'HAB-4', 1, 2),
(5, 'HAB-5', 2, 1),
(6, 'HAB-6', 2, 2),
(7, 'HAB-7', 2, 1),
(8, 'HAB-8', 2, 2),
(9, 'HAB-9', 3, 1),
(10, 'HAB-10', 3, 2),
(11, 'HAB-11', 3, 1),
(12, 'HAB-12', 3, 2),
(13, 'HAB-13', 4, 1),
(14, 'HAB-14', 4, 2),
(15, 'HAB-15', 4, 1),
(16, 'HAB-16', 4, 2),
(17, 'HAB-17', 5, 1),
(18, 'HAB-18', 5, 2),
(19, 'HAB-19', 5, 1),
(20, 'HAB-20', 5, 2),
(21, 'HAB-21', 6, 1),
(22, 'HAB-22', 6, 2),
(23, 'HAB-23', 6, 1),
(24, 'HAB-24', 6, 2),
(25, 'HAB-25', 7, 1),
(26, 'HAB-26', 7, 2),
(27, 'HAB-27', 7, 1),
(28, 'HAB-28', 7, 2),
(29, 'HAB-29', 8, 1),
(30, 'HAB-30', 8, 2),
(31, 'HAB-31', 8, 1),
(32, 'HAB-32', 8, 2),
(33, 'HAB-33', 9, 1),
(34, 'HAB-34', 9, 2),
(35, 'HAB-35', 9, 1),
(36, 'HAB-36', 9, 2),
(37, 'HAB-37', 10, 1),
(38, 'HAB-38', 10, 2),
(39, 'HAB-39', 10, 1),
(40, 'HAB-40', 10, 2);

-- --------------------------------------------------------

--
-- Table structure for table `historial_medico`
--

CREATE TABLE `historial_medico` (
  `id` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_reseta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `internaciones`
--

CREATE TABLE `internaciones` (
  `id` int(11) NOT NULL,
  `id_paciente_seguro` int(11) DEFAULT NULL,
  `id_cama` int(11) NOT NULL,
  `id_motivo` int(11) NOT NULL,
  `detalle_motivo` text NOT NULL,
  `id_contactoEmergencia` int(11) NOT NULL,
  `fecha_internacion` datetime NOT NULL,
  `estado` enum('activa','alta','traslado') NOT NULL,
  `prioridad` enum('baja','media','alta') DEFAULT NULL,
  `sintomas_principales` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `internaciones`
--

INSERT INTO `internaciones` (`id`, `id_paciente_seguro`, `id_cama`, `id_motivo`, `detalle_motivo`, `id_contactoEmergencia`, `fecha_internacion`, `estado`, `prioridad`, `sintomas_principales`) VALUES
(1, 7, 8, 1, 'Nada', 6, '2025-10-16 23:42:34', 'activa', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `localidades`
--

CREATE TABLE `localidades` (
  `id` int(11) NOT NULL,
  `id_provincia` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `localidades`
--

INSERT INTO `localidades` (`id`, `id_provincia`, `nombre`) VALUES
(1, 1, 'San Luis'),
(2, 1, 'Villa Mercedes'),
(3, 1, 'La Punta'),
(4, 1, 'Justo Daract'),
(5, 1, 'Concarán'),
(6, 1, 'Quines'),
(7, 1, 'Santa Rosa del Conlara'),
(8, 1, 'Tilisarao'),
(9, 1, 'Naschel'),
(10, 1, 'Buena Esperanza'),
(11, 1, 'Candelaria'),
(12, 1, 'Luján'),
(13, 1, 'La Toma'),
(14, 1, 'Anchorena'),
(15, 1, 'Arizona'),
(16, 1, 'Balde'),
(17, 1, 'Carolina'),
(18, 1, 'El Trapiche'),
(19, 1, 'Fraga'),
(20, 1, 'La Calera');

-- --------------------------------------------------------

--
-- Table structure for table `medicamentos`
--

CREATE TABLE `medicamentos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicos`
--

CREATE TABLE `medicos` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `id_especialidad` int(11) NOT NULL,
  `fecha_eliminacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `motivos`
--

CREATE TABLE `motivos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `motivos`
--

INSERT INTO `motivos` (`id`, `nombre`) VALUES
(1, 'Clínicos'),
(8, 'Cuidados Paliativos'),
(4, 'Emergencias y Urgencias'),
(5, 'Obstétricos y Ginecológicos'),
(6, 'Pediátricos/Neonatales'),
(7, 'Psiquiátricos'),
(2, 'Quirúrgicos'),
(3, 'Traumatológicos y Ortopedia');

-- --------------------------------------------------------

--
-- Table structure for table `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `sexo` enum('Masculino','Femenino') NOT NULL,
  `domicilio` varchar(255) DEFAULT NULL,
  `id_localidad` int(11) NOT NULL,
  `id_tipoSangre` int(11) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `fecha_eliminacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pacientes`
--

INSERT INTO `pacientes` (`id`, `id_persona`, `sexo`, `domicilio`, `id_localidad`, `id_tipoSangre`, `fecha_nacimiento`, `fecha_eliminacion`) VALUES
(1, 1, 'Masculino', '', 1, 1, '1899-12-31', NULL),
(2, 2, 'Femenino', '', 1, 1, '1899-12-31', NULL),
(3, 3, 'Masculino', 'Calle Falsa 123', 1, 1, '1990-05-10', NULL),
(4, 4, 'Femenino', 'Av. Siempre Viva 742', 2, 2, '1985-08-22', NULL),
(5, 5, 'Masculino', 'San Martín 456', 3, 3, '1978-12-15', NULL),
(6, 6, 'Femenino', 'Belgrano 789', 1, 4, '1995-03-30', NULL),
(7, 7, 'Masculino', 'Mitre 321', 2, 2, '1982-07-19', NULL),
(8, 8, 'Femenino', 'Rivadavia 654', 3, 1, '2000-11-05', NULL),
(9, 9, 'Masculino', 'Las Heras 987', 1, 4, '1975-02-28', NULL),
(10, 10, 'Femenino', 'Sarmiento 159', 2, 3, '1992-09-13', NULL),
(11, 11, 'Masculino', 'Urquiza 753', 3, 2, '1988-04-22', NULL),
(12, 12, 'Masculino', 'Av. Siempre Viva 742', 11, 1, '2002-05-10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `paciente_seguro`
--

CREATE TABLE `paciente_seguro` (
  `id` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_seguro` int(11) NOT NULL,
  `codigo_afiliado` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paciente_seguro`
--

INSERT INTO `paciente_seguro` (`id`, `id_paciente`, `id_seguro`, `codigo_afiliado`) VALUES
(1, 1, 1, '00000001'),
(2, 2, 1, '00000002'),
(3, 5, 2, '15647894'),
(4, 9, 1, '1365498789'),
(5, 5, 1, '48794561'),
(6, 5, 1, '45798164'),
(7, 5, 1, '451672');

-- --------------------------------------------------------

--
-- Table structure for table `parentescos`
--

CREATE TABLE `parentescos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parentescos`
--

INSERT INTO `parentescos` (`id`, `nombre`) VALUES
(7, 'Abuelo o Abuela'),
(4, 'Amigo o Amiga'),
(3, 'Hermano o Hermana'),
(2, 'Madre'),
(9, 'Otro'),
(1, 'Padre'),
(5, 'Pareja'),
(8, 'Primo o Prima'),
(6, 'Tio o Tia');

-- --------------------------------------------------------

--
-- Table structure for table `personas`
--

CREATE TABLE `personas` (
  `id` int(11) NOT NULL,
  `DNI` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `id_persona` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personas`
--

INSERT INTO `personas` (`id`, `DNI`, `nombre`, `apellido`, `telefono`, `id_persona`) VALUES
(1, '00000001', 'Desconocido', 'Desconocido', '0000000000', NULL),
(2, '00000002', 'Desconocida', 'Desconocida', '0000000000', NULL),
(3, '12345678', 'Rodrigo', 'González', '2664000001', NULL),
(4, '23456789', 'María', 'Pérez', '2664000002', NULL),
(5, '34567890', 'Carlos', 'Rodríguez', '2664000003', NULL),
(6, '45678901', 'Lucía', 'Fernández', '2664000004', NULL),
(7, '56789012', 'Martín', 'Sosa', '2664000005', NULL),
(8, '67890123', 'Ana', 'López', '2664000006', NULL),
(9, '78901234', 'Javier', 'Ramírez', '2664000007', NULL),
(10, '89012345', 'Valeria', 'Torres', '2664000008', NULL),
(11, '90123456', 'Federico', 'Molina', '2664000009', NULL),
(12, '417844315', 'Lucio', 'Quiroga', '2664791534', NULL),
(13, '421654894', 'Martín', 'Lucero', '2665798415', NULL),
(14, '414561864', 'Martín', 'Lucero', '2664789412', NULL),
(15, '41754164', 'Martin', 'Lucero', '2664567418', NULL),
(16, '41536874', 'Juan', 'Carlos', '2664794815', NULL),
(17, '42567894', 'Juan', 'Carlos', '2665197643', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `planes_cuidado`
--

CREATE TABLE `planes_cuidado` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `id_internacion` int(11) NOT NULL,
  `id_reseta` int(11) DEFAULT NULL,
  `id_tipo` int(11) NOT NULL,
  `devolucion` varchar(255) NOT NULL,
  `fecha` datetime NOT NULL,
  `id_plan_cuidado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `provincias`
--

CREATE TABLE `provincias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provincias`
--

INSERT INTO `provincias` (`id`, `nombre`) VALUES
(2, 'Buenos Aires'),
(3, 'Catamarca'),
(4, 'Chaco'),
(5, 'Chubut'),
(24, 'Ciudad Autónoma de Buenos Aires'),
(6, 'Córdoba'),
(7, 'Corrientes'),
(8, 'Entre Ríos'),
(9, 'Formosa'),
(10, 'Jujuy'),
(11, 'La Pampa'),
(12, 'La Rioja'),
(13, 'Mendoza'),
(14, 'Misiones'),
(15, 'Neuquén'),
(16, 'Río Negro'),
(17, 'Salta'),
(18, 'San Juan'),
(1, 'San Luis'),
(19, 'Santa Cruz'),
(20, 'Santa Fe'),
(21, 'Santiago del Estero'),
(22, 'Tierra del Fuego'),
(23, 'Tucumán');

-- --------------------------------------------------------

--
-- Table structure for table `registros_sv`
--

CREATE TABLE `registros_sv` (
  `id` int(11) NOT NULL,
  `id_internacion` int(11) NOT NULL,
  `id_enfermero` int(11) NOT NULL,
  `presion_arterial_sistolica` float DEFAULT NULL,
  `presion_arterial_diastolica` float DEFAULT NULL,
  `frecuencia_cardiaca` float DEFAULT NULL,
  `frecuencia_respiratoria` float DEFAULT NULL,
  `temperatura` float DEFAULT NULL,
  `color_piel` varchar(255) DEFAULT NULL,
  `respuesta_estimulos` varchar(255) DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renglones_reseta`
--

CREATE TABLE `renglones_reseta` (
  `id_reseta` int(11) NOT NULL,
  `id_medicamento` int(11) NOT NULL,
  `dosis` varchar(255) NOT NULL,
  `duracion` varchar(255) NOT NULL,
  `indicaciones` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `resetas`
--

CREATE TABLE `resetas` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `id_historial` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sector`
--

CREATE TABLE `sector` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sector`
--

INSERT INTO `sector` (`id`, `nombre`) VALUES
(1, 'Clínica Médica'),
(2, 'Quirúrgico');

-- --------------------------------------------------------

--
-- Table structure for table `seguros`
--

CREATE TABLE `seguros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `abreviatura` varchar(255) NOT NULL,
  `telefono_contacto` varchar(255) NOT NULL,
  `fecha_eliminacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seguros`
--

INSERT INTO `seguros` (`id`, `nombre`, `abreviatura`, `telefono_contacto`, `fecha_eliminacion`) VALUES
(1, 'PAMI', 'PAMI', '08002227264', NULL),
(2, 'OSDE', 'OSDE', '08108881033', NULL),
(3, 'Swiss Medical', 'SWISS', '08103339977', NULL),
(4, 'Medife', 'MEDIFE', '08103336343', NULL),
(5, 'OSECAC', 'OSECAC', '08109991000', NULL),
(6, 'Federada Salud', 'FEDERADA', '08107773337', NULL),
(7, 'Galeno', 'GALENO', '08107772525', NULL),
(8, 'Particular', 'PART', '0000000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tipos`
--

CREATE TABLE `tipos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tipos_sangre`
--

CREATE TABLE `tipos_sangre` (
  `id` int(11) NOT NULL,
  `tipo` enum('A','B','AB','O') NOT NULL,
  `Rh` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipos_sangre`
--

INSERT INTO `tipos_sangre` (`id`, `tipo`, `Rh`) VALUES
(1, 'A', 1),
(2, 'A', 0),
(3, 'B', 1),
(4, 'B', 0),
(5, 'AB', 1),
(6, 'AB', 0),
(7, 'O', 1),
(8, 'O', 0);

-- --------------------------------------------------------

--
-- Table structure for table `turnos`
--

CREATE TABLE `turnos` (
  `id` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_motivo` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `estado` enum('pendiente','confirmado','cancelado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `turnos`
--

INSERT INTO `turnos` (`id`, `id_paciente`, `id_motivo`, `fecha`, `estado`) VALUES
(1, 7, 1, '2025-06-12 12:00:00', 'cancelado'),
(2, 8, 2, '2025-06-15 13:00:00', 'cancelado'),
(3, 9, 2, '2025-06-20 14:00:00', 'cancelado'),
(4, 5, 4, '2025-10-31 01:00:00', 'pendiente');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `id_persona` int(11) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alas`
--
ALTER TABLE `alas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_sector` (`id_sector`);

--
-- Indexes for table `antecedentes`
--
ALTER TABLE `antecedentes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_historial` (`id_historial`),
  ADD KEY `id_tipo` (`id_tipo`);

--
-- Indexes for table `camas`
--
ALTER TABLE `camas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_habitacion` (`id_habitacion`);

--
-- Indexes for table `contactosemergencias`
--
ALTER TABLE `contactosemergencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_persona` (`id_persona`),
  ADD KEY `id_parentesco` (`id_parentesco`);

--
-- Indexes for table `enfermeros`
--
ALTER TABLE `enfermeros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_persona` (`id_persona`);

--
-- Indexes for table `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD UNIQUE KEY `codigo_2` (`codigo`),
  ADD KEY `id_ala` (`id_ala`);

--
-- Indexes for table `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_reseta` (`id_reseta`);

--
-- Indexes for table `internaciones`
--
ALTER TABLE `internaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_paciente_seguro` (`id_paciente_seguro`),
  ADD KEY `id_cama` (`id_cama`),
  ADD KEY `id_motivo` (`id_motivo`),
  ADD KEY `id_contactoEmergencia` (`id_contactoEmergencia`);

--
-- Indexes for table `localidades`
--
ALTER TABLE `localidades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_provincia` (`id_provincia`);

--
-- Indexes for table `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_persona` (`id_persona`),
  ADD KEY `id_especialidad` (`id_especialidad`);

--
-- Indexes for table `motivos`
--
ALTER TABLE `motivos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`);

--
-- Indexes for table `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_persona` (`id_persona`),
  ADD KEY `id_localidad` (`id_localidad`),
  ADD KEY `id_tipoSangre` (`id_tipoSangre`);

--
-- Indexes for table `paciente_seguro`
--
ALTER TABLE `paciente_seguro`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_afiliado` (`codigo_afiliado`),
  ADD UNIQUE KEY `codigo_afiliado_2` (`codigo_afiliado`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_seguro` (`id_seguro`);

--
-- Indexes for table `parentescos`
--
ALTER TABLE `parentescos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`);

--
-- Indexes for table `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `DNI` (`DNI`),
  ADD UNIQUE KEY `DNI_2` (`DNI`),
  ADD KEY `id_persona` (`id_persona`);

--
-- Indexes for table `planes_cuidado`
--
ALTER TABLE `planes_cuidado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_persona` (`id_persona`),
  ADD KEY `id_internacion` (`id_internacion`),
  ADD KEY `id_reseta` (`id_reseta`),
  ADD KEY `id_tipo` (`id_tipo`),
  ADD KEY `id_plan_cuidado` (`id_plan_cuidado`);

--
-- Indexes for table `provincias`
--
ALTER TABLE `provincias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`);

--
-- Indexes for table `registros_sv`
--
ALTER TABLE `registros_sv`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_internacion` (`id_internacion`),
  ADD KEY `id_enfermero` (`id_enfermero`);

--
-- Indexes for table `renglones_reseta`
--
ALTER TABLE `renglones_reseta`
  ADD PRIMARY KEY (`id_reseta`,`id_medicamento`);

--
-- Indexes for table `resetas`
--
ALTER TABLE `resetas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_persona` (`id_persona`),
  ADD KEY `id_historial` (`id_historial`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`);

--
-- Indexes for table `sector`
--
ALTER TABLE `sector`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`);

--
-- Indexes for table `seguros`
--
ALTER TABLE `seguros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`);

--
-- Indexes for table `tipos`
--
ALTER TABLE `tipos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tipos_sangre`
--
ALTER TABLE `tipos_sangre`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_motivo` (`id_motivo`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `usuario_2` (`usuario`),
  ADD KEY `id_persona` (`id_persona`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alas`
--
ALTER TABLE `alas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `antecedentes`
--
ALTER TABLE `antecedentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `camas`
--
ALTER TABLE `camas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `contactosemergencias`
--
ALTER TABLE `contactosemergencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `enfermeros`
--
ALTER TABLE `enfermeros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `historial_medico`
--
ALTER TABLE `historial_medico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `internaciones`
--
ALTER TABLE `internaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `localidades`
--
ALTER TABLE `localidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `medicamentos`
--
ALTER TABLE `medicamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `motivos`
--
ALTER TABLE `motivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `paciente_seguro`
--
ALTER TABLE `paciente_seguro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `parentescos`
--
ALTER TABLE `parentescos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `personas`
--
ALTER TABLE `personas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `planes_cuidado`
--
ALTER TABLE `planes_cuidado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `provincias`
--
ALTER TABLE `provincias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `registros_sv`
--
ALTER TABLE `registros_sv`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `resetas`
--
ALTER TABLE `resetas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sector`
--
ALTER TABLE `sector`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `seguros`
--
ALTER TABLE `seguros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tipos`
--
ALTER TABLE `tipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tipos_sangre`
--
ALTER TABLE `tipos_sangre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alas`
--
ALTER TABLE `alas`
  ADD CONSTRAINT `alas_ibfk_1` FOREIGN KEY (`id_sector`) REFERENCES `sector` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `antecedentes`
--
ALTER TABLE `antecedentes`
  ADD CONSTRAINT `antecedentes_ibfk_1` FOREIGN KEY (`id_historial`) REFERENCES `historial_medico` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `antecedentes_ibfk_2` FOREIGN KEY (`id_tipo`) REFERENCES `tipos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `camas`
--
ALTER TABLE `camas`
  ADD CONSTRAINT `camas_ibfk_1` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `contactosemergencias`
--
ALTER TABLE `contactosemergencias`
  ADD CONSTRAINT `contactosemergencias_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `contactosemergencias_ibfk_2` FOREIGN KEY (`id_parentesco`) REFERENCES `parentescos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `enfermeros`
--
ALTER TABLE `enfermeros`
  ADD CONSTRAINT `enfermeros_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `habitaciones_ibfk_1` FOREIGN KEY (`id_ala`) REFERENCES `alas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD CONSTRAINT `historial_medico_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `historial_medico_ibfk_2` FOREIGN KEY (`id_reseta`) REFERENCES `resetas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `internaciones`
--
ALTER TABLE `internaciones`
  ADD CONSTRAINT `internaciones_ibfk_1` FOREIGN KEY (`id_paciente_seguro`) REFERENCES `paciente_seguro` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_2` FOREIGN KEY (`id_cama`) REFERENCES `camas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_3` FOREIGN KEY (`id_motivo`) REFERENCES `motivos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `internaciones_ibfk_4` FOREIGN KEY (`id_contactoEmergencia`) REFERENCES `contactosemergencias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `localidades`
--
ALTER TABLE `localidades`
  ADD CONSTRAINT `localidades_ibfk_1` FOREIGN KEY (`id_provincia`) REFERENCES `provincias` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `medicos_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `medicos_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `pacientes_ibfk_2` FOREIGN KEY (`id_localidad`) REFERENCES `localidades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pacientes_ibfk_3` FOREIGN KEY (`id_tipoSangre`) REFERENCES `tipos_sangre` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `paciente_seguro`
--
ALTER TABLE `paciente_seguro`
  ADD CONSTRAINT `paciente_seguro_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `paciente_seguro_ibfk_2` FOREIGN KEY (`id_seguro`) REFERENCES `seguros` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `personas`
--
ALTER TABLE `personas`
  ADD CONSTRAINT `personas_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `planes_cuidado`
--
ALTER TABLE `planes_cuidado`
  ADD CONSTRAINT `planes_cuidado_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `planes_cuidado_ibfk_2` FOREIGN KEY (`id_internacion`) REFERENCES `internaciones` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `planes_cuidado_ibfk_3` FOREIGN KEY (`id_reseta`) REFERENCES `resetas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `planes_cuidado_ibfk_4` FOREIGN KEY (`id_tipo`) REFERENCES `tipos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `planes_cuidado_ibfk_5` FOREIGN KEY (`id_plan_cuidado`) REFERENCES `tipos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `registros_sv`
--
ALTER TABLE `registros_sv`
  ADD CONSTRAINT `registros_sv_ibfk_1` FOREIGN KEY (`id_internacion`) REFERENCES `internaciones` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `registros_sv_ibfk_2` FOREIGN KEY (`id_enfermero`) REFERENCES `enfermeros` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `resetas`
--
ALTER TABLE `resetas`
  ADD CONSTRAINT `resetas_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `resetas_ibfk_2` FOREIGN KEY (`id_historial`) REFERENCES `historial_medico` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_motivo`) REFERENCES `motivos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
