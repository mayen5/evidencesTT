import { Request, Response, NextFunction } from 'express';
import * as traceEvidenceService from '../services/traceEvidence.service';
import { addTraceEvidenceSchema, getTraceEvidenceByCaseFileSchema, getAllTraceEvidenceSchema } from '../validators/traceEvidence.validator';

/**
 * Add trace evidence
 * POST /api/v1/trace-evidence
 */
export const addTraceEvidence = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validatedData = addTraceEvidenceSchema.parse(req.body);
        const result = await traceEvidenceService.addTraceEvidence(validatedData);

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get trace evidence by case file
 * GET /api/v1/trace-evidence/case-file/:caseFileId
 */
export const getTraceEvidenceByCaseFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { caseFileId } = getTraceEvidenceByCaseFileSchema.parse(req.params);
        const result = await traceEvidenceService.getTraceEvidenceByCaseFile(caseFileId);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all trace evidence with pagination
 * GET /api/v1/trace-evidence
 */
export const getAllTraceEvidence = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { page, pageSize, search } = getAllTraceEvidenceSchema.parse(req.query);
        const result = await traceEvidenceService.getAllTraceEvidence(page, pageSize, search);

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};
