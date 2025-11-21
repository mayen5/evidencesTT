-- =============================================
-- Stored Procedure: sp_GetTraceEvidenceByCaseFile
-- Description: Obtiene todos los indicios de un expediente específico
-- Author: Carmelo Mayén
-- Date: 2025-11-21
-- =============================================

USE EvidenceManagementDB;
GO

IF OBJECT_ID('sp_GetTraceEvidenceByCaseFile', 'P') IS NOT NULL
	DROP PROCEDURE sp_GetTraceEvidenceByCaseFile;
GO

CREATE PROCEDURE sp_GetTraceEvidenceByCaseFile
	@CaseFileId INT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		SELECT 
			e.Id AS TraceEvidenceId,
			e.CaseFileId,
			e.EvidenceNumber,
			e.Description,
			e.TraceEvidenceTypeId,
			et.Name AS TraceEvidenceTypeName,
			e.Color,
			e.Size,
			e.Weight,
			e.Location,
			e.StorageLocation,
			e.CollectedById AS CollectedBy,
			u.FirstName + ' ' + u.LastName AS CollectedByName,
			e.CollectedAt,
			e.CreatedAt,
			e.UpdatedAt
		FROM TraceEvidence e
		INNER JOIN TraceEvidenceTypes et ON e.TraceEvidenceTypeId = et.Id
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

PRINT 'Stored Procedure sp_GetTraceEvidenceByCaseFile created successfully!';
