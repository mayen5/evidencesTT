-- =============================================
-- Script: Seed Test Users
-- Description: Insert test users (coordinators and technicians)
-- Author: Carmelo Mayén
-- Date: 2025-11-20
-- Password for all: Test@123
-- =============================================

USE EvidenceManagementDB;
GO

-- Insert Test Users
-- Password: Test@123
-- Bcrypt hash generated with: bcrypt.hash('Test@123', 10)

SET IDENTITY_INSERT Users ON;

INSERT INTO Users (Id, Username, Email, PasswordHash, FirstName, LastName, RoleId, IsActive) VALUES
-- Coordinadores
(2, 'coord.martinez', 'coord.martinez@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Carlos', 'Martínez', 2, 1),
(3, 'coord.lopez', 'coord.lopez@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'María', 'López', 2, 1),
(4, 'coord.rodriguez', 'coord.rodriguez@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Roberto', 'Rodríguez', 2, 1),

-- Técnicos
(5, 'tec.garcia', 'tec.garcia@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Ana', 'García', 3, 1),
(6, 'tec.fernandez', 'tec.fernandez@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Juan', 'Fernández', 3, 1),
(7, 'tec.gonzalez', 'tec.gonzalez@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Laura', 'González', 3, 1),
(8, 'tec.sanchez', 'tec.sanchez@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Pedro', 'Sánchez', 3, 1),
(9, 'tec.ramirez', 'tec.ramirez@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Carmen', 'Ramírez', 3, 1),
(10, 'tec.torres', 'tec.torres@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Diego', 'Torres', 3, 1),
(11, 'tec.flores', 'tec.flores@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Sofía', 'Flores', 3, 1),
(12, 'tec.morales', 'tec.morales@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Miguel', 'Morales', 3, 1),
(13, 'tec.jimenez', 'tec.jimenez@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Patricia', 'Jiménez', 3, 1),
(14, 'tec.ruiz', 'tec.ruiz@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Antonio', 'Ruiz', 3, 1),
(15, 'tec.hernandez', 'tec.hernandez@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Elena', 'Hernández', 3, 1),

-- Visualizadores
(16, 'view.castro', 'view.castro@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Ricardo', 'Castro', 4, 1),
(17, 'view.vargas', 'view.vargas@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Isabel', 'Vargas', 4, 1),
(18, 'view.mendez', 'view.mendez@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Fernando', 'Méndez', 4, 1),
(19, 'view.chavez', 'view.chavez@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Gabriela', 'Chávez', 4, 1),
(20, 'view.reyes', 'view.reyes@dicri.gob', '$2b$10$wQTjl1zL6uXTjYvSj91E/eNogrH4rJU8AfMgtnK3wfmYGcSQWHUpK', 'Jorge', 'Reyes', 4, 1);

SET IDENTITY_INSERT Users OFF;
GO

PRINT 'Test users seeded successfully!';
PRINT '20 users created:';
PRINT '  - 1 Admin';
PRINT '  - 3 Coordinadores';
PRINT '  - 11 Técnicos';
PRINT '  - 5 Visualizadores';
PRINT 'Password for all test users: Test@123';
