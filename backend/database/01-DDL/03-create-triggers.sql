-- =============================================
-- Script: Create Triggers
-- Description: Creates triggers for audit and business logic
-- Author: System
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
-- Trigger: Update timestamp on Evidence table
-- =============================================
CREATE TRIGGER TR_Evidence_UpdateTimestamp
ON Evidence
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Evidence
    SET UpdatedAt = GETDATE()
    FROM Evidence e
    INNER JOIN inserted i ON e.Id = i.Id;
END;
GO

-- =============================================
-- Trigger: Auto-add participant when evidence is added
-- =============================================
CREATE TRIGGER TR_Evidence_AddParticipant
ON Evidence
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Add the collector as a participant if not already added
    INSERT INTO CaseFileParticipants (CaseFileId, UserId, ParticipationRole)
    SELECT DISTINCT 
        i.CaseFileId, 
        i.CollectedById, 
        'Recolector de Evidencia'
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
