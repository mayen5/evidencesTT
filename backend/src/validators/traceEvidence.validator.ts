import { z } from 'zod';

/**
 * Schema for adding trace evidence
 */
export const addTraceEvidenceSchema = z.object({
    caseFileId: z
        .number()
        .int('El caseFileId debe ser un número entero')
        .positive('El caseFileId debe ser mayor a 0'),
    traceEvidenceTypeId: z
        .number()
        .int('El traceEvidenceTypeId debe ser un número entero')
        .positive('El traceEvidenceTypeId debe ser mayor a 0'),
    description: z
        .string()
        .min(1, 'La descripción es requerida')
        .max(500, 'La descripción no puede exceder 500 caracteres'),
    location: z
        .string()
        .max(200, 'La ubicación no puede exceder 200 caracteres')
        .optional(),
    collectedBy: z
        .number()
        .int('El collectedBy debe ser un número entero')
        .positive('El collectedBy debe ser mayor a 0'),
    collectionDate: z
        .string()
        .datetime('Fecha inválida')
        .or(z.date())
        .optional()
        .default(() => new Date().toISOString()),
});

/**
 * Schema for getting trace evidence by case file
 */
export const getTraceEvidenceByCaseFileSchema = z.object({
    caseFileId: z
        .string()
        .regex(/^\d+$/, 'El caseFileId debe ser un número')
        .transform(Number)
        .pipe(z.number().int().positive()),
});

/**
 * Schema for trace evidence ID parameter
 */
export const traceEvidenceIdSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, 'El ID debe ser un número')
        .transform(Number)
        .pipe(z.number().int().positive()),
});

/**
 * Schema for getting all trace evidence (with pagination)
 */
export const getAllTraceEvidenceSchema = z.object({
    page: z
        .string()
        .optional()
        .default('1')
        .transform(Number)
        .pipe(z.number().int().positive()),
    pageSize: z
        .string()
        .optional()
        .default('10')
        .transform(Number)
        .pipe(z.number().int().positive().max(100)),
    search: z
        .string()
        .max(200, 'La búsqueda no puede exceder 200 caracteres')
        .optional(),
});

/**
 * Types derived from schemas
 */
export type AddTraceEvidenceInput = z.infer<typeof addTraceEvidenceSchema>;
export type GetTraceEvidenceByCaseFileInput = z.infer<typeof getTraceEvidenceByCaseFileSchema>;
export type TraceEvidenceIdInput = z.infer<typeof traceEvidenceIdSchema>;
export type GetAllTraceEvidenceInput = z.infer<typeof getAllTraceEvidenceSchema>;
