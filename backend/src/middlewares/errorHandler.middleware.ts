import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export const errorHandler = (
    err: AppError | ZodError | Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        logger.warn('Validation Error:', {
            errors: err.errors,
            path: req.path,
            method: req.method,
        });

        res.status(400).json({
            success: false,
            error: 'Error de validación',
            details: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }

    // Handle custom ApiError
    if (err instanceof ApiError) {
        logger.warn('API Error:', {
            statusCode: err.statusCode,
            message: err.message,
            path: req.path,
            method: req.method,
        });

        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
        return;
    }

    // Handle SQL errors
    if (err.message && err.message.includes('MSSQL')) {
        logger.error('Database Error:', {
            message: err.message,
            path: req.path,
            method: req.method,
        });

        res.status(500).json({
            success: false,
            error: 'Error de base de datos',
            ...(process.env.NODE_ENV === 'development' && { details: err.message }),
        });
        return;
    }

    // Handle generic errors
    const statusCode = (err as AppError).statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    logger.error('Error Handler:', {
        statusCode,
        message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        error: 'Recurso no encontrado',
        message: `Ruta ${req.method} ${req.path} no encontrada`,
    });
};

export default { errorHandler, notFoundHandler };
