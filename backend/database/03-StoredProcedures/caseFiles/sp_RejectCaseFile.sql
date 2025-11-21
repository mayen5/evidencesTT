-- =============================================
-- Stored Procedure: sp_RejectCaseFile
-- Description: Rejects a case file by coordinator with reason
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

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
