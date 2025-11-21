-- =============================================
-- Script: Seed Roles
-- Description: Insert initial roles
-- Author: Carmelo Mayén
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

-- Insert Roles
SET IDENTITY_INSERT Roles ON;

INSERT INTO Roles (Id, Name, Description) VALUES
(1, 'Admin', 'Administrador del sistema con acceso completo'),
(2, 'Coordinador', 'Coordinador que revisa y aprueba/rechaza expedientes'),
(3, 'Tecnico', 'TÃ©cnico que registra expedientes e indicios'),
(4, 'Visualizador', 'Usuario con permisos de solo lectura');

SET IDENTITY_INSERT Roles OFF;
GO

PRINT 'Roles seeded successfully!';
