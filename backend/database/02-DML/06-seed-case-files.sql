-- =============================================
-- Script: Seed Case Files with Evidence
-- Description: Insert 25 case files with various statuses and evidences
-- Author: Carmelo Mayén
-- Date: 2025-11-20
-- =============================================

USE EvidenceManagementDB;
GO

SET IDENTITY_INSERT CaseFiles ON;

-- Case Files in different statuses
INSERT INTO CaseFiles (Id, CaseNumber, Title, Description, IncidentDate, IncidentLocation, StatusId, RegisteredById, ReviewedById, RejectionReason, RegisteredAt, ReviewedAt, ApprovedAt) VALUES
-- Borradores (10 expedientes)
(1, 'DICRI-2025-001', 'Robo a mano armada en banco central', 'Asalto perpetrado por tres individuos encapuchados en sucursal bancaria', '2025-11-15 09:30:00', 'Av. Principal 123, San José', 1, 5, NULL, NULL, '2025-11-15 10:00:00', NULL, NULL),
(2, 'DICRI-2025-002', 'Homicidio en zona residencial', 'Víctima encontrada en su domicilio con múltiples heridas', '2025-11-14 22:15:00', 'Residencial Los Pinos, Casa 45', 1, 6, NULL, NULL, '2025-11-15 08:00:00', NULL, NULL),
(3, 'DICRI-2025-003', 'Tráfico de sustancias ilícitas', 'Incautación de 50kg de sustancias prohibidas en operativo', '2025-11-13 18:00:00', 'Carretera Interamericana Km 45', 1, 7, NULL, NULL, '2025-11-14 09:00:00', NULL, NULL),
(4, 'DICRI-2025-004', 'Fraude bancario electrónico', 'Transferencias fraudulentas por $500,000', '2025-11-12 14:00:00', 'Banco Nacional, sucursal virtual', 1, 8, NULL, NULL, '2025-11-13 11:00:00', NULL, NULL),
(5, 'DICRI-2025-005', 'Secuestro express', 'Víctima retenida por 8 horas, liberada tras pago', '2025-11-11 20:00:00', 'Zona industrial, bodega 12', 1, 9, NULL, NULL, '2025-11-12 07:00:00', NULL, NULL),
(6, 'DICRI-2025-006', 'Vandalismo en propiedad pública', 'Daños materiales en edificio municipal', '2025-11-10 03:00:00', 'Municipalidad de San Pedro', 1, 10, NULL, NULL, '2025-11-10 08:00:00', NULL, NULL),
(7, 'DICRI-2025-007', 'Robo de vehículo', 'Sustracción de vehículo marca Toyota Corolla 2023', '2025-11-09 19:30:00', 'Parqueo Centro Comercial Plaza', 1, 11, NULL, NULL, '2025-11-10 09:00:00', NULL, NULL),
(8, 'DICRI-2025-008', 'Estafa inmobiliaria', 'Venta fraudulenta de propiedades inexistentes', '2025-11-08 11:00:00', 'Oficina inmobiliaria calle 5', 1, 12, NULL, NULL, '2025-11-09 10:00:00', NULL, NULL),
(9, 'DICRI-2025-009', 'Amenazas y extorsión', 'Víctima recibe amenazas por correo y teléfono', '2025-11-07 16:00:00', 'Domicilio de la víctima', 1, 13, NULL, NULL, '2025-11-08 08:00:00', NULL, NULL),
(10, 'DICRI-2025-010', 'Violencia doméstica', 'Agresión física en el hogar', '2025-11-06 21:00:00', 'Residencia familiar, barrio El Carmen', 1, 14, NULL, NULL, '2025-11-07 09:00:00', NULL, NULL),

