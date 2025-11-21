-- =============================================
-- Stored Procedure: sp_AuthenticateUser
-- Description: Authenticates a user by email
-- Author: Carmelo Mayén
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

IF OBJECT_ID('sp_AuthenticateUser', 'P') IS NOT NULL
    DROP PROCEDURE sp_AuthenticateUser;
GO

CREATE PROCEDURE sp_AuthenticateUser
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Return user data if exists and active
        SELECT 
            u.Id,
            u.Username,
            u.Email,
            u.PasswordHash,
            u.FirstName,
            u.LastName,
            u.RoleId,
            r.Name AS RoleName,
            u.IsActive,
            u.CreatedAt
        FROM Users u
        INNER JOIN Roles r ON u.RoleId = r.Id
        WHERE u.Email = @Email 
          AND u.IsActive = 1;
          
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

PRINT 'Stored Procedure sp_AuthenticateUser created successfully!';
