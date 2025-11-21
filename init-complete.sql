-- ============================================
-- Script de Inicialización Completa
-- Sistema de Gestión de Evidencias
-- ============================================

PRINT 'Iniciando creacion de base de datos...'
GO

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EvidenceManagementDB')
BEGIN
    CREATE DATABASE EvidenceManagementDB;
    PRINT 'Base de datos EvidenceManagementDB creada.';
END
ELSE
BEGIN
    PRINT 'Base de datos EvidenceManagementDB ya existe.';
END
GO

USE EvidenceManagementDB;
GO

PRINT 'Usando base de datos EvidenceManagementDB';
GO

-- ============================================
-- DDL: TABLAS
-- ============================================
PRINT 'Ejecutando DDL: Creando tablas...';
GO

-- Tabla: Roles
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Roles')
BEGIN
    CREATE TABLE Roles (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(50) NOT NULL UNIQUE,
        Descripcion NVARCHAR(200),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE()
    );
    PRINT '  - Tabla Roles creada';
END
GO

-- Tabla: CaseFileStatus
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CaseFileStatus')
BEGIN
    CREATE TABLE CaseFileStatus (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(50) NOT NULL UNIQUE,
        Descripcion NVARCHAR(200),
        CreatedAt DATETIME2 DEFAULT GETDATE()
    );
    PRINT '  - Tabla CaseFileStatus creada';
END
GO

-- Tabla: Users
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Username NVARCHAR(100) NOT NULL UNIQUE,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        FirstName NVARCHAR(100) NOT NULL,
        LastName NVARCHAR(100) NOT NULL,
        RoleId INT NOT NULL,
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id)
    );
    PRINT '  - Tabla Users creada';
END
GO

-- Tabla: TiposIndicio
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TiposIndicio')
BEGIN
    CREATE TABLE TiposIndicio (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL UNIQUE,
        Descripcion NVARCHAR(300),
        CreatedAt DATETIME2 DEFAULT GETDATE()
    );
    PRINT '  - Tabla TiposIndicio creada';
END
GO

-- Tabla: CaseFiles
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CaseFiles')
BEGIN
    CREATE TABLE CaseFiles (
        Id INT PRIMARY KEY IDENTITY(1,1),
        CaseNumber NVARCHAR(50) NOT NULL UNIQUE,
        Title NVARCHAR(200) NOT NULL,
        Descripcion NVARCHAR(MAX),
        StatusId INT NOT NULL,
        CreatedById INT NOT NULL,
        AssignedToId INT,
        Priority INT DEFAULT 2,
        IncidentDate DATETIME2,
        Ubicacion NVARCHAR(300),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_CaseFiles_Status FOREIGN KEY (StatusId) REFERENCES CaseFileStatus(Id),
        CONSTRAINT FK_CaseFiles_CreatedBy FOREIGN KEY (CreatedById) REFERENCES Users(Id),
        CONSTRAINT FK_CaseFiles_AssignedTo FOREIGN KEY (AssignedToId) REFERENCES Users(Id),
        CONSTRAINT CHK_Priority CHECK (Priority BETWEEN 1 AND 5)
    );
    PRINT '  - Tabla CaseFiles creada';
END
GO

-- Tabla: Indicios
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Indicios')
BEGIN
    CREATE TABLE Indicios (
        Id INT PRIMARY KEY IDENTITY(1,1),
        CaseFileId INT NOT NULL,
        TipoIndicioId INT NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Descripcion NVARCHAR(MAX),
        CollectionDate DATETIME2 NOT NULL,
        CollectionUbicacion NVARCHAR(300),
        RecolectadoPorId INT NOT NULL,
        ChainOfCustody NVARCHAR(MAX),
        StorageUbicacion NVARCHAR(200),
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_Evidence_CaseFile FOREIGN KEY (CaseFileId) REFERENCES CaseFiles(Id) ON DELETE CASCADE,
        CONSTRAINT FK_Evidence_Type FOREIGN KEY (TipoIndicioId) REFERENCES TiposIndicio(Id),
        CONSTRAINT FK_Evidence_Collector FOREIGN KEY (RecolectadoPorId) REFERENCES Users(Id)
    );
    PRINT '  - Tabla Indicios creada';
END
GO

-- Tabla: CaseFileHistory
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CaseFileHistory')
BEGIN
    CREATE TABLE CaseFileHistory (
        Id INT PRIMARY KEY IDENTITY(1,1),
        CaseFileId INT NOT NULL,
        ChangedById INT NOT NULL,
        ChangeType NVARCHAR(50) NOT NULL,
        OldValue NVARCHAR(MAX),
        NewValue NVARCHAR(MAX),
        Comments NVARCHAR(500),
        ChangedAt DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_History_CaseFile FOREIGN KEY (CaseFileId) REFERENCES CaseFiles(Id) ON DELETE CASCADE,
        CONSTRAINT FK_History_User FOREIGN KEY (ChangedById) REFERENCES Users(Id)
    );
    PRINT '  - Tabla CaseFileHistory creada';
