import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { loginSchema, registerSchema, refreshTokenSchema } from '../validators/auth.validator';
import { verifyRefreshToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

/**
 * Login controller
 * POST /api/v1/auth/login
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const result = await authService.login(validatedData);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Register controller
 * POST /api/v1/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const result = await authService.register(validatedData);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh token controller
 * POST /api/v1/auth/refresh
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken: token } = refreshTokenSchema.parse(req.body);

        // Verify refresh token
        const decoded = verifyRefreshToken(token);

        if (!decoded) {
            throw new ApiError(401, 'Token de refresco inválido');
        }

        // Generate new access token
        const result = await authService.refreshAccessToken(decoded.userId, decoded.email, decoded.roleId);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logout controller (optional - token invalidation can be handled client-side)
 * POST /api/v1/auth/logout
 */
export const logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // In a stateless JWT setup, logout is typically handled client-side by removing tokens
        // For additional security, you could implement a token blacklist here

        res.status(200).json({
            success: true,
            message: 'Sesión cerrada exitosamente',
        });
    } catch (error) {
        next(error);
    }
};
