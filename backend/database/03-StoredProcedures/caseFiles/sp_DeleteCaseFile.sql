-- =============================================
-- Stored Procedure: sp_DeleteCaseFile
-- Description: Deletes a case file (only in Borrador or Rechazado status)
-- Author: System
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

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
