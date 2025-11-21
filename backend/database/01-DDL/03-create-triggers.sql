-- =============================================
-- Script: Create Triggers
-- Description: Creates triggers for audit and business logic
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

-- =============================================
-- Trigger: Update timestamp on Users table
-- =============================================
CREATE TRIGGER TR_Users_UpdateTimestamp
ON Users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Users
    SET UpdatedAt = GETDATE()
    FROM Users u
    INNER JOIN inserted i ON u.Id = i.Id;
END;
GO

-- =============================================
-- Trigger: Update timestamp on CaseFiles table
-- =============================================
CREATE TRIGGER TR_CaseFiles_UpdateTimestamp
ON CaseFiles
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE CaseFiles
    SET UpdatedAt = GETDATE()
    FROM CaseFiles cf
    INNER JOIN inserted i ON cf.Id = i.Id;
END;
GO

-- =============================================
-- Trigger: Update timestamp on TraceEvidence table
-- =============================================
CREATE TRIGGER TR_TraceEvidence_UpdateTimestamp
ON TraceEvidence
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE TraceEvidence
    SET UpdatedAt = GETDATE()
    FROM TraceEvidence e
    INNER JOIN inserted i ON e.Id = i.Id;
END;
GO

-- =============================================
-- Trigger: Auto-add participant when trace evidence is added
-- =============================================
CREATE TRIGGER TR_TraceEvidence_AddParticipant
ON TraceEvidence
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Add the collector as a participant if not already added
    INSERT INTO CaseFileParticipants (CaseFileId, UserId, ParticipationRole)
    SELECT DISTINCT 
        i.CaseFileId, 
        i.CollectedById, 
        'Recolector de Indicios'
    FROM inserted i
    WHERE NOT EXISTS (
        SELECT 1 
        FROM CaseFileParticipants cfp 
        WHERE cfp.CaseFileId = i.CaseFileId 
        AND cfp.UserId = i.CollectedById
    );
END;
GO

PRINT 'All triggers created successfully!';
