-- =============================================
-- Script: Seed Case File Status
-- Description: Insert initial case file statuses
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

-- Insert Case File Statuses
SET IDENTITY_INSERT CaseFileStatus ON;

INSERT INTO CaseFileStatus (Id, Name, Description, [Order]) VALUES
(1, 'Borrador', 'Expediente en proceso de registro, se pueden agregar indicios', 1),
(2, 'En Revisión', 'Expediente enviado para revisión del coordinador', 2),
(3, 'Aprobado', 'Expediente aprobado por el coordinador', 3),
(4, 'Rechazado', 'Expediente rechazado, requiere correcciones', 4);

SET IDENTITY_INSERT CaseFileStatus OFF;
GO

PRINT 'Case File Statuses seeded successfully!';
