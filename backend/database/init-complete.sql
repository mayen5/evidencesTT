-- =============================================
-- Sistema de GestiÃ³n de Evidencias - Script Completo de InicializaciÃ³n
-- Author: Carmelo MayÃ©n
-- Date: 2025-11-20
-- Description: Crea la base de datos, tablas, datos iniciales y stored procedures
-- =============================================

-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EvidenceManagementDB')
BEGIN
    CREATE DATABASE EvidenceManagementDB;
    PRINT 'Database EvidenceManagementDB created';
END
GO

USE EvidenceManagementDB;
GO

-- ========== DDL: 01-create-tables.sql ==========
-- =============================================
-- Script: Create All Tables
-- Description: Creates all tables for Evidence Management System
-- Author: Carmelo Mayén
-- Date: 2025-11-18
-- =============================================

-- =============================================
-- Table: Roles
-- Description: User roles in the system
-- =============================================
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT CK_Roles_Name CHECK (LEN(TRIM(Name)) > 0)
);
GO

-- =============================================
-- Table: Users
-- Description: System users
-- =============================================
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    RoleId INT NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id),
    CONSTRAINT CK_Users_Username CHECK (LEN(TRIM(Username)) >= 3),
    CONSTRAINT CK_Users_Email CHECK (Email LIKE '%_@__%.__%'),
    CONSTRAINT CK_Users_FirstName CHECK (LEN(TRIM(FirstName)) > 0),
    CONSTRAINT CK_Users_LastName CHECK (LEN(TRIM(LastName)) > 0)
);
GO

-- =============================================
-- Table: CaseFileStatus
-- Description: Status of case files (Borrador, En Revisión, Aprobado, Rechazado)
-- =============================================
CREATE TABLE CaseFileStatus (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255) NULL,
    [Order] INT NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT CK_Status_Name CHECK (LEN(TRIM(Name)) > 0),
    CONSTRAINT CK_Status_Order CHECK ([Order] > 0)
);
GO

-- =============================================
-- Table: CaseFiles
-- Description: Criminal case files (expedientes)
-- =============================================
CREATE TABLE CaseFiles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CaseNumber NVARCHAR(50) NOT NULL UNIQUE,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    IncidentDate DATETIME2 NULL,
    IncidentLocation NVARCHAR(500) NULL,
    StatusId INT NOT NULL DEFAULT 1,
    RegisteredById INT NOT NULL,
    ReviewedById INT NULL,
    RejectionReason NVARCHAR(MAX) NULL,
    RegisteredAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    ReviewedAt DATETIME2 NULL,
    ApprovedAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_CaseFiles_Status FOREIGN KEY (StatusId) REFERENCES CaseFileStatus(Id),
    CONSTRAINT FK_CaseFiles_RegisteredBy FOREIGN KEY (RegisteredById) REFERENCES Users(Id),
    CONSTRAINT FK_CaseFiles_ReviewedBy FOREIGN KEY (ReviewedById) REFERENCES Users(Id),
    CONSTRAINT CK_CaseFiles_CaseNumber CHECK (LEN(TRIM(CaseNumber)) > 0),
    CONSTRAINT CK_CaseFiles_Title CHECK (LEN(TRIM(Title)) > 0),
    CONSTRAINT CK_CaseFiles_ReviewedAt CHECK (ReviewedAt IS NULL OR ReviewedAt >= RegisteredAt),
    CONSTRAINT CK_CaseFiles_ApprovedAt CHECK (ApprovedAt IS NULL OR ApprovedAt >= RegisteredAt)
);
GO

-- =============================================
-- Table: TraceEvidenceTypes
-- Description: Tipos de indicios (Arma, Droga, Documento, etc.)
-- =============================================
CREATE TABLE TraceEvidenceTypes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(255) NULL,
    RequiresSpecialCare BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT CK_TraceEvidenceTypes_Name CHECK (LEN(TRIM(Name)) > 0)
);
GO

-- =============================================
-- Table: TraceEvidence
-- Description: Indicios dentro de expedientes (elementos físicos recolectados en escena)
-- =============================================
CREATE TABLE TraceEvidence (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CaseFileId INT NOT NULL,
    EvidenceNumber NVARCHAR(50) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    TraceEvidenceTypeId INT NOT NULL,
    Color NVARCHAR(50) NULL,
    Size NVARCHAR(100) NULL,
    Weight DECIMAL(10,2) NULL,
    Location NVARCHAR(500) NULL,
    StorageLocation NVARCHAR(255) NULL,
    CollectedById INT NOT NULL,
    CollectedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_TraceEvidence_CaseFile FOREIGN KEY (CaseFileId) REFERENCES CaseFiles(Id) ON DELETE CASCADE,
    CONSTRAINT FK_TraceEvidence_Type FOREIGN KEY (TraceEvidenceTypeId) REFERENCES TraceEvidenceTypes(Id),
    CONSTRAINT FK_TraceEvidence_CollectedBy FOREIGN KEY (CollectedById) REFERENCES Users(Id),
    CONSTRAINT UQ_TraceEvidence_Number UNIQUE (CaseFileId, EvidenceNumber),
    CONSTRAINT CK_TraceEvidence_EvidenceNumber CHECK (LEN(TRIM(EvidenceNumber)) > 0),
    CONSTRAINT CK_TraceEvidence_Description CHECK (LEN(TRIM(Description)) > 0),
    CONSTRAINT CK_TraceEvidence_Weight CHECK (Weight IS NULL OR Weight >= 0)
);
GO

