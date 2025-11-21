-- =============================================
-- Script: Seed Evidence Items
-- Description: Insertar indicios con datos realistas
-- Author: Carmelo Mayén
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

SET IDENTITY_INSERT TraceEvidence ON;

INSERT INTO TraceEvidence (Id, CaseFileId, EvidenceNumber, Description, TraceEvidenceTypeId, Color, Size, Weight, Location, StorageLocation, CollectedById) VALUES
-- Case 1: Robo a mano armada (3 evidencias)
(1, 1, 'EVD-001-A', 'Pistola calibre 9mm marca Glock', 1, 'Negro', '20x15x5 cm', 0.85, 'Escena del crimen, mostrador principal', 'Bóveda A-12', 5),
(2, 1, 'EVD-001-B', 'Pasamontañas negro con restos de cabello', 12, 'Negro', 'Talla única', 0.15, 'Abandonado en salida de emergencia', 'Refrigerador B-03', 5),
(3, 1, 'EVD-001-C', 'Grabación de cámaras de seguridad (2 horas)', 9, NULL, 'Digital 4GB', NULL, 'Sistema de seguridad del banco', 'Servidor digital S-01', 5),

-- Case 2: Homicidio (5 evidencias)
(4, 2, 'EVD-002-A', 'Cuchillo de cocina con manchas de sangre', 2, 'Plateado', '30cm largo', 0.25, 'Cocina, cajón de utensilios', 'Refrigerador B-05', 6),
(5, 2, 'EVD-002-B', 'Muestra de sangre del piso', 5, 'Rojo oscuro', '5ml', 0.01, 'Sala principal, cerca del sofá', 'Refrigerador B-06', 6),
(6, 2, 'EVD-002-C', 'Huellas dactilares levantadas de la puerta', 7, NULL, '10x8 cm', NULL, 'Puerta principal, manija exterior', 'Archivador A-15', 6),
(7, 2, 'EVD-002-D', 'Celular de la víctima', 6, 'Negro', 'iPhone 13', 0.18, 'Mesita de noche, dormitorio', 'Caja fuerte D-08', 6),
(8, 2, 'EVD-002-E', 'Nota manuscrita encontrada en la escena', 4, 'Blanco', 'Tamaño carta', 0.01, 'Sobre la mesa del comedor', 'Archivador A-16', 6),

-- Case 3: Tráfico de drogas (4 evidencias)
(9, 3, 'EVD-003-A', 'Paquete de cocaína 25kg', 3, 'Blanco', '40x30x15 cm', 25.00, 'Maletero del vehículo interceptado', 'Bóveda alta seguridad AS-01', 7),
(10, 3, 'EVD-003-B', 'Paquete de cocaína 25kg (segunda maleta)', 3, 'Blanco', '40x30x15 cm', 25.00, 'Asiento trasero del vehículo', 'Bóveda alta seguridad AS-02', 7),
(11, 3, 'EVD-003-C', 'Teléfono satelital con registro de llamadas', 6, 'Verde militar', 'Iridium 9575', 0.30, 'Guantera del vehículo', 'Caja fuerte D-09', 7),
(12, 3, 'EVD-003-D', 'Documento con códigos y rutas', 4, 'Amarillo', '2 páginas A4', 0.01, 'Interior del teléfono satelital', 'Archivador A-17', 7),

-- Case 4: Fraude bancario (3 evidencias)
(13, 4, 'EVD-004-A', 'Laptop con software de hackeo', 6, 'Gris', 'Dell XPS 15"', 2.00, 'Domicilio del sospechoso', 'Caja fuerte D-10', 8),
(14, 4, 'EVD-004-B', 'USB con archivos de transacciones', 6, 'Negro', '8GB Kingston', 0.01, 'Cajón del escritorio', 'Caja fuerte D-11', 8),
(15, 4, 'EVD-004-C', 'Documentos bancarios falsificados', 4, 'Blanco', 'Folder con 50 hojas', 0.30, 'Archivador personal', 'Archivador A-18', 8),

-- Case 5: Secuestro (4 evidencias)
(16, 5, 'EVD-005-A', 'Cinta adhesiva usada para amarrar víctima', 12, 'Plateado', 'Rollo parcial', 0.25, 'Bodega donde estuvo retenido', 'Caja B-20', 9),
(17, 5, 'EVD-005-B', 'Grabación de audio de las amenazas', 9, NULL, 'Digital 100MB', NULL, 'Teléfono de la víctima', 'Servidor digital S-02', 9),
(18, 5, 'EVD-005-C', 'Silla donde estuvo amarrada la víctima', 13, 'Café', 'Silla metálica estándar', 8.50, 'Centro de la bodega', 'Almacén general AG-05', 9),
(19, 5, 'EVD-005-D', 'Restos de comida dejados por secuestradores', 5, 'Varios', 'Envases de plástico', 0.20, 'Esquina de la bodega', 'Refrigerador B-10', 9),