END
GO

-- Tabla: Attachments
GO

-- Tabla: CaseFileParticipants
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CaseFileParticipants')
BEGIN
    CREATE TABLE CaseFileParticipants (
        Id INT PRIMARY KEY IDENTITY(1,1),
        CaseFileId INT NOT NULL,
        UserId INT NOT NULL,
        Role NVARCHAR(100),
        AssignedAt DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_Participants_CaseFile FOREIGN KEY (CaseFileId) REFERENCES CaseFiles(Id) ON DELETE CASCADE,
        CONSTRAINT FK_Participants_User FOREIGN KEY (UserId) REFERENCES Users(Id),
        CONSTRAINT UQ_CaseFile_User UNIQUE (CaseFileId, UserId)
    );
    PRINT '  - Tabla CaseFileParticipants creada';
END
GO

-- Tabla: Attachments
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Attachments')
BEGIN
    CREATE TABLE Attachments (
        Id INT PRIMARY KEY IDENTITY(1,1),
        CaseFileId INT,
        EvidenceId INT,
        FileName NVARCHAR(255) NOT NULL,
        FilePath NVARCHAR(500) NOT NULL,
        FileTamano BIGINT,
        FileType NVARCHAR(100),
        UploadedById INT NOT NULL,
        UploadedAt DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_Attachments_CaseFile FOREIGN KEY (CaseFileId) REFERENCES CaseFiles(Id) ON DELETE CASCADE,
        CONSTRAINT FK_Attachments_Indicios FOREIGN KEY (EvidenceId) REFERENCES Indicios(Id),
        CONSTRAINT FK_Attachments_Uploader FOREIGN KEY (UploadedById) REFERENCES Users(Id),
        CONSTRAINT CHK_Attachment_Reference CHECK ((CaseFileId IS NOT NULL AND EvidenceId IS NULL) OR (CaseFileId IS NULL AND EvidenceId IS NOT NULL))
    );
    PRINT '  - Tabla Attachments creada';
END
GO

-- ============================================
-- ÍNDICES
-- ============================================
PRINT 'Creando indices...';
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email')
    CREATE INDEX IX_Users_Email ON Users(Email);
    
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_RoleId')
    CREATE INDEX IX_Users_RoleId ON Users(RoleId);
    
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CaseFiles_CaseNumber')
    CREATE INDEX IX_CaseFiles_CaseNumber ON CaseFiles(CaseNumber);
    
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CaseFiles_StatusId')
    CREATE INDEX IX_CaseFiles_StatusId ON CaseFiles(StatusId);
    
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Evidence_CaseFileId')
    CREATE INDEX IX_Evidence_CaseFileId ON Indicios(CaseFileId);

PRINT 'Indices creados.';
GO

-- ============================================
-- DML: DATOS INICIALES
-- ============================================
PRINT 'Insertando datos iniciales...';
GO

-- Roles
IF NOT EXISTS (SELECT * FROM Roles WHERE Id = 1)
BEGIN
    SET IDENTITY_INSERT Roles ON;
    INSERT INTO Roles (Id, Name, Descripcion) VALUES
    (1, 'Administrador', 'Control total del sistema'),
    (2, 'Coordinador', 'Gestiona casos y equipos'),
    (3, 'Tecnico', 'Recolecta y analiza evidencias'),
    (4, 'Visualizador', 'Solo lectura de casos');
    SET IDENTITY_INSERT Roles OFF;
    PRINT '  - Roles insertados';
END
GO

-- Status
IF NOT EXISTS (SELECT * FROM CaseFileStatus WHERE Id = 1)
BEGIN
    SET IDENTITY_INSERT CaseFileStatus ON;
    INSERT INTO CaseFileStatus (Id, Name, Descripcion) VALUES
    (1, 'Borrador', 'Caso en creacion'),
    (2, 'En Revision', 'Esperando aprobacion'),
    (3, 'Aprobado', 'Caso aprobado y activo'),
    (4, 'Rechazado', 'Caso rechazado');
    SET IDENTITY_INSERT CaseFileStatus OFF;
    PRINT '  - Status insertados';
END
GO

