-- =============================================
-- Script: Seed Case File Participants
-- Description: Assign technicians and other participants to case files
-- Author: Carmelo Mayén
-- Date: 2025-11-20
-- =============================================

USE EvidenceManagementDB;
GO

-- No usar IDENTITY_INSERT para evitar conflictos en init-complete.sql
INSERT INTO CaseFileParticipants (CaseFileId, UserId, ParticipationRole) VALUES
-- Case 1: Robo a mano armada (3 técnicos)
(1, 5, 'Investigador principal'),
(1, 6, 'Especialista en balística'),
(1, 7, 'Técnico de escena del crimen'),

-- Case 2: Homicidio (4 técnicos)
(2, 6, 'Investigador principal'),
(2, 8, 'Especialista en análisis de ADN'),
(2, 9, 'Técnico en huellas dactilares'),
(2, 10, 'Fotógrafo forense'),

-- Case 3: Tráfico de drogas (3 técnicos)
(3, 7, 'Investigador principal'),
(3, 11, 'Especialista en narcóticos'),
(3, 12, 'Analista de comunicaciones'),

-- Case 4: Fraude bancario (2 técnicos)
(4, 8, 'Investigador principal'),
(4, 13, 'Perito informático forense'),

-- Case 5: Secuestro (3 técnicos)
(5, 9, 'Investigador principal'),
(5, 10, 'Especialista en video análisis'),
(5, 14, 'Técnico de procesamiento de escena'),

-- Case 6: Vandalismo (2 técnicos)
(6, 10, 'Investigador principal'),
(6, 11, 'Fotógrafo de evidencias'),

-- Case 7: Robo de vehículo (2 técnicos)
(7, 11, 'Investigador principal'),
(7, 12, 'Especialista en huellas'),

-- Case 8: Falsificación (2 técnicos)
(8, 12, 'Investigador principal'),
(8, 13, 'Perito en documentos'),

-- Case 9: Extorsión (3 técnicos)
(9, 13, 'Investigador principal'),
(9, 14, 'Analista de comunicaciones'),
(9, 5, 'Técnico de apoyo'),

-- Case 10: Amenazas (2 técnicos)
(10, 14, 'Investigador principal'),
(10, 6, 'Especialista en análisis de amenazas'),

-- Case 11: Tráfico de armas (4 técnicos - EN REVISIÓN)
(11, 5, 'Investigador principal'),
(11, 7, 'Especialista en armamento'),
(11, 8, 'Técnico en balística'),
(11, 9, 'Analista de inteligencia'),

-- Case 12: Lavado de activos (3 técnicos - EN REVISIÓN)
(12, 6, 'Investigador principal'),
(12, 10, 'Perito contable forense'),
(12, 11, 'Analista financiero'),

-- Case 13: Abuso sexual (4 técnicos - EN REVISIÓN)
(13, 7, 'Investigador principal'),
(13, 12, 'Técnico en entrevista de víctimas'),
(13, 13, 'Médico forense'),
(13, 14, 'Psicólogo forense'),

-- Case 14: Corrupción (3 técnicos - EN REVISIÓN)
(14, 8, 'Investigador principal'),
(14, 5, 'Especialista en asuntos internos'),
(14, 6, 'Analista de inteligencia'),

-- Case 15: Posesión de drogas (2 técnicos - EN REVISIÓN)
(15, 9, 'Investigador principal'),
(15, 7, 'Químico forense'),

-- Case 16: Accidente con fuga (3 técnicos - EN REVISIÓN)
(16, 10, 'Investigador principal'),
(16, 11, 'Perito en mecánica automotriz'),
(16, 12, 'Técnico en reconstrucción de accidentes'),

-- Case 17: Pornografía infantil (3 técnicos - EN REVISIÓN)
(17, 11, 'Investigador principal'),
(17, 13, 'Perito informático forense'),
(17, 14, 'Especialista en delitos digitales'),

-- Case 18: Robo con violencia (3 técnicos - EN REVISIÓN)
(18, 12, 'Investigador principal'),
(18, 5, 'Técnico de escena del crimen'),
(18, 6, 'Especialista en entrevistas'),

-- Case 19: Homicidio calificado (5 técnicos - APROBADO)
(19, 13, 'Investigador principal'),
(19, 7, 'Especialista en balística'),
(19, 8, 'Técnico en análisis de ADN'),
(19, 9, 'Médico forense'),
(19, 10, 'Fotógrafo y video analista'),

-- Case 20: Narcotráfico (5 técnicos - APROBADO)
(20, 14, 'Investigador principal'),
(20, 11, 'Especialista en narcóticos'),
(20, 12, 'Analista de inteligencia'),
(20, 13, 'Perito químico'),
(20, 5, 'Coordinador con autoridades portuarias'),

-- Case 21: Trata de personas (5 técnicos - APROBADO)
(21, 5, 'Investigador principal'),
(21, 6, 'Especialista en víctimas'),
(21, 7, 'Psicólogo forense'),
(21, 8, 'Trabajador social'),
(21, 9, 'Analista de inteligencia'),

-- Case 22: Ciberdelito (3 técnicos - APROBADO)
(22, 6, 'Investigador principal'),
(22, 13, 'Perito informático forense'),
(22, 14, 'Especialista en seguridad informática'),

-- Case 23: Lesiones (2 técnicos - RECHAZADO)
(23, 7, 'Investigador principal'),
(23, 10, 'Fotógrafo forense'),

-- Case 24: Estafa (2 técnicos - RECHAZADO)
(24, 8, 'Investigador principal'),
(24, 11, 'Perito contable'),

-- Case 25: Violencia doméstica (2 técnicos - RECHAZADO)
(25, 9, 'Investigador principal'),
(25, 12, 'Técnico en atención a víctimas');

GO

PRINT '75 Case File Participants created successfully!';
PRINT 'Participants assigned with various roles:';
PRINT '- Investigadores principales';
PRINT '- Especialistas forenses';
PRINT '- Técnicos de escena del crimen';
PRINT '- Peritos (informático, contable, químico, etc.)';
PRINT 'All 25 case files have assigned participants';
