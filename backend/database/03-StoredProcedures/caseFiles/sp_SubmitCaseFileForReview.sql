-- =============================================
-- Stored Procedure: sp_SubmitCaseFileForReview
-- Description: Submits a case file for coordinator review
-- Author: System
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

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
        SELECT @EvidenceCount = COUNT(*) FROM Evidence WHERE CaseFileId = @CaseFileId;
        
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
