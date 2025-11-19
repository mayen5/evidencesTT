import { Request, Response, NextFunction } from 'express';
import { uploadAttachment, getAttachments, removeAttachment } from '../services/attachment.service';
import { handleMulterError } from '../middlewares/upload.middleware';

/**
 * Upload attachment
 * POST /api/v1/case-files/:caseFileId/attachments
 */
export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const caseFileId = parseInt(req.params.caseFileId);
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                error: 'Usuario no autenticado',
            });
            return;
        }

        if (!req.file) {
            res.status(400).json({
                success: false,
                error: 'No se proporcionó ningún archivo',
            });
            return;
        }

        const attachment = await uploadAttachment(caseFileId, req.file, userId);

        res.status(201).json({
            success: true,
            data: attachment,
            message: 'Archivo adjunto subido exitosamente',
        });
    } catch (error) {
        // Handle multer-specific errors
        try {
            handleMulterError(error);
        } catch {
            // Error is not from multer, pass to global error handler
        }
        next(error);
    }
};

/**
 * Get attachments for a case file
 * GET /api/v1/case-files/:caseFileId/attachments
 */
export const getCaseFileAttachments = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const caseFileId = parseInt(req.params.caseFileId);
        const includeDeleted = req.query.includeDeleted === 'true';

        const attachments = await getAttachments(caseFileId, includeDeleted);

        res.status(200).json({
            success: true,
            data: attachments,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete attachment
 * DELETE /api/v1/attachments/:attachmentId
 */
export const deleteAttachmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const attachmentId = parseInt(req.params.attachmentId);
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                error: 'Usuario no autenticado',
            });
            return;
        }

        const attachment = await removeAttachment(attachmentId, userId);

        res.status(200).json({
            success: true,
            data: attachment,
            message: 'Archivo adjunto eliminado exitosamente',
        });
    } catch (error) {
        next(error);
    }
};
