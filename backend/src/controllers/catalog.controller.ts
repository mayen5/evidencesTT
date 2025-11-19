import { Request, Response, NextFunction } from 'express';
import * as catalogService from '../services/catalog.service';

/**
 * Get all roles
 * GET /api/v1/catalogs/roles
 */
export const getRoles = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await catalogService.getAllRoles();

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all case file statuses
 * GET /api/v1/catalogs/case-file-statuses
 */
export const getCaseFileStatuses = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await catalogService.getAllCaseFileStatuses();

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all evidence types
 * GET /api/v1/catalogs/evidence-types
 */
export const getEvidenceTypes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await catalogService.getAllEvidenceTypes();

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