-- Indicios Types
IF NOT EXISTS (SELECT * FROM TiposIndicio WHERE Id = 1)
BEGIN
    SET IDENTITY_INSERT TiposIndicio ON;
    INSERT INTO TiposIndicio (Id, Name, Descripcion) VALUES
    (1, 'Documento Digital', 'Archivos, PDFs, documentos escaneados'),
    (2, 'Fotografia', 'Imagenes y fotografias digitales'),
    (3, 'Video', 'Grabaciones de video'),
    (4, 'Audio', 'Grabaciones de audio'),
    (5, 'Objeto Fisico', 'Evidencia fisica catalogada'),
    (6, 'Testimonio', 'Declaraciones y testimonios'),
    (7, 'Correo Electronico', 'Comunicaciones por email'),
    (8, 'Mensaje de Texto', 'SMS y mensajeria instantanea'),
    (9, 'Registro Digital', 'Logs, registros de sistema'),
    (10, 'Huella Digital', 'Huellas dactilares'),
    (11, 'ADN', 'Muestras biologicas'),
    (12, 'Arma', 'Armas de fuego o blancas'),
    (13, 'Otro', 'Otros tipos de evidencia');
    SET IDENTITY_INSERT TiposIndicio OFF;
    PRINT '  - Indicios Types insertados';
END
GO

-- Usuario Admin
IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'admin@Indicios.com')
BEGIN
    INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, RoleId, IsActive)
    VALUES ('admin', 'admin@Indicios.com', '$2b$10$9/sa9f1WkS/13ZqJBWoJ2ecyguiTVrEsU8dB/h3krHG9TfSGUGTiC', 'Admin', 'System', 1, 1);
    PRINT '  - Usuario admin creado (Email: admin@Indicios.com, Password: Admin@123)';
END
GO

PRINT 'Datos iniciales insertados.';
GO

-- ============================================
-- STORED PROCEDURES
-- ============================================
PRINT 'Creando Stored Procedures...';
GO

-- sp_AuthenticateUser
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_AuthenticateUser')
    DROP PROCEDURE sp_AuthenticateUser;
GO

CREATE PROCEDURE sp_AuthenticateUser
    @Email NVARCHAR(255)
AS
BEGIN
    SELECT 
        u.Id, u.Username, u.Email, u.PasswordHash, u.FirstName, u.LastName,
        u.RoleId, r.Name as RoleName, u.IsActive, u.CreatedAt, u.UpdatedAt
    FROM Users u
    INNER JOIN Roles r ON u.RoleId = r.Id
    WHERE u.Email = @Email AND u.IsActive = 1;
END
GO
PRINT '  - sp_AuthenticateUser creado';
GO

-- sp_RegisterUser
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_RegisterUser')
    DROP PROCEDURE sp_RegisterUser;
GO

CREATE PROCEDURE sp_RegisterUser
    @Username NVARCHAR(100),
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @RoleId INT = 3,
    @NewUserId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
        BEGIN
            RAISERROR('Email already exists', 16, 1);
            RETURN;
        END
        
        IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
        BEGIN
            RAISERROR('Username already exists', 16, 1);
            RETURN;
        END
        
        INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, RoleId, IsActive)
        VALUES (@Username, @Email, @PasswordHash, @FirstName, @LastName, @RoleId, 1);
        
        SET @NewUserId = SCOPE_IDENTITY();
        
        SELECT 
            u.Id, u.Username, u.Email, u.FirstName, u.LastName,
            u.RoleId, r.Name as RoleName, u.IsActive, u.CreatedAt
        FROM Users u
        INNER JOIN Roles r ON u.RoleId = r.Id
        WHERE u.Id = @NewUserId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
PRINT '  - sp_RegisterUser creado';
GO

-- sp_CreateCaseFile
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateCaseFile')
    DROP PROCEDURE sp_CreateCaseFile;
GO

CREATE PROCEDURE sp_CreateCaseFile
    @CaseNumber NVARCHAR(50),
    @Title NVARCHAR(200),
    @Descripcion NVARCHAR(MAX) = NULL,
    @IncidentDate DATETIME2 = NULL,
    @Ubicacion NVARCHAR(300) = NULL,
    @CreatedById INT,
    @Priority INT = 2,
    @NewCaseFileId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @CreatedById AND IsActive = 1)
            THROW 50010, 'Usuario no existe o inactivo', 1;
        
        IF EXISTS (SELECT 1 FROM CaseFiles WHERE CaseNumber = @CaseNumber)
            THROW 50011, 'Numero de expediente ya existe', 1;
        
        INSERT INTO CaseFiles (CaseNumber, Title, Descripcion, StatusId, CreatedById, 
                              Priority, IncidentDate, Ubicacion)
        VALUES (@CaseNumber, @Title, @Descripcion, 1, @CreatedById, @Priority, @IncidentDate, @Ubicacion);
        
        SET @NewCaseFileId = SCOPE_IDENTITY();
        
        INSERT INTO CaseFileHistory (CaseFileId, ChangedById, ChangeType, NewValue, Comments)
        VALUES (@NewCaseFileId, @CreatedById, 'CREATE', 'Borrador', 'Expediente creado');
        
        COMMIT TRANSACTION;
        
        SELECT cf.*, s.Name AS StatusName, u.FirstName + ' ' + u.LastName AS CreatedByName
        FROM CaseFiles cf
        INNER JOIN CaseFileStatus s ON cf.StatusId = s.Id
        INNER JOIN Users u ON cf.CreatedById = u.Id
        WHERE cf.Id = @NewCaseFileId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
