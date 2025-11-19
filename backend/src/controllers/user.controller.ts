import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

/**
 * Get all users with pagination
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const roleId = req.query.roleId ? parseInt(req.query.roleId as string) : undefined;
        const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
        const search = req.query.search as string | undefined;

        const result = await userService.getAllUsers(page, pageSize, roleId, isActive, search);

        res.json({
            success: true,
            data: {
                users: result.users,
                pagination: {
                    page,
                    pageSize,
                    totalRecords: result.totalRecords,
                    totalPages: Math.ceil(result.totalRecords / pageSize),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user by ID
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = parseInt(req.params.id);
        const user = await userService.getUserById(userId);

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new user
 */
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, email, password, firstName, lastName, roleId } = req.body;

        const user = await userService.createUser(username, email, password, firstName, lastName, roleId);

        res.status(201).json({
            success: true,
            data: user,
            message: 'Usuario creado exitosamente',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = parseInt(req.params.id);
        const { email, firstName, lastName, roleId } = req.body;

        const user = await userService.updateUser(userId, { email, firstName, lastName, roleId });

        res.json({
            success: true,
            data: user,
            message: 'Usuario actualizado exitosamente',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = parseInt(req.params.id);
        await userService.deleteUser(userId);

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle user active status
 */
export const toggleUserActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = parseInt(req.params.id);
        const { isActive } = req.body;

        const user = await userService.toggleUserActive(userId, isActive);

        res.json({
            success: true,
            data: user,
            message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Change user password
 */
export const changeUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = parseInt(req.params.id);
        const { newPassword } = req.body;

        await userService.changeUserPassword(userId, newPassword);

        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente',
        });
    } catch (error) {
        next(error);
    }
};
