-- =============================================
-- Script: Seed Case File History
-- Description: Create audit trail for all case file status changes
-- Author: Carmelo Mayén
-- Date: 2025-11-20
-- =============================================

USE EvidenceManagementDB;
GO

SET IDENTITY_INSERT CaseFileHistory ON;

INSERT INTO CaseFileHistory (Id, CaseFileId, StatusId, ChangedById, Comments) VALUES
-- Case 1: Borrador (registro inicial)
(1, 1, 1, 5, 'Expediente creado por técnico García - Robo a mano armada en sucursal bancaria'),

-- Case 2: Borrador
(2, 2, 1, 6, 'Expediente creado por técnico Martínez - Caso de homicidio en zona residencial'),

-- Case 3: Borrador
(3, 3, 1, 7, 'Expediente creado por técnico López - Intercepcción de vehículo con droga'),

-- Case 4: Borrador
(4, 4, 1, 8, 'Expediente creado por técnico González - Investigación de fraude bancario'),

-- Case 5: Borrador
(5, 5, 1, 9, 'Expediente creado por técnico Rodríguez - Caso de secuestro con rescate'),

-- Case 6: Borrador
(6, 6, 1, 10, 'Expediente creado por técnico Hernández - Vandalismo en edificio público'),

-- Case 7: Borrador
(7, 7, 1, 11, 'Expediente creado por técnico Pérez - Robo de vehículo en centro comercial'),

-- Case 8: Borrador
(8, 8, 1, 12, 'Expediente creado por técnico Sánchez - Falsificación de documentos oficiales'),

-- Case 9: Borrador
(9, 9, 1, 13, 'Expediente creado por técnico Ramírez - Caso de extorsión a comerciante'),

-- Case 10: Borrador
(10, 10, 1, 14, 'Expediente creado por técnico Torres - Amenazas contra funcionario público'),

-- Case 11: Borrador → En Revisión
(11, 11, 1, 5, 'Expediente creado por técnico García - Decomiso de armamento ilegal'),
(12, 11, 2, 5, 'Expediente enviado a revisión - Evidencias recolectadas y documentadas'),

-- Case 12: Borrador → En Revisión
(13, 12, 1, 6, 'Expediente creado por técnico Martínez - Investigación de lavado de activos'),
(14, 12, 2, 6, 'Expediente enviado a revisión - Análisis financiero completado'),

-- Case 13: Borrador → En Revisión
(15, 13, 1, 7, 'Expediente creado por técnico López - Denuncia de abuso sexual en institución educativa'),
(16, 13, 2, 7, 'Expediente enviado a revisión - Peritaje médico legal adjunto'),

-- Case 14: Borrador → En Revisión
(17, 14, 1, 8, 'Expediente creado por técnico González - Investigación de corrupción policial'),
(18, 14, 2, 8, 'Expediente enviado a revisión - Evidencia de sobornos recopilada'),

-- Case 15: Borrador → En Revisión
(19, 15, 1, 9, 'Expediente creado por técnico Rodríguez - Allanamiento por posesión de drogas'),
(20, 15, 2, 9, 'Expediente enviado a revisión - Sustancias analizadas en laboratorio'),

-- Case 16: Borrador → En Revisión
(21, 16, 1, 10, 'Expediente creado por técnico Hernández - Accidente de tránsito con fuga'),
(22, 16, 2, 10, 'Expediente enviado a revisión - Peritaje vehicular completado'),

-- Case 17: Borrador → En Revisión
(23, 17, 1, 11, 'Expediente creado por técnico Pérez - Investigación de pornografía infantil'),
(24, 17, 2, 11, 'Expediente enviado a revisión - Análisis forense digital completado'),

-- Case 18: Borrador → En Revisión
(25, 18, 1, 12, 'Expediente creado por técnico Sánchez - Robo con violencia en residencia'),
(26, 18, 2, 12, 'Expediente enviado a revisión - Testigos entrevistados y evidencias procesadas'),

