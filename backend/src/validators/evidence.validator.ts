import { z } from 'zod';

/**
 * Schema for adding evidence
 */
export const addEvidenceSchema = z.object({
    caseFileId: z
        .number()
        .int('El caseFileId debe ser un número entero')
        .positive('El caseFileId debe ser mayor a 0'),
    evidenceTypeId: z
        .number()
        .int('El evidenceTypeId debe ser un número entero')
        .positive('El evidenceTypeId debe ser mayor a 0'),
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
 * Schema for getting evidence by case file
 */
export const getEvidenceByCaseFileSchema = z.object({
    caseFileId: z
        .string()
        .regex(/^\d+$/, 'El caseFileId debe ser un número')
        .transform(Number)
        .pipe(z.number().int().positive()),
});

/**
 * Schema for evidence ID parameter
 */
export const evidenceIdSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, 'El ID debe ser un número')
        .transform(Number)
        .pipe(z.number().int().positive()),
});

/**
 * Types derived from schemas
 */
export type AddEvidenceInput = z.infer<typeof addEvidenceSchema>;
export type GetEvidenceByCaseFileInput = z.infer<typeof getEvidenceByCaseFileSchema>;
export type EvidenceIdInput = z.infer<typeof evidenceIdSchema>;
