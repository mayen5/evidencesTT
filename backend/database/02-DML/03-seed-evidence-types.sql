-- =============================================
-- Script: Seed Evidence Types
-- Description: Insertar tipos de indicios iniciales
-- Author: Carmelo Mayén
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

-- Insert Evidence Types
SET IDENTITY_INSERT TraceEvidenceTypes ON;

INSERT INTO TraceEvidenceTypes (Id, Name, Description, RequiresSpecialCare) VALUES
(1, 'Arma de Fuego', 'Armas de fuego, pistolas, rifles y municiones', 1),
(2, 'Arma Blanca', 'Cuchillos, navajas, machetes y objetos punzocortantes', 0),
(3, 'Droga', 'Sustancias ilícitas y estupefacientes', 1),
(4, 'Documento', 'Documentos, papeles, cartas, contratos', 0),
(5, 'Evidencia Biológica', 'Sangre, cabello, saliva, fluidos corporales', 1),
(6, 'Evidencia Digital', 'Dispositivos electrónicos, USB, discos duros, celulares', 1),
(7, 'Huella Dactilar', 'Huellas dactilares levantadas de la escena', 1),
(8, 'Fotografía', 'Evidencia fotográfica de la escena del crimen', 0),
(9, 'Video', 'Grabaciones de video relacionadas con el caso', 1),
(10, 'Dinero', 'Dinero en efectivo o valores', 1),
(11, 'Vehículo', 'Vehículos relacionados con el caso', 0),
(12, 'Ropa', 'Prendas de vestir y textiles', 0),
(13, 'Herramienta', 'Herramientas utilizadas en el crimen', 0),
(14, 'Explosivo', 'Material explosivo o pirotécnico', 1),
(15, 'Otro', 'Otro tipo de indicio no categorizado', 0);

SET IDENTITY_INSERT TraceEvidenceTypes OFF;
GO

PRINT 'Evidence Types seeded successfully!';