-- =============================================
-- Table: CaseFileHistory
-- Description: Audit trail of case file status changes
-- =============================================
CREATE TABLE CaseFileHistory (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CaseFileId INT NOT NULL,
    StatusId INT NOT NULL,
    ChangedById INT NOT NULL,
    Comments NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_History_CaseFile FOREIGN KEY (CaseFileId) REFERENCES CaseFiles(Id) ON DELETE CASCADE,
    CONSTRAINT FK_History_Status FOREIGN KEY (StatusId) REFERENCES CaseFileStatus(Id),
    CONSTRAINT FK_History_ChangedBy FOREIGN KEY (ChangedById) REFERENCES Users(Id)
);
GO

-- =============================================
-- Table: CaseFileParticipants
-- Description: Users who participated in a case file
-- =============================================
CREATE TABLE CaseFileParticipants (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CaseFileId INT NOT NULL,
    UserId INT NOT NULL,
    ParticipationRole NVARCHAR(100) NULL,
    AssignedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Participants_CaseFile FOREIGN KEY (CaseFileId) REFERENCES CaseFiles(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Participants_User FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT UQ_Participant UNIQUE (CaseFileId, UserId)
);
GO

-- =============================================
-- Table: Attachments
-- Description: Archivos adjuntos para indicios o expedientes
-- =============================================
CREATE TABLE Attachments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TraceEvidenceId INT NULL,
    CaseFileId INT NULL,
    FileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    FileType NVARCHAR(50) NULL,
    FileSize BIGINT NULL,
    UploadedById INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Attachments_TraceEvidence FOREIGN KEY (TraceEvidenceId) REFERENCES TraceEvidence(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Attachments_CaseFile FOREIGN KEY (CaseFileId) REFERENCES CaseFiles(Id),
    CONSTRAINT FK_Attachments_UploadedBy FOREIGN KEY (UploadedById) REFERENCES Users(Id),
    CONSTRAINT CK_Attachment_Reference CHECK (TraceEvidenceId IS NOT NULL OR CaseFileId IS NOT NULL),
    CONSTRAINT CK_Attachments_FileName CHECK (LEN(TRIM(FileName)) > 0),
    CONSTRAINT CK_Attachments_FilePath CHECK (LEN(TRIM(FilePath)) > 0),
    CONSTRAINT CK_Attachments_FileSize CHECK (FileSize IS NULL OR FileSize > 0)
);
GO

PRINT 'All tables created successfully!';


-- ========== DDL: 02-create-indexes.sql ==========
-- =============================================
-- Script: Create Indexes
-- Description: Creates indexes for performance optimization
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

-- =============================================
-- Indexes for Users table
-- =============================================
CREATE INDEX IX_Users_RoleId ON Users(RoleId);
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_IsActive ON Users(IsActive);
CREATE INDEX IX_Users_CreatedAt ON Users(CreatedAt);
GO

-- =============================================
-- Indexes for CaseFiles table
-- =============================================
CREATE INDEX IX_CaseFiles_StatusId ON CaseFiles(StatusId);
CREATE INDEX IX_CaseFiles_RegisteredById ON CaseFiles(RegisteredById);
CREATE INDEX IX_CaseFiles_ReviewedById ON CaseFiles(ReviewedById);
CREATE INDEX IX_CaseFiles_RegisteredAt ON CaseFiles(RegisteredAt);
CREATE INDEX IX_CaseFiles_CaseNumber ON CaseFiles(CaseNumber);
CREATE INDEX IX_CaseFiles_StatusId_RegisteredAt ON CaseFiles(StatusId, RegisteredAt);
GO

-- =============================================
-- Indexes for TraceEvidence table
-- =============================================
CREATE INDEX IX_TraceEvidence_CaseFileId ON TraceEvidence(CaseFileId);
CREATE INDEX IX_TraceEvidence_TraceEvidenceTypeId ON TraceEvidence(TraceEvidenceTypeId);
CREATE INDEX IX_TraceEvidence_CollectedById ON TraceEvidence(CollectedById);
CREATE INDEX IX_TraceEvidence_CollectedAt ON TraceEvidence(CollectedAt);
CREATE INDEX IX_TraceEvidence_CaseFileId_EvidenceNumber ON TraceEvidence(CaseFileId, EvidenceNumber);
GO

-- =============================================
-- Indexes for CaseFileHistory table
-- =============================================
CREATE INDEX IX_History_CaseFileId ON CaseFileHistory(CaseFileId);
CREATE INDEX IX_History_StatusId ON CaseFileHistory(StatusId);
CREATE INDEX IX_History_ChangedById ON CaseFileHistory(ChangedById);
CREATE INDEX IX_History_CreatedAt ON CaseFileHistory(CreatedAt);
CREATE INDEX IX_History_CaseFileId_CreatedAt ON CaseFileHistory(CaseFileId, CreatedAt);
GO

-- =============================================
-- Indexes for CaseFileParticipants table
-- =============================================
CREATE INDEX IX_Participants_CaseFileId ON CaseFileParticipants(CaseFileId);
CREATE INDEX IX_Participants_UserId ON CaseFileParticipants(UserId);
GO

-- =============================================
-- Indexes for Attachments table
-- =============================================
CREATE INDEX IX_Attachments_TraceEvidenceId ON Attachments(TraceEvidenceId);
CREATE INDEX IX_Attachments_CaseFileId ON Attachments(CaseFileId);
CREATE INDEX IX_Attachments_UploadedById ON Attachments(UploadedById);
CREATE INDEX IX_Attachments_CreatedAt ON Attachments(CreatedAt);
GO

PRINT 'All indexes created successfully!';


-- ========== DDL: 03-create-triggers.sql ==========
-- =============================================
-- Script: Create Triggers
-- Description: Creates triggers for audit and business logic
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

-- =============================================
-- Trigger: Update timestamp on Users table
-- =============================================
CREATE TRIGGER TR_Users_UpdateTimestamp
ON Users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Users
    SET UpdatedAt = GETDATE()
    FROM Users u
    INNER JOIN inserted i ON u.Id = i.Id;
END;
GO

-- =============================================
-- Trigger: Update timestamp on CaseFiles table
-- =============================================
CREATE TRIGGER TR_CaseFiles_UpdateTimestamp
ON CaseFiles
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE CaseFiles
    SET UpdatedAt = GETDATE()
    FROM CaseFiles cf
    INNER JOIN inserted i ON cf.Id = i.Id;
END;
GO

-- =============================================
-- Trigger: Update timestamp on TraceEvidence table
-- =============================================
CREATE TRIGGER TR_TraceEvidence_UpdateTimestamp
ON TraceEvidence
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE TraceEvidence
    SET UpdatedAt = GETDATE()
    FROM TraceEvidence e
    INNER JOIN inserted i ON e.Id = i.Id;
END;
GO

-- =============================================
-- Trigger: Auto-add participant when trace evidence is added
-- =============================================
CREATE TRIGGER TR_TraceEvidence_AddParticipant
ON TraceEvidence
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Add the collector as a participant if not already added
    INSERT INTO CaseFileParticipants (CaseFileId, UserId, ParticipationRole)
    SELECT DISTINCT 
        i.CaseFileId, 
        i.CollectedById, 
        'Recolector de Indicios'
    FROM inserted i
    WHERE NOT EXISTS (
        SELECT 1 
        FROM CaseFileParticipants cfp 
        WHERE cfp.CaseFileId = i.CaseFileId 
        AND cfp.UserId = i.CollectedById
    );
END;
GO

PRINT 'All triggers created successfully!';


-- ========== DML: 01-seed-roles.sql ==========
-- =============================================
-- Script: Seed Roles
-- Description: Insert initial roles
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

-- Insert Roles
SET IDENTITY_INSERT Roles ON;

INSERT INTO Roles (Id, Name, Description) VALUES
(1, 'Admin', 'Administrador del sistema con acceso completo'),
(2, 'Coordinador', 'Coordinador que revisa y aprueba/rechaza expedientes'),
(3, 'Tecnico', 'Técnico que registra expedientes e indicios'),
(4, 'Visualizador', 'Usuario con permisos de solo lectura');

SET IDENTITY_INSERT Roles OFF;
GO

PRINT 'Roles seeded successfully!';


-- ========== DML: 02-seed-status.sql ==========
-- =============================================
-- Script: Seed Case File Status
-- Description: Insert initial case file statuses
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

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


-- ========== DML: 03-seed-evidence-types.sql ==========
-- =============================================
-- Script: Seed Evidence Types
-- Description: Insertar tipos de indicios iniciales
-- Author: Carmelo Mayén
-- Date: 2025-11-18
-- =============================================

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


-- ========== DML: 04-seed-admin-user.sql ==========
-- =============================================
-- Script: Seed Admin User
-- Description: Insert default admin user for initial login
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- Password: Admin@123 (hashed with bcrypt)
-- =============================================

-- Insert Admin User
-- Password: Admin@123
-- Bcrypt hash generated with: bcrypt.hash('Admin@123', 10)

SET IDENTITY_INSERT Users ON;

INSERT INTO Users (Id, Username, Email, PasswordHash, FirstName, LastName, RoleId, IsActive) VALUES
(1, 'admin', 'admin@evidence.com', '$2b$10$Y/.bVJZ9enKrJTgU43cWeuTFgMO0L3ljDDUtOfHKNzr8gMIJlIGwC', 'Admin', 'System', 1, 1);

SET IDENTITY_INSERT Users OFF;
GO

PRINT 'Admin user seeded successfully!';
PRINT 'Username: admin';
PRINT 'Email: admin@evidence.com';
PRINT 'Password: Admin@123 (Please change after first login)';


-- ========== DML: 05-seed-test-users.sql ==========
-- =============================================
-- Script: Seed Test Users
-- Description: Insert test users (coordinators and technicians)
-- Author: Carmelo Mayén
-- Date: 2025-11-20
-- Password for all: Test@123
-- =============================================

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


-- ========== DML: 06-seed-case-files.sql ==========
-- =============================================
-- Script: Seed Case Files with Evidence
-- Description: Insert 25 case files with various statuses and evidences
-- Author: Carmelo Mayén
-- Date: 2025-11-20
-- =============================================

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


-- ========== DML: 07-seed-evidence.sql ==========
-- =============================================
-- Script: Seed Evidence Items
-- Description: Insertar indicios con datos realistas
-- Author: Carmelo Mayén
-- Date: 2025-11-18
-- =============================================

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


-- ========== DML: 08-seed-history.sql ==========
-- =============================================
-- Script: Seed Case File History
-- Description: Create audit trail for all case file status changes
-- Author: Carmelo Mayén
-- Date: 2025-11-20
-- =============================================

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


-- ========== DML: 09-seed-participants.sql ==========
-- =============================================
-- Script: Seed Case File Participants
-- Description: Assign technicians and other participants to case files
-- Author: Carmelo Mayén
-- Date: 2025-11-20
-- =============================================

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


-- ========== SP: auth\sp_AuthenticateUser.sql ==========
-- =============================================
-- Stored Procedure: sp_AuthenticateUser
-- Description: Authenticates a user by email
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

IF OBJECT_ID('sp_AuthenticateUser', 'P') IS NOT NULL
    DROP PROCEDURE sp_AuthenticateUser;
GO

CREATE PROCEDURE sp_AuthenticateUser
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Return user data if exists and active
        SELECT 
            u.Id,
            u.Username,
            u.Email,
            u.PasswordHash,
            u.FirstName,
            u.LastName,
            u.RoleId,
            r.Name AS RoleName,
            u.IsActive,
            u.CreatedAt
        FROM Users u
        INNER JOIN Roles r ON u.RoleId = r.Id
        WHERE u.Email = @Email 
          AND u.IsActive = 1;
          
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_AuthenticateUser created successfully!';


-- ========== SP: auth\sp_RegisterUser.sql ==========
-- =============================================
-- Stored Procedure: sp_RegisterUser
-- Description: Registers a new user in the system
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

IF OBJECT_ID('sp_RegisterUser', 'P') IS NOT NULL
    DROP PROCEDURE sp_RegisterUser;
GO

CREATE PROCEDURE sp_RegisterUser
    @Username NVARCHAR(100),
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @RoleId INT = 3, -- Default to Tecnico
    @NewUserId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if username already exists
        IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
        BEGIN
            THROW 50001, 'El nombre de usuario ya existe', 1;
        END
        
        -- Check if email already exists
        IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
        BEGIN
            THROW 50002, 'El correo electrónico ya está registrado', 1;
        END
        
        -- Check if role exists
        IF NOT EXISTS (SELECT 1 FROM Roles WHERE Id = @RoleId)
        BEGIN
            THROW 50003, 'El rol especificado no existe', 1;
        END
        
        -- Insert new user
        INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, RoleId, IsActive)
        VALUES (@Username, @Email, @PasswordHash, @FirstName, @LastName, @RoleId, 1);
        
        SET @NewUserId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        
        -- Return created user
        SELECT 
            u.Id,
            u.Username,
            u.Email,
            u.FirstName,
            u.LastName,
            u.RoleId,
            r.Name AS RoleName,
            u.IsActive,
            u.CreatedAt
        FROM Users u
        INNER JOIN Roles r ON u.RoleId = r.Id
        WHERE u.Id = @NewUserId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_RegisterUser created successfully!';


