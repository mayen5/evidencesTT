import { getPool } from '../config/database';
import sql from 'mssql';
import { IUser } from '../types/user.types';

/**
 * Get all users with pagination
 */
export const getAllUsers = async (
    page: number,
    pageSize: number,
    roleId?: number,
    isActive?: boolean,
    search?: string
): Promise<{ users: IUser[]; totalRecords: number }> => {
    const pool = await getPool();
    const offset = (page - 1) * pageSize;

    let query = `
        SELECT 
            u.Id, u.Username, u.Email, u.FirstName, u.LastName, 
            u.RoleId, r.Name as RoleName, u.IsActive, u.CreatedAt, u.UpdatedAt
        FROM Users u
        INNER JOIN Roles r ON u.RoleId = r.Id
        WHERE 1=1
    `;

    const params: Record<string, unknown> = {};

    if (roleId) {
        query += ' AND u.RoleId = @RoleId';
        params.RoleId = roleId;
    }

    if (isActive !== undefined) {
        query += ' AND u.IsActive = @IsActive';
        params.IsActive = isActive;
    }

    if (search) {
        query += ` AND (u.Email LIKE @Search OR u.FirstName LIKE @Search OR u.LastName LIKE @Search OR u.Username LIKE @Search)`;
        params.Search = `%${search}%`;
    }

    query += ' ORDER BY u.CreatedAt DESC';

    // Get total count
    let countQuery = `
        SELECT COUNT(*) as Total
        FROM Users u
        INNER JOIN Roles r ON u.RoleId = r.Id
        WHERE 1=1
    `;

    if (roleId) {
        countQuery += ' AND u.RoleId = @RoleId';
    }
    if (isActive !== undefined) {
        countQuery += ' AND u.IsActive = @IsActive';
    }
    if (search) {
        countQuery += ` AND (u.Email LIKE @Search OR u.FirstName LIKE @Search OR u.LastName LIKE @Search OR u.Username LIKE @Search)`;
    }

    const countRequest = pool.request();
    Object.keys(params).forEach(key => {
        countRequest.input(key, params[ key ]);
    });
    const countResult = await countRequest.query(countQuery);
    const totalRecords = countResult.recordset[ 0 ].Total;

    // Get paginated results
    query += ' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY';
    const request = pool.request();
    Object.keys(params).forEach(key => {
        request.input(key, params[ key ]);
    });
    request.input('Offset', sql.Int, offset);
    request.input('PageSize', sql.Int, pageSize);

    const result = await request.query(query);

    return {
        users: result.recordset as IUser[],
        totalRecords,
    };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<IUser | null> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('UserId', sql.Int, userId)
        .query(`
            SELECT 
                u.Id, u.Username, u.Email, u.PasswordHash, u.FirstName, u.LastName,
                u.RoleId, r.Name as RoleName, u.IsActive, u.CreatedAt, u.UpdatedAt
            FROM Users u
            INNER JOIN Roles r ON u.RoleId = r.Id
            WHERE u.Id = @UserId
        `);

    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[ 0 ] as IUser;
    }

    return null;
};

/**
 * Create new user (admin only)
 */
export const createUser = async (
    username: string,
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
    roleId: number
): Promise<number> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('Username', sql.VarChar(100), username)
        .input('Email', sql.VarChar(255), email)
        .input('PasswordHash', sql.VarChar(255), passwordHash)
        .input('FirstName', sql.VarChar(100), firstName)
        .input('LastName', sql.VarChar(100), lastName)
        .input('RoleId', sql.Int, roleId)
        .query(`
            INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, RoleId, IsActive)
            VALUES (@Username, @Email, @PasswordHash, @FirstName, @LastName, @RoleId, 1);
            SELECT SCOPE_IDENTITY() as UserId;
        `);

    return result.recordset[ 0 ].UserId;
};

/**
 * Update user
 */
export const updateUser = async (
    userId: number,
    updates: {
        email?: string;
        firstName?: string;
        lastName?: string;
        roleId?: number;
        isActive?: boolean;
    }
): Promise<void> => {
    const pool = await getPool();
    const setParts: string[] = [];
    const request = pool.request();

    request.input('UserId', sql.Int, userId);

    if (updates.email !== undefined) {
        setParts.push('Email = @Email');
        request.input('Email', sql.VarChar(255), updates.email);
    }

    if (updates.firstName !== undefined) {
        setParts.push('FirstName = @FirstName');
        request.input('FirstName', sql.VarChar(100), updates.firstName);
    }

    if (updates.lastName !== undefined) {
        setParts.push('LastName = @LastName');
        request.input('LastName', sql.VarChar(100), updates.lastName);
    }

    if (updates.roleId !== undefined) {
        setParts.push('RoleId = @RoleId');
        request.input('RoleId', sql.Int, updates.roleId);
    }

    if (updates.isActive !== undefined) {
        setParts.push('IsActive = @IsActive');
        request.input('IsActive', sql.Bit, updates.isActive);
    }

    if (setParts.length > 0) {
        setParts.push('UpdatedAt = GETDATE()');
        const query = `UPDATE Users SET ${setParts.join(', ')} WHERE Id = @UserId`;
        await request.query(query);
    }
};

/**
 * Delete user
 */
export const deleteUser = async (userId: number): Promise<void> => {
    const pool = await getPool();
    await pool
        .request()
        .input('UserId', sql.Int, userId)
        .query('DELETE FROM Users WHERE Id = @UserId');
};

/**
 * Change user password
 */
export const changeUserPassword = async (userId: number, newPasswordHash: string): Promise<void> => {
    const pool = await getPool();
    await pool
        .request()
        .input('UserId', sql.Int, userId)
        .input('PasswordHash', sql.VarChar(255), newPasswordHash)
        .query('UPDATE Users SET PasswordHash = @PasswordHash, UpdatedAt = GETDATE() WHERE Id = @UserId');
};
