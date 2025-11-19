import { z } from 'zod';

/**
 * Schema for creating a case file
 */
export const createCaseFileSchema = z.object({
    caseNumber: z
        .string()
        .min(1, 'El número de caso es requerido')
        .max(50, 'El número de caso no puede exceder 50 caracteres'),
    title: z
        .string()
        .min(1, 'El título es requerido')
        .max(200, 'El título no puede exceder 200 caracteres'),
    description: z
        .string()
        .min(1, 'La descripción es requerida'),
    location: z
        .string()
        .max(200, 'La ubicación no puede exceder 200 caracteres')
        .optional(),
    incidentDate: z
        .string()
        .datetime('Fecha inválida')
        .or(z.date()),
});

/**
 * Schema for updating a case file
 */
export const updateCaseFileSchema = z.object({
    title: z
        .string()
        .min(1, 'El título es requerido')
        .max(200, 'El título no puede exceder 200 caracteres')
        .optional(),
    description: z
        .string()
        .min(1, 'La descripción es requerida')
        .optional(),
    location: z
        .string()
        .max(200, 'La ubicación no puede exceder 200 caracteres')
        .optional(),
    incidentDate: z
        .string()
        .datetime('Fecha inválida')
        .or(z.date())
        .optional(),
});

/**
 * Schema for getting all case files with pagination
 */
export const getAllCaseFilesSchema = z.object({
    page: z
        .number()
        .int('La página debe ser un número entero')
        .positive('La página debe ser mayor a 0')
        .optional()
        .default(1),
    pageSize: z
        .number()
        .int('El tamaño de página debe ser un número entero')
        .positive('El tamaño de página debe ser mayor a 0')
        .max(100, 'El tamaño máximo de página es 100')
        .optional()
        .default(10),
    statusId: z
        .number()
        .int('El statusId debe ser un número entero')
        .positive('El statusId debe ser mayor a 0')
        .optional(),
    userId: z
        .number()
        .int('El userId debe ser un número entero')
        .positive('El userId debe ser mayor a 0')
        .optional(),
    search: z
        .string()
        .max(200, 'El término de búsqueda no puede exceder 200 caracteres')
        .optional(),
});

/**
 * Schema for approving a case file
 */
export const approveCaseFileSchema = z.object({
    approvedBy: z
        .number()
        .int('El approvedBy debe ser un número entero')
        .positive('El approvedBy debe ser mayor a 0'),
});

/**
 * Schema for rejecting a case file
 */
export const rejectCaseFileSchema = z.object({
    rejectedBy: z
        .number()
        .int('El rejectedBy debe ser un número entero')
        .positive('El rejectedBy debe ser mayor a 0'),
    rejectionReason: z
        .string()
        .min(1, 'La razón de rechazo es requerida')
        .max(500, 'La razón de rechazo no puede exceder 500 caracteres'),
});

/**
 * Schema for case file ID parameter
 */
export const caseFileIdSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, 'El ID debe ser un número')
        .transform(Number)
        .pipe(z.number().int().positive()),
});

/**
 * Types derived from schemas
 */
export type CreateCaseFileInput = z.infer<typeof createCaseFileSchema>;
export type UpdateCaseFileInput = z.infer<typeof updateCaseFileSchema>;
export type GetAllCaseFilesInput = z.infer<typeof getAllCaseFilesSchema>;
export type ApproveCaseFileInput = z.infer<typeof approveCaseFileSchema>;
export type RejectCaseFileInput = z.infer<typeof rejectCaseFileSchema>;
export type CaseFileIdInput = z.infer<typeof caseFileIdSchema>;