-- Case 11: Tráfico de armas (EN REVISIÓN) (6 evidencias)
(20, 11, 'EVD-011-A', 'Rifle AK-47', 1, 'Negro/Madera', '87cm largo', 3.47, 'Caja de madera en bodega', 'Bóveda A-20', 5),
(21, 11, 'EVD-011-B', 'Rifle AR-15', 1, 'Negro', '80cm largo', 2.88, 'Caja de madera en bodega', 'Bóveda A-21', 5),
(22, 11, 'EVD-011-C', 'Pistola Beretta 92', 1, 'Negro', '21cm largo', 0.95, 'Mesa de trabajo en bodega', 'Bóveda A-22', 5),
(23, 11, 'EVD-011-D', 'Caja de municiones calibre 7.62 (500 unidades)', 1, 'Verde', '30x20x15 cm', 15.00, 'Estantería metálica', 'Bóveda A-23', 5),
(24, 11, 'EVD-011-E', 'Caja de municiones calibre 5.56 (500 unidades)', 1, 'Verde', '30x20x15 cm', 12.50, 'Estantería metálica', 'Bóveda A-24', 5),
(25, 11, 'EVD-011-F', 'Lista de compradores con códigos', 4, 'Blanco', '5 páginas', 0.05, 'Escritorio de oficina', 'Archivador A-25', 5),

-- Case 12: Lavado de activos (EN REVISIÓN) (5 evidencias)
(26, 12, 'EVD-012-A', 'Estados de cuenta de 15 empresas', 4, 'Blanco', 'Folder grueso 200 hojas', 1.20, 'Oficina principal', 'Archivador A-26', 6),
(27, 12, 'EVD-012-B', 'Disco duro con registros contables', 6, 'Negro', '2TB Seagate', 0.50, 'Servidor de la empresa', 'Caja fuerte D-15', 6),
(28, 12, 'EVD-012-C', 'Contratos de empresas fantasma', 4, 'Blanco', 'Carpeta con 30 documentos', 0.60, 'Caja fuerte personal', 'Archivador A-27', 6),
(29, 12, 'EVD-012-D', 'Tarjetas de crédito a nombre de terceros', 13, 'Varios colores', '10 tarjetas', 0.10, 'Cajón del escritorio', 'Caja B-25', 6),
(30, 12, 'EVD-012-E', 'Teléfono con comunicaciones encriptadas', 6, 'Negro', 'BlackBerry', 0.15, 'Bolsillo del saco del sospechoso', 'Caja fuerte D-16', 6),

-- Case 19: Homicidio calificado (APROBADO) (7 evidencias)
(31, 19, 'EVD-019-A', 'Arma homicida - Revolver .38', 1, 'Plateado', '25cm', 1.20, 'Arbusto cercano a la escena', 'Bóveda A-30', 13),
(32, 19, 'EVD-019-B', 'Casquillos calibre .38 (3 unidades)', 1, 'Dorado', '2cm cada uno', 0.05, 'Dispersos en el suelo del parque', 'Caja B-30', 13),
(33, 19, 'EVD-019-C', 'Ropa de la víctima con impactos de bala', 12, 'Azul/sangre', 'Camisa XL', 0.30, 'Sobre el cuerpo de la víctima', 'Refrigerador B-15', 13),
(34, 19, 'EVD-019-D', 'Muestras de sangre del agresor', 5, 'Rojo', '10ml', 0.02, 'Rastro desde escena hasta calle', 'Refrigerador B-16', 13),
(35, 19, 'EVD-019-E', 'Video de cámara municipal', 9, NULL, 'Digital 1.5GB', NULL, 'Poste de alumbrado público', 'Servidor digital S-05', 13),
(36, 19, 'EVD-019-F', 'Huellas de zapatos en tierra', 7, NULL, 'Molde de yeso 30cm', 1.50, 'Sendero del parque', 'Archivador A-30', 13),
(37, 19, 'EVD-019-G', 'Celular de la víctima con último mensaje', 6, 'Blanco', 'Samsung Galaxy S21', 0.17, 'Bolsillo del pantalón', 'Caja fuerte D-20', 13),

