import * as userRepo from '../repositories/user.repository';
import * as bcrypt from 'bcryptjs';
import { IUser, IUserResponse } from '../types/user.types';
import { NotFoundError } from '../utils/ApiError';

/**
 * Map database user to response format (camelCase)
 */
const mapUserToResponse = (user: IUser): IUserResponse => {
    return {
        userId: user.Id,
        username: user.Username,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        roleId: user.RoleId,
        roleName: user.RoleName,
        isActive: user.IsActive,
        createdAt: user.CreatedAt,
        updatedAt: user.UpdatedAt,
    };
};

/**
 * Get all users with pagination
 */
export const getAllUsers = async (
    page: number,
    pageSize: number,
    roleId?: number,
    isActive?: boolean,
    search?: string
): Promise<{ users: IUserResponse[]; totalRecords: number }> => {
    const result = await userRepo.getAllUsers(page, pageSize, roleId, isActive, search);

    // Map to response format
    const users = result.users.map(mapUserToResponse);

    return {
        users,
        totalRecords: result.totalRecords,
    };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<IUserResponse> => {
    const user = await userRepo.getUserById(userId);

    if (!user) {
        throw new NotFoundError('Usuario no encontrado');
    }

    return mapUserToResponse(user);
};

/**
 * Create new user
 */
export const createUser = async (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    roleId: number
): Promise<IUserResponse> => {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const userId = await userRepo.createUser(username, email, passwordHash, firstName, lastName, roleId);

    // Get created user
    const user = await userRepo.getUserById(userId);

    if (!user) {
        throw new Error('Error al crear usuario');
    }

    return mapUserToResponse(user);
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
    }
): Promise<IUserResponse> => {
    // Check if user exists
    const existingUser = await userRepo.getUserById(userId);
    if (!existingUser) {
        throw new NotFoundError('Usuario no encontrado');
    }

    // Check email uniqueness if email is being updated
    if (updates.email && updates.email !== existingUser.Email) {
        // TODO: Add email uniqueness check
    }

    await userRepo.updateUser(userId, updates);

    // Get updated user
    const updatedUser = await userRepo.getUserById(userId);
    if (!updatedUser) {
        throw new Error('Error al actualizar usuario');
    }

    return mapUserToResponse(updatedUser);
};

/**
 * Delete user
 */
export const deleteUser = async (userId: number): Promise<void> => {
    const user = await userRepo.getUserById(userId);
    if (!user) {
        throw new NotFoundError('Usuario no encontrado');
    }

    await userRepo.deleteUser(userId);
};

/**
 * Toggle user active status
 */
export const toggleUserActive = async (userId: number, isActive: boolean): Promise<IUserResponse> => {
    const user = await userRepo.getUserById(userId);
    if (!user) {
        throw new NotFoundError('Usuario no encontrado');
    }

    await userRepo.updateUser(userId, { isActive });

    const updatedUser = await userRepo.getUserById(userId);
    if (!updatedUser) {
        throw new Error('Error al actualizar usuario');
    }

    return mapUserToResponse(updatedUser);
};

/**
 * Change user password (admin)
 */
export const changeUserPassword = async (
    userId: number,
    newPassword: string
): Promise<void> => {
    const user = await userRepo.getUserById(userId);
    if (!user) {
        throw new NotFoundError('Usuario no encontrado');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await userRepo.changeUserPassword(userId, passwordHash);
};