-- ========== SP: caseFiles\sp_ApproveCaseFile.sql ==========
-- =============================================
-- Stored Procedure: sp_ApproveCaseFile
-- Description: Approves a case file by coordinator
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

IF OBJECT_ID('sp_ApproveCaseFile', 'P') IS NOT NULL
    DROP PROCEDURE sp_ApproveCaseFile;
GO

CREATE PROCEDURE sp_ApproveCaseFile
    @CaseFileId INT,
    @ReviewedById INT,
    @Comments NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if case file exists
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
        BEGIN
            THROW 50040, 'El expediente no existe', 1;
        END
        
        -- Validate current status is En Revisión (2)
        DECLARE @CurrentStatus INT;
        SELECT @CurrentStatus = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @CurrentStatus != 2
        BEGIN
            THROW 50041, 'Solo se pueden aprobar expedientes en estado En Revisión', 1;
        END
        
        -- Validate reviewer is a Coordinador (RoleId = 2)
        DECLARE @ReviewerRole INT;
        SELECT @ReviewerRole = RoleId FROM Users WHERE Id = @ReviewedById;
        
        IF @ReviewerRole != 2
        BEGIN
            THROW 50042, 'Solo los coordinadores pueden aprobar expedientes', 1;
        END
        
        -- Update to Aprobado (3)
        UPDATE CaseFiles 
        SET 
            StatusId = 3,
            ReviewedById = @ReviewedById,
            ReviewedAt = GETDATE(),
            ApprovedAt = GETDATE(),
            RejectionReason = NULL,
            UpdatedAt = GETDATE()
        WHERE Id = @CaseFileId;
        
        -- Add to history
        INSERT INTO CaseFileHistory (CaseFileId, StatusId, ChangedById, Comments)
        VALUES (@CaseFileId, 3, @ReviewedById, ISNULL(@Comments, 'Expediente aprobado'));
        
        COMMIT TRANSACTION;
        
        -- Return updated case file
        EXEC sp_GetCaseFileById @CaseFileId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_ApproveCaseFile created successfully!';


