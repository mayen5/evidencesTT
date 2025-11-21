-- =============================================
-- Stored Procedure: sp_GetCaseFileById
-- Description: Gets a case file by ID with all details
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

IF OBJECT_ID('sp_GetCaseFileById', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetCaseFileById;
GO

CREATE PROCEDURE sp_GetCaseFileById
    @CaseFileId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Return case file details
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
            reg.FirstName + ' ' + reg.LastName AS RegisteredByName,
            reg.Email AS RegisteredByEmail,
            cf.ReviewedById,
            CASE WHEN cf.ReviewedById IS NOT NULL 
                THEN rev.FirstName + ' ' + rev.LastName 
                ELSE NULL 
            END AS ReviewedByName,
            cf.RejectionReason,
            cf.RegisteredAt,
            cf.ReviewedAt,
            cf.ApprovedAt,
            cf.CreatedAt,
            cf.UpdatedAt,
            (SELECT COUNT(*) FROM TraceEvidence WHERE CaseFileId = cf.Id) AS EvidenceCount
        FROM CaseFiles cf
        INNER JOIN CaseFileStatus s ON cf.StatusId = s.Id
        INNER JOIN Users reg ON cf.RegisteredById = reg.Id
        LEFT JOIN Users rev ON cf.ReviewedById = rev.Id
        WHERE cf.Id = @CaseFileId;
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_GetCaseFileById created successfully!';
