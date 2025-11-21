-- =============================================
-- Script: Seed Admin User
-- Description: Insert default admin user for initial login
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- Password: Admin@123 (hashed with bcrypt)
-- =============================================

USE EvidenceManagementDB;
GO

-- Insert Admin User
-- Password: Admin@123
-- Bcrypt hash generated with: bcrypt.hash('Admin@123', 10)

SET IDENTITY_INSERT Users ON;

INSERT INTO Users (Id, Username, Email, PasswordHash, FirstName, LastName, RoleId, IsActive) VALUES
(1, 'admin', 'admin@evidence.com', '$2b$10$Y/.bVJZ9enKrJTgU43cWeuTFgMO0L3ljDDUtOfHKNzr8gMIJlIGwC', 'Admin', 'System', 1, 1);

SET IDENTITY_INSERT Users OFF;
GO

PRINT 'Admin user seeded successfully!';
PRINT 'Username: admin';
PRINT 'Email: admin@evidence.com';
PRINT 'Password: Admin@123 (Please change after first login)';
