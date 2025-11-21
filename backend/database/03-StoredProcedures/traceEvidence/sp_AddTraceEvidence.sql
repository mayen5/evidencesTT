-- =============================================
-- Stored Procedure: sp_AddTraceEvidence
-- Description: Agrega un indicio a un expediente
-- Author: Carmelo Mayén
-- Date: 2025-11-21
-- =============================================

USE EvidenceManagementDB;
GO

IF OBJECT_ID('sp_AddTraceEvidence', 'P') IS NOT NULL
	DROP PROCEDURE sp_AddTraceEvidence;
GO

CREATE PROCEDURE sp_AddTraceEvidence
	@CaseFileId INT,
	@EvidenceNumber NVARCHAR(50),
	@Description NVARCHAR(MAX),
	@TraceEvidenceTypeId INT,
	@Color NVARCHAR(50) = NULL,
	@Size NVARCHAR(100) = NULL,
	@Weight DECIMAL(10,2) = NULL,
	@Location NVARCHAR(500) = NULL,
	@StorageLocation NVARCHAR(255) = NULL,
	@CollectedById INT,
	@NewEvidenceId INT OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN TRY
		BEGIN TRANSACTION;
		IF NOT EXISTS (SELECT 1 FROM CaseFiles WHERE Id = @CaseFileId)
		BEGIN
			THROW 50070, 'El expediente no existe', 1;
		END
		DECLARE @StatusId INT;
		SELECT @StatusId = StatusId FROM CaseFiles WHERE Id = @CaseFileId;
		IF @StatusId != 1
		BEGIN
			THROW 50071, 'Solo se pueden agregar indicios a expedientes en estado Borrador', 1;
		END
		IF NOT EXISTS (SELECT 1 FROM TraceEvidenceTypes WHERE Id = @TraceEvidenceTypeId)
		BEGIN
			THROW 50072, 'El tipo de indicio no existe', 1;
		END
		IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @CollectedById AND IsActive = 1)
		BEGIN
			THROW 50073, 'El usuario no existe o está inactivo', 1;
		END
		IF EXISTS (SELECT 1 FROM TraceEvidence WHERE CaseFileId = @CaseFileId AND EvidenceNumber = @EvidenceNumber)
		BEGIN
			THROW 50074, 'El número de indicio ya existe en este expediente', 1;
		END
		INSERT INTO TraceEvidence (
			CaseFileId, EvidenceNumber, Description, TraceEvidenceTypeId,
			Color, Size, Weight, Location, StorageLocation, CollectedById
		)
		VALUES (
			@CaseFileId, @EvidenceNumber, @Description, @TraceEvidenceTypeId,
			@Color, @Size, @Weight, @Location, @StorageLocation, @CollectedById
		);
		SET @NewEvidenceId = SCOPE_IDENTITY();
		COMMIT TRANSACTION;
		SELECT 
			e.Id,
			e.CaseFileId,
			e.EvidenceNumber,
			e.Description,
			e.TraceEvidenceTypeId,
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
		FROM TraceEvidence e
		INNER JOIN TraceEvidenceTypes et ON e.TraceEvidenceTypeId = et.Id
		INNER JOIN Users u ON e.CollectedById = u.Id
		WHERE e.Id = @NewEvidenceId;
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

PRINT 'Stored Procedure sp_AddTraceEvidence created successfully!';
