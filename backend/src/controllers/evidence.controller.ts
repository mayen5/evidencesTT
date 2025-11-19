import { Request, Response, NextFunction } from 'express';
import * as evidenceService from '../services/evidence.service';
import { addEvidenceSchema, getEvidenceByCaseFileSchema } from '../validators/evidence.validator';

/**
 * Add evidence
 * POST /api/v1/evidence
 */
export const addEvidence = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validatedData = addEvidenceSchema.parse(req.body);
        const result = await evidenceService.addEvidence(validatedData);

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get evidence by case file
 * GET /api/v1/evidence/case-file/:caseFileId
 */
export const getEvidenceByCaseFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { caseFileId } = getEvidenceByCaseFileSchema.parse(req.params);
        const result = await evidenceService.getEvidenceByCaseFile(caseFileId);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
