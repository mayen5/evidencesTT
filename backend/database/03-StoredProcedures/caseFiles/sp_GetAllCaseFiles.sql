-- =============================================
-- Stored Procedure: sp_GetAllCaseFiles
-- Description: Gets all case files with pagination and filtering
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

IF OBJECT_ID('sp_GetAllCaseFiles', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetAllCaseFiles;
GO

CREATE PROCEDURE sp_GetAllCaseFiles
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @StatusId INT = NULL,
    @RegisteredById INT = NULL,
    @SearchTerm NVARCHAR(255) = NULL,
    @StartDate DATETIME2 = NULL,
    @EndDate DATETIME2 = NULL,
    @TotalRecords INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Calculate offset
        DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
        
        -- Get total count
        SELECT @TotalRecords = COUNT(*)
        FROM CaseFiles cf
        WHERE 
            (@StatusId IS NULL OR cf.StatusId = @StatusId)
            AND (@RegisteredById IS NULL OR cf.RegisteredById = @RegisteredById)
            AND (@SearchTerm IS NULL OR cf.CaseNumber LIKE '%' + @SearchTerm + '%' 
                OR cf.Title LIKE '%' + @SearchTerm + '%')
            AND (@StartDate IS NULL OR cf.RegisteredAt >= @StartDate)
            AND (@EndDate IS NULL OR cf.RegisteredAt <= @EndDate);
        
        -- Return paginated results
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
            cf.ReviewedById,
            CASE WHEN cf.ReviewedById IS NOT NULL 
                THEN rev.FirstName + ' ' + rev.LastName 
                ELSE NULL 
            END AS ReviewedByName,
            cf.RejectionReason,
            cf.RegisteredAt,
            cf.ReviewedAt,
            cf.ApprovedAt,
            (SELECT COUNT(*) FROM TraceEvidence WHERE CaseFileId = cf.Id) AS EvidenceCount
        FROM CaseFiles cf
        INNER JOIN CaseFileStatus s ON cf.StatusId = s.Id
        INNER JOIN Users reg ON cf.RegisteredById = reg.Id
        LEFT JOIN Users rev ON cf.ReviewedById = rev.Id
        WHERE 
            (@StatusId IS NULL OR cf.StatusId = @StatusId)
            AND (@RegisteredById IS NULL OR cf.RegisteredById = @RegisteredById)
            AND (@SearchTerm IS NULL OR cf.CaseNumber LIKE '%' + @SearchTerm + '%' 
                OR cf.Title LIKE '%' + @SearchTerm + '%')
            AND (@StartDate IS NULL OR cf.RegisteredAt >= @StartDate)
            AND (@EndDate IS NULL OR cf.RegisteredAt <= @EndDate)
        ORDER BY cf.RegisteredAt DESC
        OFFSET @Offset ROWS
        FETCH NEXT @PageSize ROWS ONLY;
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_GetAllCaseFiles created successfully!';
