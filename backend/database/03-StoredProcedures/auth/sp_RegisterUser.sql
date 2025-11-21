-- =============================================
-- Stored Procedure: sp_RegisterUser
-- Description: Registers a new user in the system
-- Author: Carmelo May�n
-- Date: 2025-11-18
-- =============================================

USE EvidenceManagementDB;
GO

IF OBJECT_ID('sp_RegisterUser', 'P') IS NOT NULL
    DROP PROCEDURE sp_RegisterUser;
GO

CREATE PROCEDURE sp_RegisterUser
    @Username NVARCHAR(100),
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @RoleId INT = 3, -- Default to Tecnico
    @NewUserId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if username already exists
        IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
        BEGIN
            THROW 50001, 'El nombre de usuario ya existe', 1;
        END
        
        -- Check if email already exists
        IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
        BEGIN
            THROW 50002, 'El correo electrónico ya está registrado', 1;
        END
        
        -- Check if role exists
        IF NOT EXISTS (SELECT 1 FROM Roles WHERE Id = @RoleId)
        BEGIN
            THROW 50003, 'El rol especificado no existe', 1;
        END
        
        -- Insert new user
        INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, RoleId, IsActive)
        VALUES (@Username, @Email, @PasswordHash, @FirstName, @LastName, @RoleId, 1);
        
        SET @NewUserId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        
        -- Return created user
        SELECT 
            u.Id,
            u.Username,
            u.Email,
            u.FirstName,
            u.LastName,
            u.RoleId,
            r.Name AS RoleName,
            u.IsActive,
            u.CreatedAt
        FROM Users u
        INNER JOIN Roles r ON u.RoleId = r.Id
        WHERE u.Id = @NewUserId;
        
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

PRINT 'Stored Procedure sp_RegisterUser created successfully!';