PRINT '  - sp_CreateCaseFile creado';
GO

-- sp_GetCaseFileById
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetCaseFileById')
    DROP PROCEDURE sp_GetCaseFileById;
GO

CREATE PROCEDURE sp_GetCaseFileById
    @CaseFileId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        cf.Id, cf.CaseNumber, cf.Title, cf.Descripcion, cf.StatusId, s.Name AS StatusName,
        cf.CreatedById, u1.FirstName + ' ' + u1.LastName AS CreatedByName,
        cf.AssignedToId, 
        CASE WHEN cf.AssignedToId IS NOT NULL THEN u2.FirstName + ' ' + u2.LastName ELSE NULL END AS AssignedToName,
        cf.Priority, cf.IncidentDate, cf.Ubicacion, cf.CreatedAt, cf.UpdatedAt,
        (SELECT COUNT(*) FROM Indicios WHERE CaseFileId = cf.Id) AS EvidenceCount
    FROM CaseFiles cf
    INNER JOIN CaseFileStatus s ON cf.StatusId = s.Id
    INNER JOIN Users u1 ON cf.CreatedById = u1.Id
    LEFT JOIN Users u2 ON cf.AssignedToId = u2.Id
    WHERE cf.Id = @CaseFileId;
END
GO
PRINT '  - sp_GetCaseFileById creado';
GO

-- sp_GetAllCaseFiles
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllCaseFiles')
    DROP PROCEDURE sp_GetAllCaseFiles;
GO

CREATE PROCEDURE sp_GetAllCaseFiles
    @Page INT = 1,
    @PageTamano INT = 10,
    @StatusId INT = NULL,
    @UserId INT = NULL,
    @SearchTerm NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Offset INT = (@Page - 1) * @PageTamano;
    DECLARE @TotalRecords INT;
    
    -- Get total count
    SELECT @TotalRecords = COUNT(*)
    FROM CaseFiles cf
    WHERE (@StatusId IS NULL OR cf.StatusId = @StatusId)
      AND (@UserId IS NULL OR cf.CreatedById = @UserId)
      AND (@SearchTerm IS NULL OR cf.CaseNumber LIKE '%' + @SearchTerm + '%' OR cf.Title LIKE '%' + @SearchTerm + '%');
    
    -- Return case files (first recordset)
    SELECT 
        cf.Id AS CaseFileId,
        cf.CaseNumber,
        cf.Title,
        cf.Descripcion,
        cf.StatusId,
        s.Name AS StatusName,
        cf.Ubicacion,
        cf.IncidentDate,
        cf.CreatedById AS CreatedBy,
        u.FirstName + ' ' + u.LastName AS CreatedByName,
        cf.CreatedAt,
        cf.UpdatedAt,
        NULL AS ApprovedBy,
        NULL AS ApprovedAt,
        (SELECT COUNT(*) FROM Indicios WHERE CaseFileId = cf.Id) AS EvidenceCount
    FROM CaseFiles cf
    INNER JOIN CaseFileStatus s ON cf.StatusId = s.Id
    INNER JOIN Users u ON cf.CreatedById = u.Id
    WHERE (@StatusId IS NULL OR cf.StatusId = @StatusId)
      AND (@UserId IS NULL OR cf.CreatedById = @UserId)
      AND (@SearchTerm IS NULL OR cf.CaseNumber LIKE '%' + @SearchTerm + '%' OR cf.Title LIKE '%' + @SearchTerm + '%')
    ORDER BY cf.CreatedAt DESC
    OFFSET @Offset ROWS FETCH NEXT @PageTamano ROWS ONLY;
    
    -- Return total count (second recordset)
    SELECT @TotalRecords AS TotalRecords;
END
GO
PRINT '  - sp_GetAllCaseFiles creado';
GO

-- sp_UpdateCaseFile
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateCaseFile')
    DROP PROCEDURE sp_UpdateCaseFile;
GO

