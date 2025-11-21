-- =============================================
-- Stored Procedure: sp_ApproveCaseFile
-- Description: Approves a case file by coordinator
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

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
