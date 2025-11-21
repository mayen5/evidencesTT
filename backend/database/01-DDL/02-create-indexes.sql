-- =============================================
-- Script: Create Indexes
-- Description: Creates indexes for performance optimization
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

-- =============================================
-- Indexes for Users table
-- =============================================
CREATE INDEX IX_Users_RoleId ON Users(RoleId);
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_IsActive ON Users(IsActive);
CREATE INDEX IX_Users_CreatedAt ON Users(CreatedAt);
GO

-- =============================================
-- Indexes for CaseFiles table
-- =============================================
CREATE INDEX IX_CaseFiles_StatusId ON CaseFiles(StatusId);
CREATE INDEX IX_CaseFiles_RegisteredById ON CaseFiles(RegisteredById);
CREATE INDEX IX_CaseFiles_ReviewedById ON CaseFiles(ReviewedById);
CREATE INDEX IX_CaseFiles_RegisteredAt ON CaseFiles(RegisteredAt);
CREATE INDEX IX_CaseFiles_CaseNumber ON CaseFiles(CaseNumber);
CREATE INDEX IX_CaseFiles_StatusId_RegisteredAt ON CaseFiles(StatusId, RegisteredAt);
GO

-- =============================================
-- Indexes for TraceEvidence table
-- =============================================
CREATE INDEX IX_TraceEvidence_CaseFileId ON TraceEvidence(CaseFileId);
CREATE INDEX IX_TraceEvidence_TraceEvidenceTypeId ON TraceEvidence(TraceEvidenceTypeId);
CREATE INDEX IX_TraceEvidence_CollectedById ON TraceEvidence(CollectedById);
CREATE INDEX IX_TraceEvidence_CollectedAt ON TraceEvidence(CollectedAt);
CREATE INDEX IX_TraceEvidence_CaseFileId_EvidenceNumber ON TraceEvidence(CaseFileId, EvidenceNumber);
GO

-- =============================================
-- Indexes for CaseFileHistory table
-- =============================================
CREATE INDEX IX_History_CaseFileId ON CaseFileHistory(CaseFileId);
CREATE INDEX IX_History_StatusId ON CaseFileHistory(StatusId);
CREATE INDEX IX_History_ChangedById ON CaseFileHistory(ChangedById);
CREATE INDEX IX_History_CreatedAt ON CaseFileHistory(CreatedAt);
CREATE INDEX IX_History_CaseFileId_CreatedAt ON CaseFileHistory(CaseFileId, CreatedAt);
GO

-- =============================================
-- Indexes for CaseFileParticipants table
-- =============================================
CREATE INDEX IX_Participants_CaseFileId ON CaseFileParticipants(CaseFileId);
CREATE INDEX IX_Participants_UserId ON CaseFileParticipants(UserId);
GO

-- =============================================
-- Indexes for Attachments table
-- =============================================
CREATE INDEX IX_Attachments_TraceEvidenceId ON Attachments(TraceEvidenceId);
CREATE INDEX IX_Attachments_CaseFileId ON Attachments(CaseFileId);
CREATE INDEX IX_Attachments_UploadedById ON Attachments(UploadedById);
CREATE INDEX IX_Attachments_CreatedAt ON Attachments(CreatedAt);
GO

PRINT 'All indexes created successfully!';
