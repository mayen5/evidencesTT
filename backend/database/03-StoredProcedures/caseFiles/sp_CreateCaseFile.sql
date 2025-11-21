-- =============================================
-- Stored Procedure: sp_CreateCaseFile
-- Description: Creates a new case file
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

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