CREATE PROCEDURE sp_UpdateCaseFile
    @CaseFileId INT,
    @Title NVARCHAR(200) = NULL,
    @Descripcion NVARCHAR(MAX) = NULL,
    @IncidentDate DATETIME2 = NULL,
    @Ubicacion NVARCHAR(300) = NULL,
    @Priority INT = NULL,
    @UpdatedById INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
            THROW 50020, 'Expediente no existe', 1;
        
        DECLARE @CurrentStatus INT;
        SELECT @CurrentStatus = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @CurrentStatus NOT IN (1, 4)
            THROW 50021, 'Solo se pueden editar expedientes en Borrador o Rechazado', 1;
        
        UPDATE CaseFiles SET 
            Title = ISNULL(@Title, Title),
            Descripcion = ISNULL(@Descripcion, Descripcion),
            IncidentDate = ISNULL(@IncidentDate, IncidentDate),
            Ubicacion = ISNULL(@Ubicacion, Ubicacion),
            Priority = ISNULL(@Priority, Priority),
            UpdatedAt = GETDATE()
        WHERE Id = @CaseFileId;
        
        INSERT INTO CaseFileHistory (CaseFileId, ChangedById, ChangeType, Comments)
        VALUES (@CaseFileId, @UpdatedById, 'UPDATE', 'Expediente actualizado');
        
        COMMIT TRANSACTION;
        EXEC sp_GetCaseFileById @CaseFileId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
PRINT '  - sp_UpdateCaseFile creado';
GO

-- sp_SubmitCaseFileForReview
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_SubmitCaseFileForReview')
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
        
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
            THROW 50030, 'Expediente no existe', 1;
        
        DECLARE @CurrentStatus INT;
        SELECT @CurrentStatus = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @CurrentStatus != 1
            THROW 50031, 'Solo expedientes en Borrador pueden enviarse a revision', 1;
        
        DECLARE @EvidenceCount INT;
        SELECT @EvidenceCount = COUNT(*) FROM Indicios WHERE CaseFileId = @CaseFileId;
        
        IF @EvidenceCount = 0
            THROW 50032, 'Debe tener al menos una evidencia', 1;
        
        UPDATE CaseFiles SET StatusId = 2, UpdatedAt = GETDATE() WHERE Id = @CaseFileId;
        
        INSERT INTO CaseFileHistory (CaseFileId, ChangedById, ChangeType, NewValue, Comments)
        VALUES (@CaseFileId, @SubmittedById, 'STATUS_CHANGE', 'En Revision', 'Enviado a revision');
        
        COMMIT TRANSACTION;
        EXEC sp_GetCaseFileById @CaseFileId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
PRINT '  - sp_SubmitCaseFileForReview creado';
GO

-- sp_ApproveCaseFile
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ApproveCaseFile')
    DROP PROCEDURE sp_ApproveCaseFile;
GO

CREATE PROCEDURE sp_ApproveCaseFile
    @CaseFileId INT,
    @ApprovedById INT,
    @Comments NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
            THROW 50040, 'Expediente no existe', 1;
        
        DECLARE @CurrentStatus INT;
        SELECT @CurrentStatus = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @CurrentStatus != 2
            THROW 50041, 'Solo expedientes En Revision pueden aprobarse', 1;
        
        DECLARE @ReviewerRole INT;
        SELECT @ReviewerRole = RoleId FROM Users WHERE Id = @ApprovedById;
        
        IF @ReviewerRole NOT IN (1, 2)
            THROW 50042, 'Solo Admin o Coordinador pueden aprobar', 1;
        
        UPDATE CaseFiles SET StatusId = 3, UpdatedAt = GETDATE() WHERE Id = @CaseFileId;
        
        INSERT INTO CaseFileHistory (CaseFileId, ChangedById, ChangeType, NewValue, Comments)
        VALUES (@CaseFileId, @ApprovedById, 'STATUS_CHANGE', 'Aprobado', ISNULL(@Comments, 'Aprobado'));
        
        COMMIT TRANSACTION;
        EXEC sp_GetCaseFileById @CaseFileId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
PRINT '  - sp_ApproveCaseFile creado';
GO

-- sp_RejectCaseFile
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_RejectCaseFile')
    DROP PROCEDURE sp_RejectCaseFile;
GO