-- En Revisión (8 expedientes)
(11, 'DICRI-2025-011', 'Tráfico de armas ilegales', 'Decomiso de arsenal en operativo nocturno', '2025-11-05 23:00:00', 'Bodega clandestina, zona franca', 2, 5, NULL, NULL, '2025-11-06 08:00:00', NULL, NULL),
(12, 'DICRI-2025-012', 'Lavado de activos', 'Operaciones financieras sospechosas detectadas', '2025-11-04 10:00:00', 'Entidades bancarias múltiples', 2, 6, NULL, NULL, '2025-11-05 09:00:00', NULL, NULL),
(13, 'DICRI-2025-013', 'Abuso sexual agravado', 'Denuncia de abuso en centro educativo', '2025-11-03 14:30:00', 'Escuela pública zona norte', 2, 7, NULL, NULL, '2025-11-04 08:00:00', NULL, NULL),
(14, 'DICRI-2025-014', 'Corrupción de funcionarios', 'Sobornos a oficiales de tránsito', '2025-11-02 12:00:00', 'Puesto policial ruta 32', 2, 8, NULL, NULL, '2025-11-03 10:00:00', NULL, NULL),
(15, 'DICRI-2025-015', 'Robo con violencia', 'Asalto en transporte público con arma blanca', '2025-11-01 18:45:00', 'Autobús ruta 400, parada central', 2, 9, NULL, NULL, '2025-11-02 08:00:00', NULL, NULL),
(16, 'DICRI-2025-016', 'Falsificación de documentos', 'Red de falsificación de cédulas y pasaportes', '2025-10-31 09:00:00', 'Imprenta clandestina, San Juan', 2, 10, NULL, NULL, '2025-11-01 11:00:00', NULL, NULL),
(17, 'DICRI-2025-017', 'Trata de personas', 'Rescate de 12 víctimas en operativo conjunto', '2025-10-30 02:00:00', 'Casa de seguridad, Alajuela', 2, 11, NULL, NULL, '2025-10-31 09:00:00', NULL, NULL),
(18, 'DICRI-2025-018', 'Ciberdelito - Phishing', 'Campaña masiva de phishing bancario', '2025-10-29 15:00:00', 'Servidores internacionales', 2, 12, NULL, NULL, '2025-10-30 10:00:00', NULL, NULL),

-- Aprobados (4 expedientes)
(19, 'DICRI-2025-019', 'Homicidio calificado', 'Asesinato premeditado, caso resuelto', '2025-10-28 19:00:00', 'Parque Central de Heredia', 3, 13, 2, NULL, '2025-10-29 08:00:00', '2025-10-30 14:00:00', '2025-10-30 14:00:00'),
(20, 'DICRI-2025-020', 'Narcotráfico internacional', 'Incautación de cargamento en puerto', '2025-10-27 06:00:00', 'Puerto Limón, contenedor 4532', 3, 14, 2, NULL, '2025-10-28 09:00:00', '2025-10-29 15:00:00', '2025-10-29 15:00:00'),
(21, 'DICRI-2025-021', 'Robo agravado en joyería', 'Asalto a joyería con rehenes, caso cerrado', '2025-10-26 13:00:00', 'Joyería Premium, Escazú', 3, 5, 3, NULL, '2025-10-27 10:00:00', '2025-10-28 16:00:00', '2025-10-28 16:00:00'),
(22, 'DICRI-2025-022', 'Incendio intencional', 'Quema premeditada de bodega comercial', '2025-10-25 01:00:00', 'Bodega textil, zona industrial', 3, 6, 3, NULL, '2025-10-26 08:00:00', '2025-10-27 11:00:00', '2025-10-27 11:00:00'),

-- Rechazados (3 expedientes)
(23, 'DICRI-2025-023', 'Lesiones leves en riña', 'Altercado en establecimiento nocturno', '2025-10-24 23:30:00', 'Bar El Encuentro, centro', 4, 7, 2, 'Falta evidencia fotográfica de las lesiones. Descripción de testigos incompleta. Requiere entrevistas adicionales.', '2025-10-25 09:00:00', '2025-10-26 10:00:00', NULL),
(24, 'DICRI-2025-024', 'Hurto en supermercado', 'Sustracción de mercadería valorada en $200', '2025-10-23 17:00:00', 'Supermercado La Familia', 4, 8, 3, 'Video de seguridad con mala calidad. No se logra identificar al sospechoso. Solicitar mejores imágenes y declaración del personal.', '2025-10-24 08:00:00', '2025-10-25 14:00:00', NULL),
(25, 'DICRI-2025-025', 'Daño a propiedad privada', 'Rotura de ventanas en edificio residencial', '2025-10-22 04:00:00', 'Edificio Residencial Torre Azul', 4, 9, 2, 'Falta cadena de custodia adecuada de los fragmentos de vidrio. Descripción del incidente muy general. Requiere más detalles y fotos.', '2025-10-23 10:00:00', '2025-10-24 15:00:00', NULL);

SET IDENTITY_INSERT CaseFiles OFF;
GO

PRINT '25 Case Files created successfully!';
PRINT '  - 10 Borradores';
PRINT '  - 8 En Revisión';
PRINT '  - 4 Aprobados';
PRINT '  - 3 Rechazados';
