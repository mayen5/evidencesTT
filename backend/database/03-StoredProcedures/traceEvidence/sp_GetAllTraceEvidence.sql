-- =============================================
-- Stored Procedure: sp_GetAllTraceEvidence
-- Description: Obtiene todos los indicios de todos los expedientes con paginación
-- Author: Carmelo Mayén
-- Date: 2025-11-21
-- =============================================

USE EvidenceManagementDB;
GO

IF OBJECT_ID('sp_GetAllTraceEvidence', 'P') IS NOT NULL
	DROP PROCEDURE sp_GetAllTraceEvidence;
GO

CREATE PROCEDURE sp_GetAllTraceEvidence
	@PageNumber INT = 1,
	@PageSize INT = 10,
	@Search NVARCHAR(200) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
		DECLARE @TotalCount INT;
		SELECT @TotalCount = COUNT(*)
		FROM TraceEvidence e
		WHERE (@Search IS NULL 
			OR e.EvidenceNumber LIKE '%' + @Search + '%'
			OR e.Description LIKE '%' + @Search + '%');
		SELECT 
			e.Id AS TraceEvidenceId,
			e.CaseFileId,
			cf.CaseNumber AS CaseFileNumber,
			e.EvidenceNumber,
			e.Description,
			e.TraceEvidenceTypeId,
			et.Name AS TraceEvidenceTypeName,
			e.Color,
			e.Size,
			e.Weight,
			e.Location,
			e.StorageLocation,
			e.CollectedById,
			u.FirstName + ' ' + u.LastName AS CollectedByName,
			e.CollectedAt,
			e.CreatedAt,
			e.UpdatedAt,
			@TotalCount AS TotalCount
		FROM TraceEvidence e
		INNER JOIN CaseFiles cf ON e.CaseFileId = cf.Id
		INNER JOIN TraceEvidenceTypes et ON e.TraceEvidenceTypeId = et.Id
		INNER JOIN Users u ON e.CollectedById = u.Id
		WHERE (@Search IS NULL 
			OR e.EvidenceNumber LIKE '%' + @Search + '%'
			OR e.Description LIKE '%' + @Search + '%'
			OR cf.CaseNumber LIKE '%' + @Search + '%')
		ORDER BY e.CreatedAt DESC
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

PRINT 'Stored Procedure sp_GetAllTraceEvidence created successfully!';
