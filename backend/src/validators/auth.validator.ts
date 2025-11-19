import { z } from 'zod';

/**
 * Schema for user login
 */
export const loginSchema = z.object({
    email: z
        .string()
        .email('Email inválido')
        .min(1, 'El email es requerido'),
    password: z
        .string()
        .min(1, 'La contraseña es requerida'),
});

/**
 * Schema for user registration
 */
export const registerSchema = z.object({
    email: z
        .string()
        .email('Email inválido')
        .min(1, 'El email es requerido')
        .max(255, 'El email no puede exceder 255 caracteres'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(100, 'La contraseña no puede exceder 100 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
        ),
    firstName: z
        .string()
        .min(1, 'El nombre es requerido')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    lastName: z
        .string()
        .min(1, 'El apellido es requerido')
        .max(100, 'El apellido no puede exceder 100 caracteres'),
    roleId: z
        .number()
        .int('El roleId debe ser un número entero')
        .positive('El roleId debe ser mayor a 0')
        .optional()
        .default(2), // Default: Investigador
});

/**
 * Schema for token refresh
 */
export const refreshTokenSchema = z.object({
    refreshToken: z
        .string()
        .min(1, 'El refresh token es requerido'),
});

/**
 * Types derived from schemas
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