CREATE PROCEDURE sp_RejectCaseFile
    @CaseFileId INT,
    @RejectedById INT,
    @RejectionReason NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF @RejectionReason IS NULL OR LTRIM(RTRIM(@RejectionReason)) = ''
            THROW 50050, 'Debe proporcionar razon de rechazo', 1;
        
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
            THROW 50051, 'Expediente no existe', 1;
        
        DECLARE @CurrentStatus INT;
        SELECT @CurrentStatus = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @CurrentStatus != 2
            THROW 50052, 'Solo expedientes En Revision pueden rechazarse', 1;
        
        DECLARE @ReviewerRole INT;
        SELECT @ReviewerRole = RoleId FROM Users WHERE Id = @RejectedById;
        
        IF @ReviewerRole NOT IN (1, 2)
            THROW 50053, 'Solo Admin o Coordinador pueden rechazar', 1;
        
        UPDATE CaseFiles SET StatusId = 4, UpdatedAt = GETDATE() WHERE Id = @CaseFileId;
        
        INSERT INTO CaseFileHistory (CaseFileId, ChangedById, ChangeType, NewValue, Comments)
        VALUES (@CaseFileId, @RejectedById, 'STATUS_CHANGE', 'Rechazado', @RejectionReason);
        
        COMMIT TRANSACTION;
        EXEC sp_GetCaseFileById @CaseFileId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
PRINT '  - sp_RejectCaseFile creado';
GO

-- sp_DeleteCaseFile
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteCaseFile')
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
        
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
            THROW 50060, 'Expediente no existe', 1;
        
        DECLARE @CurrentStatus INT;
        SELECT @CurrentStatus = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @CurrentStatus NOT IN (1, 4)
            THROW 50061, 'Solo expedientes Borrador o Rechazado pueden eliminarse', 1;
        
        DELETE FROM CaseFiles WHERE Id = @CaseFileId;
        
        COMMIT TRANSACTION;
        SELECT 1 AS Success, 'Expediente eliminado' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
PRINT '  - sp_DeleteCaseFile creado';
GO

-- sp_AddIndicios
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_AddIndicios')
    DROP PROCEDURE sp_AddIndicios;
GO

CREATE PROCEDURE sp_AddIndicios
    @CaseFileId INT,
    @TipoIndicioId INT,
    @Title NVARCHAR(200),
    @Descripcion NVARCHAR(MAX),
    @CollectionDate DATETIME2,
    @CollectionUbicacion NVARCHAR(300) = NULL,
    @RecolectadoPorId INT,
    @StorageUbicacion NVARCHAR(200) = NULL,
    @ChainOfCustody NVARCHAR(MAX) = NULL,
    @NewEvidenceId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
            THROW 50070, 'Expediente no existe', 1;
        
        DECLARE @StatusId INT;
        SELECT @StatusId = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @StatusId != 1
            THROW 50071, 'Solo se puede agregar evidencia a expedientes en Borrador', 1;
        
        IF NOT EXISTS (SELECT 1 FROM TiposIndicio WHERE Id = @TipoIndicioId)
            THROW 50072, 'Tipo de evidencia no existe', 1;
        
        IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @RecolectadoPorId AND IsActive = 1)
            THROW 50073, 'Usuario no existe o inactivo', 1;
        
        INSERT INTO Indicios (CaseFileId, TipoIndicioId, Title, Descripcion, CollectionDate, 
                             CollectionUbicacion, RecolectadoPorId, StorageUbicacion, ChainOfCustody)
        VALUES (@CaseFileId, @TipoIndicioId, @Title, @Descripcion, @CollectionDate,
                @CollectionUbicacion, @RecolectadoPorId, @StorageUbicacion, @ChainOfCustody);
        
        SET @NewEvidenceId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        
        SELECT e.*, et.Name AS EvidenceTypeName, u.FirstName + ' ' + u.LastName AS CollectedByName
        FROM Indicios e
        INNER JOIN TiposIndicio et ON e.TipoIndicioId = et.Id
        INNER JOIN Users u ON e.RecolectadoPorId = u.Id
        WHERE e.Id = @NewEvidenceId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
PRINT '  - sp_AddIndicios creado';
GO

-- sp_GetEvidenceByCaseFile
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetEvidenceByCaseFile')
    DROP PROCEDURE sp_GetEvidenceByCaseFile;
GO

CREATE PROCEDURE sp_GetEvidenceByCaseFile
    @CaseFileId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        e.Id, e.CaseFileId, e.TipoIndicioId, et.Name AS EvidenceTypeName,
        e.Title, e.Descripcion, e.CollectionDate, e.CollectionUbicacion,
        e.RecolectadoPorId, u.FirstName + ' ' + u.LastName AS CollectedByName,
        e.StorageUbicacion, e.ChainOfCustody, e.IsActive,
        e.CreatedAt, e.UpdatedAt
    FROM Indicios e
    INNER JOIN TiposIndicio et ON e.TipoIndicioId = et.Id
    INNER JOIN Users u ON e.RecolectadoPorId = u.Id
    WHERE e.CaseFileId = @CaseFileId
    ORDER BY e.CreatedAt DESC;
