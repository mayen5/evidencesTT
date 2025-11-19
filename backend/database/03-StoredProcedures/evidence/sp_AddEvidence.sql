-- =============================================
-- Stored Procedure: sp_AddEvidence
-- Description: Adds evidence to a case file
-- Author: System
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

IF OBJECT_ID('sp_AddEvidence', 'P') IS NOT NULL
    DROP PROCEDURE sp_AddEvidence;
GO

CREATE PROCEDURE sp_AddEvidence
    @CaseFileId INT,
    @EvidenceNumber NVARCHAR(50),
    @Description NVARCHAR(MAX),
    @EvidenceTypeId INT,
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
        
        -- Validate case file exists
        IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
        BEGIN
            THROW 50070, 'El expediente no existe', 1;
        END
        
        -- Validate case file is in Borrador status
        DECLARE @StatusId INT;
        SELECT @StatusId = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
        
        IF @StatusId != 1
        BEGIN
            THROW 50071, 'Solo se pueden agregar indicios a expedientes en estado Borrador', 1;
        END
        
        -- Validate evidence type exists
        IF NOT EXISTS (SELECT 1 FROM EvidenceTypes WHERE Id = @EvidenceTypeId)
        BEGIN
            THROW 50072, 'El tipo de evidencia no existe', 1;
        END
        
        -- Validate user exists
        IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @CollectedById AND IsActive = 1)
        BEGIN
            THROW 50073, 'El usuario no existe o está inactivo', 1;
        END
        
        -- Check if evidence number already exists for this case file
        IF EXISTS (SELECT 1 FROM Evidence WHERE CaseFileId = @CaseFileId AND EvidenceNumber = @EvidenceNumber)
        BEGIN
            THROW 50074, 'El número de indicio ya existe en este expediente', 1;
        END
        
        -- Insert evidence
        INSERT INTO Evidence (
            CaseFileId, EvidenceNumber, Description, EvidenceTypeId,
            Color, Size, Weight, Location, StorageLocation, CollectedById
        )
        VALUES (
            @CaseFileId, @EvidenceNumber, @Description, @EvidenceTypeId,
            @Color, @Size, @Weight, @Location, @StorageLocation, @CollectedById
        );
        
        SET @NewEvidenceId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        
        -- Return created evidence
        SELECT 
            e.Id,
            e.CaseFileId,
            e.EvidenceNumber,
            e.Description,
            e.EvidenceTypeId,
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
        FROM Evidence e
        INNER JOIN EvidenceTypes et ON e.EvidenceTypeId = et.Id
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

PRINT 'Stored Procedure sp_AddEvidence created successfully!';