-- Case 19: Borrador → En Revisión → Aprobado
(27, 19, 1, 13, 'Expediente creado por técnico Ramírez - Homicidio calificado en parque municipal'),
(28, 19, 2, 13, 'Expediente enviado a revisión - Autopsia y balística completadas'),
(29, 19, 3, 2, 'Expediente APROBADO por coordinador Martínez - Documentación completa, evidencia suficiente para presentar ante fiscal'),

-- Case 20: Borrador → En Revisión → Aprobado
(30, 20, 1, 14, 'Expediente creado por técnico Torres - Narcotráfico internacional'),
(31, 20, 2, 14, 'Expediente enviado a revisión - Coordinación con autoridades portuarias completada'),
(32, 20, 3, 3, 'Expediente APROBADO por coordinador López - Caso de alto impacto, evidencia contundente'),

-- Case 21: Borrador → En Revisión → Aprobado
(33, 21, 1, 5, 'Expediente creado por técnico García - Operación contra red de trata de personas'),
(34, 21, 2, 5, 'Expediente enviado a revisión - Víctimas rescatadas y declaraciones tomadas'),
(35, 21, 3, 4, 'Expediente APROBADO por coordinador Rodríguez - Coordinación con OIJ exitosa, 5 víctimas rescatadas'),

-- Case 22: Borrador → En Revisión → Aprobado
(36, 22, 1, 6, 'Expediente creado por técnico Martínez - Ciberdelito con robo de identidad'),
(37, 22, 2, 6, 'Expediente enviado a revisión - Análisis de sistemas informáticos completado'),
(38, 22, 3, 2, 'Expediente APROBADO por coordinador Martínez - Evidencia digital preservada correctamente'),

-- Case 23: Borrador → En Revisión → Rechazado
(39, 23, 1, 7, 'Expediente creado por técnico López - Lesiones en riña de bar'),
(40, 23, 2, 7, 'Expediente enviado a revisión - Evidencias recolectadas en escena'),
(41, 23, 4, 2, 'Expediente RECHAZADO por coordinador Martínez - Evidencia insuficiente: Falta certificado médico legal de las lesiones. No se adjuntó declaración de la víctima. Solo hay un testigo presencial. Se requiere realizar entrevistas adicionales.'),

-- Case 24: Borrador → En Revisión → Rechazado
(42, 24, 1, 8, 'Expediente creado por técnico González - Estafa mediante inversión falsa'),
(43, 24, 2, 8, 'Expediente enviado a revisión - Documentación bancaria recopilada'),
(44, 24, 4, 3, 'Expediente RECHAZADO por coordinador López - Documentación incompleta: Falta el peritaje contable forense. No se identificaron todos los afectados. Se requiere ampliación del plazo de investigación para obtener información de instituciones financieras.'),

-- Case 25: Borrador → En Revisión → Rechazado
(45, 25, 1, 9, 'Expediente creado por técnico Rodríguez - Violencia doméstica'),
(46, 25, 2, 9, 'Expediente enviado a revisión - Denuncia registrada y evidencias fotográficas'),
(47, 25, 4, 4, 'Expediente RECHAZADO por coordinador Rodríguez - Procedimiento incorrecto: No se siguió el protocolo de atención a víctimas de violencia doméstica. Falta orden de protección. No se realizó valoración de riesgo. Se debe rehacer el expediente siguiendo los lineamientos del INAMU.');

SET IDENTITY_INSERT CaseFileHistory OFF;
GO

PRINT '47 Case File History records created successfully!';
PRINT 'Audit trail includes:';
PRINT '- 10 Cases in Borrador (initial creation only)';
PRINT '- 8 Cases in En Revisión (creation + submission)';
PRINT '- 4 Cases Aprobados (creation + submission + approval)';
PRINT '- 3 Cases Rechazados (creation + submission + rejection with detailed reasons)';