END
GO
PRINT '  - sp_GetEvidenceByCaseFile creado';
GO

-- sp_GetCaseFileHistory
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetCaseFileHistory')
    DROP PROCEDURE sp_GetCaseFileHistory;
GO

CREATE PROCEDURE sp_GetCaseFileHistory
    @CaseFileId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        h.Id,
        h.CaseFileId,
        h.ChangedById,
        u.Username as ChangedByUsername,
        u.FirstName as ChangedByFirstName,
        u.LastName as ChangedByLastName,
        h.ChangeType,
        h.OldValue,
        h.NewValue,
        h.Comments,
        h.ChangedAt
    FROM CaseFileHistory h
    INNER JOIN Users u ON h.ChangedById = u.Id
    WHERE h.CaseFileId = @CaseFileId
    ORDER BY h.ChangedAt DESC;
END
GO
PRINT '  - sp_GetCaseFileHistory creado';
GO

-- sp_GetCaseFileParticipants
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetCaseFileParticipants')
    DROP PROCEDURE sp_GetCaseFileParticipants;
GO

CREATE PROCEDURE sp_GetCaseFileParticipants
    @CaseFileId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id,
        p.CaseFileId,
        p.UserId,
        u.Username,
        u.FirstName,
        u.LastName,
        u.Email,
        u.RoleId,
        r.Name as RoleName,
        p.Role as ParticipantRole,
        p.AssignedAt
    FROM CaseFileParticipants p
    INNER JOIN Users u ON p.UserId = u.Id
    INNER JOIN Roles r ON u.RoleId = r.Id
    WHERE p.CaseFileId = @CaseFileId
    ORDER BY p.AssignedAt DESC;
END
GO
PRINT '  - sp_GetCaseFileParticipants creado';
GO

-- sp_AddCaseFileParticipant
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_AddCaseFileParticipant')
    DROP PROCEDURE sp_AddCaseFileParticipant;
GO

CREATE PROCEDURE sp_AddCaseFileParticipant
    @CaseFileId INT,
    @UserId INT,
    @Role NVARCHAR(100) = NULL,
    @AddedById INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Verify case file exists
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
            THROW 50050, 'Expediente no existe', 1;
        
        -- Verify user exists
        IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @UserId)
            THROW 50051, 'Usuario no existe', 1;
        
        -- Check if participant already exists
        IF EXISTS (SELECT 1 FROM CaseFileParticipants WHERE CaseFileId = @CaseFileId AND UserId = @UserId)
            THROW 50052, 'Usuario ya es participante de este expediente', 1;
        
        INSERT INTO CaseFileParticipants (CaseFileId, UserId, Role)
        VALUES (@CaseFileId, @UserId, @Role);
        
        DECLARE @NewId INT = SCOPE_IDENTITY();
        
        -- Log to history
        DECLARE @UserFullName NVARCHAR(200);
        SELECT @UserFullName = FirstName + ' ' + LastName FROM Users WHERE Id = @UserId;
        
        INSERT INTO CaseFileHistory (CaseFileId, ChangedById, ChangeType, NewValue, Comments)
        VALUES (@CaseFileId, @AddedById, 'Participante Agregado', @UserFullName, @Role);
        
        COMMIT TRANSACTION;
        SELECT @NewId as NewParticipantId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
PRINT '  - sp_AddCaseFileParticipant creado';
GO

-- sp_RemoveCaseFileParticipant
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_RemoveCaseFileParticipant')
    DROP PROCEDURE sp_RemoveCaseFileParticipant;
GO

CREATE PROCEDURE sp_RemoveCaseFileParticipant
    @ParticipantId INT,
    @RemovedById INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @CaseFileId INT, @UserId INT, @UserFullName NVARCHAR(200);
        
        SELECT @CaseFileId = CaseFileId, @UserId = UserId 
        FROM CaseFileParticipants 
        WHERE Id = @ParticipantId;
        
        IF @CaseFileId IS NULL
            THROW 50053, 'Participante no existe', 1;
        
        SELECT @UserFullName = FirstName + ' ' + LastName FROM Users WHERE Id = @UserId;
        
        DELETE FROM CaseFileParticipants WHERE Id = @ParticipantId;
        
        -- Log to history
        INSERT INTO CaseFileHistory (CaseFileId, ChangedById, ChangeType, OldValue)
        VALUES (@CaseFileId, @RemovedById, 'Participante Removido', @UserFullName);
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
PRINT '  - sp_RemoveCaseFileParticipant creado';
GO

-- sp_AddAttachment
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_AddAttachment')
    DROP PROCEDURE sp_AddAttachment;
GO

