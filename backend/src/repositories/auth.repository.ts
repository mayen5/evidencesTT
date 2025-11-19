import { getPool } from '../config/database';
import sql from 'mssql';
import { IUser } from '../types/user.types';

/**
 * Authenticate user with email and password
 */
export const authenticateUser = async (email: string): Promise<IUser | null> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('Email', sql.VarChar(255), email)
        .execute('sp_AuthenticateUser');

    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[ 0 ] as IUser;
    }

    return null;
};

/**
 * Register a new user
 */
export const registerUser = async (
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
    roleId: number
): Promise<{ userId: number; message: string }> => {
    const pool = await getPool();

    // Use email as username for now (or generate unique username)
    const username = email.split('@')[ 0 ];

    const result = await pool
        .request()
        .input('Username', sql.VarChar(100), username)
        .input('Email', sql.VarChar(255), email)
        .input('PasswordHash', sql.VarChar(255), passwordHash)
        .input('FirstName', sql.VarChar(100), firstName)
        .input('LastName', sql.VarChar(100), lastName)
        .input('RoleId', sql.Int, roleId)
        .output('NewUserId', sql.Int)
        .execute('sp_RegisterUser');

    const userId = result.output.NewUserId;

    return {
        userId,
        message: 'Usuario registrado exitosamente',
    };
};
