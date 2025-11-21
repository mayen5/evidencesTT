-- =============================================
-- Stored Procedure: sp_UpdateCaseFile
-- Description: Updates a case file (only in Borrador or Rechazado status)
-- Author: Carmelo Mayén
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

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
