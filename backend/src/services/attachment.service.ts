import path from 'path';
import fs from 'fs/promises';
import {
    addAttachment,
    getAttachmentsByCaseFile,
    deleteAttachment
} from '../repositories/attachment.repository';
import { IAttachment, IAttachmentResponse } from '../types/attachment.types';
import { logger } from '../utils/logger';

/**
 * Upload attachment to case file
 */
export const uploadAttachment = async (
    caseFileId: number,
    file: Express.Multer.File,
    uploadedById: number
): Promise<IAttachmentResponse> => {
    const fileName = file.filename;
    const filePath = `/uploads/${fileName}`;
    const fileSize = file.size;
    const mimeType = file.mimetype;

    const attachment = await addAttachment(
        caseFileId,
        file.originalname,
        filePath,
        fileSize,
        mimeType,
        uploadedById
    );

    return mapToResponse(attachment);
};

/**
 * Get attachments for a case file
 */
export const getAttachments = async (
    caseFileId: number,
    includeDeleted: boolean = false
): Promise<IAttachmentResponse[]> => {
    const attachments = await getAttachmentsByCaseFile(caseFileId, includeDeleted);
    return attachments.map(mapToResponse);
};

/**
 * Delete an attachment
 */
export const removeAttachment = async (
    attachmentId: number,
    deletedById: number
): Promise<IAttachmentResponse> => {
    const attachment = await deleteAttachment(attachmentId, deletedById);

    // Optionally delete physical file
    try {
        const fullPath = path.join(process.cwd(), attachment.FilePath);
        await fs.unlink(fullPath);
    } catch (error) {
        // Log error but don't fail the operation
        logger.error('Failed to delete physical file:', error);
    }

    return mapToResponse(attachment);
};

/**
 * Map database attachment to response format
 */
const mapToResponse = (attachment: IAttachment): IAttachmentResponse => {
    return {
        attachmentId: attachment.AttachmentId,
        caseFileId: attachment.CaseFileId,
        fileName: attachment.FileName,
        filePath: attachment.FilePath,
        fileSize: attachment.FileSize,
        mimeType: attachment.MimeType,
        uploadedById: attachment.UploadedById,
        uploadedByName: attachment.UploadedByName,
        uploadedAt: attachment.UploadedAt,
        isDeleted: attachment.IsDeleted,
    };
};
