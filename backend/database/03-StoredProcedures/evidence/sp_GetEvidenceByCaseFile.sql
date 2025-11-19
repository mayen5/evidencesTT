-- =============================================
-- Stored Procedure: sp_GetEvidenceByCaseFile
-- Description: Gets all evidence for a specific case file
-- Author: System
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

IF OBJECT_ID('sp_GetEvidenceByCaseFile', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetEvidenceByCaseFile;
GO

CREATE PROCEDURE sp_GetEvidenceByCaseFile
    @CaseFileId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
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

PRINT 'Stored Procedure sp_GetEvidenceByCaseFile created successfully!';