-- ========== SP: caseFiles\sp_CreateCaseFile.sql ==========
-- =============================================
-- Stored Procedure: sp_CreateCaseFile
-- Description: Creates a new case file
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

IF OBJECT_ID('sp_CreateCaseFile', 'P') IS NOT NULL
    DROP PROCEDURE sp_CreateCaseFile;
GO

CREATE PROCEDURE sp_CreateCaseFile
    @CaseNumber NVARCHAR(50),
    @Title NVARCHAR(255),
    @Description NVARCHAR(MAX) = NULL,
    @IncidentDate DATETIME2 = NULL,
    @IncidentLocation NVARCHAR(500) = NULL,
    @RegisteredById INT,
    @NewCaseFileId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate user exists and is active
        IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @RegisteredById AND IsActive = 1)
        BEGIN
            THROW 50010, 'El usuario especificado no existe o está inactivo', 1;
        END
        
        -- Check if case number already exists
        IF EXISTS (SELECT 1 FROM CaseFiles WHERE CaseNumber = @CaseNumber)
        BEGIN
            THROW 50011, 'El número de expediente ya existe', 1;
        END
        
        -- Insert new case file with status 'Borrador' (1)
        INSERT INTO CaseFiles (
            CaseNumber, Title, Description, IncidentDate, 
            IncidentLocation, RegisteredById, StatusId
        )
        VALUES (
            @CaseNumber, @Title, @Description, @IncidentDate, 
            @IncidentLocation, @RegisteredById, 1
        );
        
        SET @NewCaseFileId = SCOPE_IDENTITY();
        
        -- Add to history
        INSERT INTO CaseFileHistory (CaseFileId, StatusId, ChangedById, Comments)
        VALUES (@NewCaseFileId, 1, @RegisteredById, 'Expediente creado');
        
        -- Add registerer as participant
        INSERT INTO CaseFileParticipants (CaseFileId, UserId, ParticipationRole)
        VALUES (@NewCaseFileId, @RegisteredById, 'Técnico Registrador');
        
        COMMIT TRANSACTION;
        
        -- Return created case file
        SELECT 
            cf.Id,
            cf.CaseNumber,
            cf.Title,
            cf.Description,
            cf.IncidentDate,
            cf.IncidentLocation,
            cf.StatusId,
            s.Name AS StatusName,
            cf.RegisteredById,
            u.FirstName + ' ' + u.LastName AS RegisteredByName,
            cf.ReviewedById,
            cf.RejectionReason,
            cf.RegisteredAt,
            cf.ReviewedAt,
            cf.ApprovedAt,
            cf.CreatedAt,
            cf.UpdatedAt
        FROM CaseFiles cf
        INNER JOIN CaseFileStatus s ON cf.StatusId = s.Id
        INNER JOIN Users u ON cf.RegisteredById = u.Id
        WHERE cf.Id = @NewCaseFileId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_CreateCaseFile created successfully!';