CREATE PROCEDURE sp_AddAttachment
    @CaseFileId INT,
    @FileName NVARCHAR(255),
    @FilePath NVARCHAR(500),
    @FileTamano BIGINT,
    @MimeType NVARCHAR(100),
    @UploadedById INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Verify case file exists
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
            THROW 50060, 'Expediente no existe', 1;

        -- Insert attachment
        INSERT INTO Attachments (CaseFileId, FileName, FilePath, FileTamano, MimeType, UploadedById, IsDeleted)
        VALUES (@CaseFileId, @FileName, @FilePath, @FileTamano, @MimeType, @UploadedById, 0);

        -- Return the created attachment
        SELECT 
            a.Id AS AttachmentId,
            a.CaseFileId,
            a.FileName,
            a.FilePath,
            a.FileTamano,
            a.MimeType,
            a.UploadedById,
            u.FirstName + ' ' + u.LastName AS UploadedByName,
            a.UploadedAt,
            a.DeletedById,
            CASE WHEN a.DeletedById IS NOT NULL THEN d.FirstName + ' ' + d.LastName ELSE NULL END AS DeletedByName,
            a.DeletedAt,
            a.IsDeleted
        FROM Attachments a
        INNER JOIN Users u ON a.UploadedById = u.Id
        LEFT JOIN Users d ON a.DeletedById = d.Id
        WHERE a.Id = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO
PRINT '  - sp_AddAttachment creado';
GO

-- sp_GetAttachmentsByCaseFile
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAttachmentsByCaseFile')
    DROP PROCEDURE sp_GetAttachmentsByCaseFile;
GO

CREATE PROCEDURE sp_GetAttachmentsByCaseFile
    @CaseFileId INT,
    @IncludeDeleted BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.Id AS AttachmentId,
        a.CaseFileId,
        a.FileName,
        a.FilePath,
        a.FileTamano,
        a.MimeType,
        a.UploadedById,
        u.FirstName + ' ' + u.LastName AS UploadedByName,
        a.UploadedAt,
        a.DeletedById,
        CASE WHEN a.DeletedById IS NOT NULL THEN d.FirstName + ' ' + d.LastName ELSE NULL END AS DeletedByName,
        a.DeletedAt,
        a.IsDeleted
    FROM Attachments a
    INNER JOIN Users u ON a.UploadedById = u.Id
    LEFT JOIN Users d ON a.DeletedById = d.Id
    WHERE a.CaseFileId = @CaseFileId
      AND (@IncludeDeleted = 1 OR a.IsDeleted = 0)
    ORDER BY a.UploadedAt DESC;
END
GO
PRINT '  - sp_GetAttachmentsByCaseFile creado';
GO

-- sp_DeleteAttachment
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteAttachment')
    DROP PROCEDURE sp_DeleteAttachment;
GO

CREATE PROCEDURE sp_DeleteAttachment
    @AttachmentId INT,
    @DeletedById INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Verify attachment exists
        IF NOT EXISTS (SELECT 1 FROM Attachments WHERE Id = @AttachmentId)
            THROW 50061, 'Archivo adjunto no existe', 1;

        -- Verify not already deleted
        IF EXISTS (SELECT 1 FROM Attachments WHERE Id = @AttachmentId AND IsDeleted = 1)
            THROW 50062, 'Archivo adjunto ya ha sido eliminado', 1;

        -- Soft delete the attachment
        UPDATE Attachments 
        SET IsDeleted = 1,
            DeletedById = @DeletedById,
            DeletedAt = GETDATE()
        WHERE Id = @AttachmentId;

        -- Return the deleted attachment info
        SELECT 
            a.Id AS AttachmentId,
            a.CaseFileId,
            a.FileName,
            a.FilePath,
            a.FileTamano,
            a.MimeType,
            a.UploadedById,
            u.FirstName + ' ' + u.LastName AS UploadedByName,
            a.UploadedAt,
            a.DeletedById,
            d.FirstName + ' ' + d.LastName AS DeletedByName,
            a.DeletedAt,
            a.IsDeleted
        FROM Attachments a
        INNER JOIN Users u ON a.UploadedById = u.Id
        INNER JOIN Users d ON a.DeletedById = d.Id
        WHERE a.Id = @AttachmentId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO
PRINT '  - sp_DeleteAttachment creado';
GO

PRINT '============================================';
PRINT 'INICIALIZACION COMPLETADA EXITOSAMENTE';
PRINT '============================================';
PRINT 'Base de datos: EvidenceManagementDB';
PRINT 'Tablas creadas: 10';
PRINT 'Stored Procedures: 19';
PRINT 'Usuario admin: admin@Indicios.com / Admin@123';
PRINT '============================================';
GO

