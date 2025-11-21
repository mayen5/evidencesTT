-- =============================================
-- Script: Create All Tables
-- Description: Creates all tables for Evidence Management System
-- Author: Carmelo Mayén
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

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