-- ========== SP: caseFiles\sp_DeleteCaseFile.sql ==========
-- =============================================
-- Stored Procedure: sp_DeleteCaseFile
-- Description: Deletes a case file (only in Borrador or Rechazado status)
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

IF OBJECT_ID('sp_DeleteCaseFile', 'P') IS NOT NULL
    DROP PROCEDURE sp_DeleteCaseFile;
GO

CREATE PROCEDURE sp_DeleteCaseFile
    @CaseFileId INT,
    @DeletedById INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if case file exists
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
        BEGIN
            THROW 50060, 'El expediente no existe', 1;
        END
        
        -- Check if status allows deletion (only Borrador=1)
        DECLARE @CurrentStatus INT;
        SELECT @CurrentStatus = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @CurrentStatus NOT IN (1, 4)
        BEGIN
            THROW 50061, 'Solo se pueden eliminar expedientes en estado Borrador o Rechazado', 1;
        END
        
        -- Delete case file (CASCADE will delete related evidence, history, participants, attachments)
        DELETE FROM CaseFiles WHERE Id = @CaseFileId;
        
        COMMIT TRANSACTION;
        
        SELECT 1 AS Success, 'Expediente eliminado correctamente' AS Message;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_DeleteCaseFile created successfully!';


-- ========== SP: caseFiles\sp_GetAllCaseFiles.sql ==========
-- =============================================
-- Stored Procedure: sp_GetAllCaseFiles
-- Description: Gets all case files with pagination and filtering
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

