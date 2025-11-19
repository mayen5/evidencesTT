import { getPool } from '../config/database';
import sql from 'mssql';
import { IAttachment } from '../types/attachment.types';

/**
 * Add attachment to case file
 */
export const addAttachment = async (
    caseFileId: number,
    fileName: string,
    filePath: string,
    fileSize: number,
    mimeType: string,
    uploadedById: number
): Promise<IAttachment> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .input('FileName', sql.NVarChar(255), fileName)
        .input('FilePath', sql.NVarChar(500), filePath)
        .input('FileSize', sql.BigInt, fileSize)
        .input('MimeType', sql.NVarChar(100), mimeType)
        .input('UploadedById', sql.Int, uploadedById)
        .execute('sp_AddAttachment');

    return result.recordset[ 0 ] as IAttachment;
};

/**
 * Get all attachments for a case file
 */
export const getAttachmentsByCaseFile = async (
    caseFileId: number,
    includeDeleted: boolean = false
): Promise<IAttachment[]> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .input('IncludeDeleted', sql.Bit, includeDeleted)
        .execute('sp_GetAttachmentsByCaseFile');

    return result.recordset as IAttachment[];
};

/**
 * Delete (soft delete) an attachment
 */
export const deleteAttachment = async (
    attachmentId: number,
    deletedById: number
): Promise<IAttachment> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('AttachmentId', sql.Int, attachmentId)
        .input('DeletedById', sql.Int, deletedById)
        .execute('sp_DeleteAttachment');

    return result.recordset[ 0 ] as IAttachment;
};
