import { z } from 'zod';

/**
 * Schema for creating a user
 */
export const createUserSchema = z.object({
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
        .positive('El roleId debe ser mayor a 0'),
});

/**
 * Schema for updating a user
 */
export const updateUserSchema = z.object({
    email: z
        .string()
        .email('Email inválido')
        .max(255, 'El email no puede exceder 255 caracteres')
        .optional(),
    firstName: z
        .string()
        .min(1, 'El nombre es requerido')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .optional(),
    lastName: z
        .string()
        .min(1, 'El apellido es requerido')
        .max(100, 'El apellido no puede exceder 100 caracteres')
        .optional(),
    roleId: z
        .number()
        .int('El roleId debe ser un número entero')
        .positive('El roleId debe ser mayor a 0')
        .optional(),
    isActive: z
        .boolean()
        .optional(),
});

/**
 * Schema for changing password
 */
export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, 'La contraseña actual es requerida'),
    newPassword: z
        .string()
        .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
        .max(100, 'La nueva contraseña no puede exceder 100 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'La nueva contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
        ),
});

/**
 * Schema for user ID parameter
 */
export const userIdSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, 'El ID debe ser un número')
        .transform(Number)
        .pipe(z.number().int().positive()),
});

/**
 * Types derived from schemas
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UserIdInput = z.infer<typeof userIdSchema>;