IF OBJECT_ID('sp_GetAllCaseFiles', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetAllCaseFiles;
GO

CREATE PROCEDURE sp_GetAllCaseFiles
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @StatusId INT = NULL,
    @RegisteredById INT = NULL,
    @SearchTerm NVARCHAR(255) = NULL,
    @StartDate DATETIME2 = NULL,
    @EndDate DATETIME2 = NULL,
    @TotalRecords INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Calculate offset
        DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
        
        -- Get total count
        SELECT @TotalRecords = COUNT(*)
        FROM CaseFiles cf
        WHERE 
            (@StatusId IS NULL OR cf.StatusId = @StatusId)
            AND (@RegisteredById IS NULL OR cf.RegisteredById = @RegisteredById)
            AND (@SearchTerm IS NULL OR cf.CaseNumber LIKE '%' + @SearchTerm + '%' 
                OR cf.Title LIKE '%' + @SearchTerm + '%')
            AND (@StartDate IS NULL OR cf.RegisteredAt >= @StartDate)
            AND (@EndDate IS NULL OR cf.RegisteredAt <= @EndDate);
        
        -- Return paginated results
        SELECT 
            cf.Id,
            cf.CaseNumber,
            cf.Title,
            cf.Description,
            cf.IncidentDate,
            cf.IncidentLocation,
            cf.StatusId,
            s.Name AS StatusName,
            cf.RegisteredById,
            reg.FirstName + ' ' + reg.LastName AS RegisteredByName,
            cf.ReviewedById,
            CASE WHEN cf.ReviewedById IS NOT NULL 
                THEN rev.FirstName + ' ' + rev.LastName 
                ELSE NULL 
            END AS ReviewedByName,
            cf.RejectionReason,
            cf.RegisteredAt,
            cf.ReviewedAt,
            cf.ApprovedAt,
            (SELECT COUNT(*) FROM TraceEvidence WHERE CaseFileId = cf.Id) AS EvidenceCount
        FROM CaseFiles cf
        INNER JOIN CaseFileStatus s ON cf.StatusId = s.Id
        INNER JOIN Users reg ON cf.RegisteredById = reg.Id
        LEFT JOIN Users rev ON cf.ReviewedById = rev.Id
        WHERE 
            (@StatusId IS NULL OR cf.StatusId = @StatusId)
            AND (@RegisteredById IS NULL OR cf.RegisteredById = @RegisteredById)
            AND (@SearchTerm IS NULL OR cf.CaseNumber LIKE '%' + @SearchTerm + '%' 
                OR cf.Title LIKE '%' + @SearchTerm + '%')
            AND (@StartDate IS NULL OR cf.RegisteredAt >= @StartDate)
            AND (@EndDate IS NULL OR cf.RegisteredAt <= @EndDate)
        ORDER BY cf.RegisteredAt DESC
        OFFSET @Offset ROWS
        FETCH NEXT @PageSize ROWS ONLY;
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_GetAllCaseFiles created successfully!';


-- ========== SP: caseFiles\sp_GetCaseFileById.sql ==========
-- =============================================
-- Stored Procedure: sp_GetCaseFileById
-- Description: Gets a case file by ID with all details
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

IF OBJECT_ID('sp_GetCaseFileById', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetCaseFileById;
GO

CREATE PROCEDURE sp_GetCaseFileById
    @CaseFileId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Return case file details
        SELECT 
            cf.Id,
            cf.CaseNumber,
            cf.Title,
            cf.Description,
            cf.IncidentDate,
            cf.IncidentLocation,
            cf.StatusId,
            s.Name AS StatusName,
            cf.RegisteredById,
            reg.FirstName + ' ' + reg.LastName AS RegisteredByName,
            reg.Email AS RegisteredByEmail,
            cf.ReviewedById,
            CASE WHEN cf.ReviewedById IS NOT NULL 
                THEN rev.FirstName + ' ' + rev.LastName 
                ELSE NULL 
            END AS ReviewedByName,
            cf.RejectionReason,
            cf.RegisteredAt,
            cf.ReviewedAt,
            cf.ApprovedAt,
            cf.CreatedAt,
            cf.UpdatedAt,
            (SELECT COUNT(*) FROM TraceEvidence WHERE CaseFileId = cf.Id) AS EvidenceCount
        FROM CaseFiles cf
        INNER JOIN CaseFileStatus s ON cf.StatusId = s.Id
        INNER JOIN Users reg ON cf.RegisteredById = reg.Id
        LEFT JOIN Users rev ON cf.ReviewedById = rev.Id
        WHERE cf.Id = @CaseFileId;
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_GetCaseFileById created successfully!';


-- ========== SP: caseFiles\sp_RejectCaseFile.sql ==========
-- =============================================
-- Stored Procedure: sp_RejectCaseFile
-- Description: Rejects a case file by coordinator with reason
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

IF OBJECT_ID('sp_RejectCaseFile', 'P') IS NOT NULL
    DROP PROCEDURE sp_RejectCaseFile;
GO

CREATE PROCEDURE sp_RejectCaseFile
    @CaseFileId INT,
    @ReviewedById INT,
    @RejectionReason NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate rejection reason is provided
        IF @RejectionReason IS NULL OR LTRIM(RTRIM(@RejectionReason)) = ''
        BEGIN
            THROW 50050, 'Debe proporcionar una razón para el rechazo', 1;
        END
        
        -- Check if case file exists
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
        BEGIN
            THROW 50051, 'El expediente no existe', 1;
        END
        
        -- Validate current status is En Revisión (2)
        DECLARE @CurrentStatus INT;
        SELECT @CurrentStatus = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @CurrentStatus != 2
        BEGIN
            THROW 50052, 'Solo se pueden rechazar expedientes en estado En Revisión', 1;
        END
        
        -- Validate reviewer is a Coordinador (RoleId = 2)
        DECLARE @ReviewerRole INT;
        SELECT @ReviewerRole = RoleId FROM Users WHERE Id = @ReviewedById;
        
        IF @ReviewerRole != 2
        BEGIN
            THROW 50053, 'Solo los coordinadores pueden rechazar expedientes', 1;
        END
        
        -- Update to Rechazado (4)
        UPDATE CaseFiles 
        SET 
            StatusId = 4,
            ReviewedById = @ReviewedById,
            ReviewedAt = GETDATE(),
            RejectionReason = @RejectionReason,
            ApprovedAt = NULL,
            UpdatedAt = GETDATE()
        WHERE Id = @CaseFileId;
        
        -- Add to history
        INSERT INTO CaseFileHistory (CaseFileId, StatusId, ChangedById, Comments)
        VALUES (@CaseFileId, 4, @ReviewedById, @RejectionReason);
        
        COMMIT TRANSACTION;
        
        -- Return updated case file
        EXEC sp_GetCaseFileById @CaseFileId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_RejectCaseFile created successfully!';


-- ========== SP: caseFiles\sp_SubmitCaseFileForReview.sql ==========
-- =============================================
-- Stored Procedure: sp_SubmitCaseFileForReview
-- Description: Submits a case file for coordinator review
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

IF OBJECT_ID('sp_SubmitCaseFileForReview', 'P') IS NOT NULL
    DROP PROCEDURE sp_SubmitCaseFileForReview;
GO

CREATE PROCEDURE sp_SubmitCaseFileForReview
    @CaseFileId INT,
    @SubmittedById INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if case file exists
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
        BEGIN
            THROW 50030, 'El expediente no existe', 1;
        END
        
        -- Validate current status is Borrador (1)
        DECLARE @CurrentStatus INT;
        SELECT @CurrentStatus = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @CurrentStatus != 1
        BEGIN
            THROW 50031, 'Solo se pueden enviar a revisión expedientes en estado Borrador', 1;
        END
        
        -- Validate that case file has at least one evidence
        DECLARE @EvidenceCount INT;
        SELECT @EvidenceCount = COUNT(*) FROM TraceEvidence WHERE CaseFileId = @CaseFileId;
        
        IF @EvidenceCount = 0
        BEGIN
            THROW 50032, 'El expediente debe tener al menos un indicio para enviarse a revisión', 1;
        END
        
        -- Change status to En Revisión (2)
        UPDATE CaseFiles 
        SET 
            StatusId = 2,
            UpdatedAt = GETDATE()
        WHERE Id = @CaseFileId;
        
        -- Add to history
        INSERT INTO CaseFileHistory (CaseFileId, StatusId, ChangedById, Comments)
        VALUES (@CaseFileId, 2, @SubmittedById, 'Expediente enviado a revisión');
        
        COMMIT TRANSACTION;
        
        -- Return updated case file
        EXEC sp_GetCaseFileById @CaseFileId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_SubmitCaseFileForReview created successfully!';


-- ========== SP: caseFiles\sp_UpdateCaseFile.sql ==========
-- =============================================
-- Stored Procedure: sp_UpdateCaseFile
-- Description: Updates a case file (only in Borrador or Rechazado status)
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

IF OBJECT_ID('sp_UpdateCaseFile', 'P') IS NOT NULL
    DROP PROCEDURE sp_UpdateCaseFile;
GO

CREATE PROCEDURE sp_UpdateCaseFile
    @CaseFileId INT,
    @Title NVARCHAR(255) = NULL,
    @Description NVARCHAR(MAX) = NULL,
    @IncidentDate DATETIME2 = NULL,
    @IncidentLocation NVARCHAR(500) = NULL,
    @UpdatedById INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if case file exists
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
        BEGIN
            THROW 50020, 'El expediente no existe', 1;
        END
        
        -- Check if status allows editing (only Borrador=1 or Rechazado=4)
        DECLARE @CurrentStatus INT;
        SELECT @CurrentStatus = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @CurrentStatus NOT IN (1, 4)
        BEGIN
            THROW 50021, 'Solo se pueden editar expedientes en estado Borrador o Rechazado', 1;
        END
        
        -- Update case file
        UPDATE CaseFiles
        SET 
            Title = ISNULL(@Title, Title),
            Description = ISNULL(@Description, Description),
            IncidentDate = ISNULL(@IncidentDate, IncidentDate),
            IncidentLocation = ISNULL(@IncidentLocation, IncidentLocation),
            StatusId = 1, -- Reset to Borrador if was Rechazado
            RejectionReason = NULL, -- Clear rejection reason
            UpdatedAt = GETDATE()
        WHERE Id = @CaseFileId;
        
        -- Add to history
        INSERT INTO CaseFileHistory (CaseFileId, StatusId, ChangedById, Comments)
        VALUES (@CaseFileId, 1, @UpdatedById, 'Expediente actualizado');
        
        COMMIT TRANSACTION;
        
        -- Return updated case file
        EXEC sp_GetCaseFileById @CaseFileId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_UpdateCaseFile created successfully!';


-- ========== SP: traceEvidence\sp_AddTraceEvidence.sql ==========
-- =============================================
-- Stored Procedure: sp_AddTraceEvidence
-- Description: Agrega un indicio a un expediente
-- Author: Carmelo Mayén
-- Date: 2025-11-21
-- =============================================

IF OBJECT_ID('sp_AddTraceEvidence', 'P') IS NOT NULL
	DROP PROCEDURE sp_AddTraceEvidence;
GO

CREATE PROCEDURE sp_AddTraceEvidence
	@CaseFileId INT,
	@EvidenceNumber NVARCHAR(50),
	@Description NVARCHAR(MAX),
	@TraceEvidenceTypeId INT,
	@Color NVARCHAR(50) = NULL,
	@Size NVARCHAR(100) = NULL,
	@Weight DECIMAL(10,2) = NULL,
	@Location NVARCHAR(500) = NULL,
	@StorageLocation NVARCHAR(255) = NULL,
	@CollectedById INT,
	@NewEvidenceId INT OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		BEGIN TRANSACTION;
		IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
		BEGIN
			THROW 50070, 'El expediente no existe', 1;
		END
		DECLARE @StatusId INT;
		SELECT @StatusId = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
		IF @StatusId != 1
		BEGIN
			THROW 50071, 'Solo se pueden agregar indicios a expedientes en estado Borrador', 1;
		END
		IF NOT EXISTS (SELECT 1 FROM TraceEvidenceTypes WHERE Id = @TraceEvidenceTypeId)
		BEGIN
			THROW 50072, 'El tipo de indicio no existe', 1;
		END
		IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @CollectedById AND IsActive = 1)
		BEGIN
			THROW 50073, 'El usuario no existe o está inactivo', 1;
		END
		IF EXISTS (SELECT 1 FROM TraceEvidence WHERE CaseFileId = @CaseFileId AND EvidenceNumber = @EvidenceNumber)
		BEGIN
			THROW 50074, 'El número de indicio ya existe en este expediente', 1;
		END
		INSERT INTO TraceEvidence (
			CaseFileId, EvidenceNumber, Description, TraceEvidenceTypeId,
			Color, Size, Weight, Location, StorageLocation, CollectedById
		)
		VALUES (
			@CaseFileId, @EvidenceNumber, @Description, @TraceEvidenceTypeId,
			@Color, @Size, @Weight, @Location, @StorageLocation, @CollectedById
		);
		SET @NewEvidenceId = SCOPE_IDENTITY();
		COMMIT TRANSACTION;
		SELECT 
			e.Id,
			e.CaseFileId,
			e.EvidenceNumber,
			e.Description,
			e.TraceEvidenceTypeId,
			et.Name AS EvidenceTypeName,
			e.Color,
			e.Size,
			e.Weight,
			e.Location,
			e.StorageLocation,
			e.CollectedById,
			u.FirstName + ' ' + u.LastName AS CollectedByName,
			e.CollectedAt,
			e.CreatedAt,
			e.UpdatedAt
		FROM TraceEvidence e
		INNER JOIN TraceEvidenceTypes et ON e.TraceEvidenceTypeId = et.Id
		INNER JOIN Users u ON e.CollectedById = u.Id
		WHERE e.Id = @NewEvidenceId;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
		DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
		DECLARE @ErrorState INT = ERROR_STATE();
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH
END;
GO

PRINT 'Stored Procedure sp_AddTraceEvidence created successfully!';


-- ========== SP: traceEvidence\sp_GetAllTraceEvidence.sql ==========
-- =============================================
-- Stored Procedure: sp_GetAllTraceEvidence
-- Description: Obtiene todos los indicios de todos los expedientes con paginación
-- Author: Carmelo Mayén
-- Date: 2025-11-21
-- =============================================

IF OBJECT_ID('sp_GetAllTraceEvidence', 'P') IS NOT NULL
	DROP PROCEDURE sp_GetAllTraceEvidence;
GO

CREATE PROCEDURE sp_GetAllTraceEvidence
	@PageNumber INT = 1,
	@PageSize INT = 10,
	@Search NVARCHAR(200) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
		DECLARE @TotalCount INT;
		SELECT @TotalCount = COUNT(*)
		FROM TraceEvidence e
		WHERE (@Search IS NULL 
			OR e.EvidenceNumber LIKE '%' + @Search + '%'
			OR e.Description LIKE '%' + @Search + '%');
		SELECT 
			e.Id AS TraceEvidenceId,
			e.CaseFileId,
			cf.CaseNumber AS CaseFileNumber,
			e.EvidenceNumber,
			e.Description,
			e.TraceEvidenceTypeId,
			et.Name AS TraceEvidenceTypeName,
			e.Color,
			e.Size,
			e.Weight,
			e.Location,
			e.StorageLocation,
			e.CollectedById,
			u.FirstName + ' ' + u.LastName AS CollectedByName,
			e.CollectedAt,
			e.CreatedAt,
			e.UpdatedAt,
			@TotalCount AS TotalCount
		FROM TraceEvidence e
		INNER JOIN CaseFiles cf ON e.CaseFileId = cf.Id
		INNER JOIN TraceEvidenceTypes et ON e.TraceEvidenceTypeId = et.Id
		INNER JOIN Users u ON e.CollectedById = u.Id
		WHERE (@Search IS NULL 
			OR e.EvidenceNumber LIKE '%' + @Search + '%'
			OR e.Description LIKE '%' + @Search + '%'
			OR cf.CaseNumber LIKE '%' + @Search + '%')
		ORDER BY e.CreatedAt DESC
		OFFSET @Offset ROWS
		FETCH NEXT @PageSize ROWS ONLY;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
		DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
		DECLARE @ErrorState INT = ERROR_STATE();
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH
END;
GO

PRINT 'Stored Procedure sp_GetAllTraceEvidence created successfully!';


-- ========== SP: traceEvidence\sp_GetTraceEvidenceByCaseFile.sql ==========
-- =============================================
-- Stored Procedure: sp_GetTraceEvidenceByCaseFile
-- Description: Obtiene todos los indicios de un expediente específico
-- Author: Carmelo Mayén
-- Date: 2025-11-21
-- =============================================

IF OBJECT_ID('sp_GetTraceEvidenceByCaseFile', 'P') IS NOT NULL
	DROP PROCEDURE sp_GetTraceEvidenceByCaseFile;
GO

CREATE PROCEDURE sp_GetTraceEvidenceByCaseFile
	@CaseFileId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		SELECT 
			e.Id AS TraceEvidenceId,
			e.CaseFileId,
			e.EvidenceNumber,
			e.Description,
			e.TraceEvidenceTypeId,
			et.Name AS TraceEvidenceTypeName,
			e.Color,
			e.Size,
			e.Weight,
			e.Location,
			e.StorageLocation,
			e.CollectedById AS CollectedBy,
			u.FirstName + ' ' + u.LastName AS CollectedByName,
			e.CollectedAt,
			e.CreatedAt,
			e.UpdatedAt
		FROM TraceEvidence e
		INNER JOIN TraceEvidenceTypes et ON e.TraceEvidenceTypeId = et.Id
		INNER JOIN Users u ON e.CollectedById = u.Id
		WHERE e.CaseFileId = @CaseFileId
		ORDER BY e.EvidenceNumber;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
		DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
		DECLARE @ErrorState INT = ERROR_STATE();
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH
END;
GO

PRINT 'Stored Procedure sp_GetTraceEvidenceByCaseFile created successfully!';


-- =============================================
-- INITIALIZATION COMPLETE
-- =============================================
PRINT '';
PRINT '============================================='
PRINT '  Database Initialization Complete';
PRINT '============================================='
PRINT 'Database: EvidenceManagementDB';
PRINT 'Admin Email: admin@evidence.com';
PRINT 'Admin Password: Admin@123';
PRINT '============================================='
GO