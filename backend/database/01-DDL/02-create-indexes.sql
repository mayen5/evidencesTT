-- =============================================
-- Script: Create Indexes
-- Description: Creates indexes for performance optimization
-- Author: System
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
-- Indexes for Evidence table
-- =============================================
CREATE INDEX IX_Evidence_CaseFileId ON Evidence(CaseFileId);
CREATE INDEX IX_Evidence_EvidenceTypeId ON Evidence(EvidenceTypeId);
CREATE INDEX IX_Evidence_CollectedById ON Evidence(CollectedById);
CREATE INDEX IX_Evidence_CollectedAt ON Evidence(CollectedAt);
CREATE INDEX IX_Evidence_CaseFileId_EvidenceNumber ON Evidence(CaseFileId, EvidenceNumber);
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
CREATE INDEX IX_Attachments_EvidenceId ON Attachments(EvidenceId);
CREATE INDEX IX_Attachments_CaseFileId ON Attachments(CaseFileId);
CREATE INDEX IX_Attachments_UploadedById ON Attachments(UploadedById);
CREATE INDEX IX_Attachments_CreatedAt ON Attachments(CreatedAt);
GO

PRINT 'All indexes created successfully!';