-- Case 20: Narcotráfico (APROBADO) (5 evidencias)
(38, 20, 'EVD-020-A', 'Contenedor con doble fondo', 13, 'Azul metálico', '6m x 2.5m x 2.5m', 2500.00, 'Puerto Limón, muelle 5', 'Almacén portuario AP-01', 14),
(39, 20, 'EVD-020-B', 'Cocaína pura 200kg', 3, 'Blanco', 'Paquetes de 1kg c/u', 200.00, 'Interior del doble fondo', 'Bóveda alta seguridad AS-10', 14),
(40, 20, 'EVD-020-C', 'Documentación de envío falsificada', 4, 'Blanco', '20 páginas', 0.20, 'Oficina del transitario', 'Archivador A-35', 14),
(41, 20, 'EVD-020-D', 'GPS tracker oculto en contenedor', 6, 'Negro', '10x5x3 cm', 0.30, 'Soldado al techo del contenedor', 'Caja fuerte D-25', 14),
(42, 20, 'EVD-020-E', 'Radio de comunicación satelital', 6, 'Verde', 'Motorola profesional', 0.80, 'Cabina del camión transportador', 'Caja fuerte D-26', 14),

-- Case 23: Lesiones (RECHAZADO - necesita más evidencia) (2 evidencias)
(43, 23, 'EVD-023-A', 'Botella de cerveza rota usada en agresión', 13, 'Verde/transparente', 'Fragmentos varios', 0.40, 'Mesa del bar donde ocurrió riña', 'Caja B-35', 7),
(44, 23, 'EVD-023-B', 'Declaración escrita del testigo', 4, 'Blanco', '2 páginas', 0.02, 'Comisaría local', 'Archivador A-40', 7),

-- Evidencias adicionales para casos con pocas evidencias
-- Case 6: Vandalismo (3 evidencias)
(45, 6, 'EVD-006-A', 'Lata de pintura spray roja', 13, 'Rojo', '500ml', 0.60, 'Abandonada cerca del edificio', 'Almacén general AG-10', 10),
(46, 6, 'EVD-006-B', 'Fotografías de los grafitis', 8, NULL, '50 fotos digitales', NULL, 'Todas las paredes vandalizadas', 'Servidor digital S-10', 10),
(47, 6, 'EVD-006-C', 'Fragmento de tela enganchado en verja', 12, 'Negro', '10x5 cm', 0.05, 'Alambre de púas de la verja', 'Caja B-40', 10),

-- Case 7: Robo de vehículo (3 evidencias)
(48, 7, 'EVD-007-A', 'Ganzúa utilizada para abrir puerta', 13, 'Metal plateado', '15cm', 0.10, 'Interior del vehículo recuperado', 'Caja B-41', 11),
(49, 7, 'EVD-007-B', 'Grabación de cámara del parqueo', 9, NULL, 'Digital 800MB', NULL, 'Sistema de seguridad del centro comercial', 'Servidor digital S-11', 11),
(50, 7, 'EVD-007-C', 'Huellas dactilares del volante', 7, NULL, 'Levantadas con polvo negro', NULL, 'Volante del vehículo', 'Archivador A-42', 11),

-- Case 13: Abuso sexual (EN REVISIÓN) (4 evidencias - sensibles)
(51, 13, 'EVD-013-A', 'Ropa de la víctima para análisis forense', 12, 'Varios', 'Set completo', 0.50, 'Hospital donde fue atendida', 'Refrigerador B-20', 7),
(52, 13, 'EVD-013-B', 'Muestras biológicas para ADN', 5, NULL, 'Kit médico forense', 0.10, 'Examen médico legal', 'Refrigerador B-21', 7),
(53, 13, 'EVD-013-C', 'Grabación de entrevista a la víctima', 9, NULL, 'Video digital 2GB', NULL, 'Cámara Gesell', 'Servidor digital S-12', 7),
(54, 13, 'EVD-013-D', 'Registro de entrada y salida de la escuela', 4, 'Blanco', 'Libro de registro', 0.80, 'Oficina administrativa', 'Archivador A-43', 7),

-- Case 14: Corrupción (EN REVISIÓN) (3 evidencias)
(55, 14, 'EVD-014-A', 'Dinero en efectivo ($5,000)', 10, 'Verde', 'Billetes de $100', 0.30, 'Cajón del escritorio del oficial', 'Caja fuerte D-30', 8),
(56, 14, 'EVD-014-B', 'Lista de pagos mensuales', 4, 'Blanco', '10 páginas manuscritas', 0.10, 'Escondida en locker personal', 'Archivador A-44', 8),
(57, 14, 'EVD-014-C', 'Grabación de conversación telefónica', 9, NULL, 'Audio digital 50MB', NULL, 'Intervención telefónica autorizada', 'Servidor digital S-13', 8);

SET IDENTITY_INSERT TraceEvidence OFF;
GO

PRINT '57 Evidence items created successfully!';
PRINT 'Evidence distributed across multiple case files';
PRINT 'Includes: weapons, drugs, documents, biological samples, digital evidence, etc.';
