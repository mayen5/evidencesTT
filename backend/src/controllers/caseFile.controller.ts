import { Request, Response, NextFunction } from 'express';
import * as caseFileService from '../services/caseFile.service';
import {
    createCaseFileSchema,
    updateCaseFileSchema,
    getAllCaseFilesSchema,
    approveCaseFileSchema,
    rejectCaseFileSchema,
    caseFileIdSchema,
} from '../validators/caseFile.validator';

/**
 * Create case file
 * POST /api/v1/case-files
 */
export const createCaseFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validatedData = createCaseFileSchema.parse(req.body);
        const userId = req.user?.userId; // From auth middleware

        if (!userId) {
            res.status(401).json({ success: false, message: 'Usuario no autenticado' });
            return;
        }

        const result = await caseFileService.createCaseFile(validatedData, userId);

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get case file by ID
 * GET /api/v1/case-files/:id
 */
export const getCaseFileById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = caseFileIdSchema.parse(req.params);
        const result = await caseFileService.getCaseFileById(id);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all case files
 * GET /api/v1/case-files
 */
export const getAllCaseFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = {
            page: req.query.page ? Number(req.query.page) : 1,
            pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
            statusId: req.query.statusId ? Number(req.query.statusId) : undefined,
            userId: req.query.userId ? Number(req.query.userId) : undefined,
            search: req.query.search ? String(req.query.search) : undefined,
        };

        const validatedData = getAllCaseFilesSchema.parse(query);
        const result = await caseFileService.getAllCaseFiles(validatedData);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update case file
 * PATCH /api/v1/case-files/:id
 */
export const updateCaseFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = caseFileIdSchema.parse(req.params);
        const validatedData = updateCaseFileSchema.parse(req.body);
        const userId = req.user?.userId || 1;

        const result = await caseFileService.updateCaseFile(id, validatedData, userId);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Submit case file for review
 * POST /api/v1/case-files/:id/submit
 */
export const submitCaseFileForReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = caseFileIdSchema.parse(req.params);
        const result = await caseFileService.submitCaseFileForReview(id);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Approve case file
 * POST /api/v1/case-files/:id/approve
 */
export const approveCaseFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = caseFileIdSchema.parse(req.params);
        const validatedData = approveCaseFileSchema.parse(req.body);

        const result = await caseFileService.approveCaseFile(id, validatedData);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reject case file
 * POST /api/v1/case-files/:id/reject
 */
export const rejectCaseFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = caseFileIdSchema.parse(req.params);
        const validatedData = rejectCaseFileSchema.parse(req.body);

        const result = await caseFileService.rejectCaseFile(id, validatedData);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete case file
 * DELETE /api/v1/case-files/:id
 */
export const deleteCaseFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = caseFileIdSchema.parse(req.params);
        const result = await caseFileService.deleteCaseFile(id);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get case files statistics
 * GET /api/v1/case-files/statistics
 */
export const getCaseFileStatistics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await caseFileService.getCaseFileStatistics();

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
