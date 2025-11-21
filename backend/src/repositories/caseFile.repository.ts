import { getPool } from '../config/database';
import sql from 'mssql';
import { ICaseFile, IPaginatedCaseFiles } from '../types/caseFile.types';

interface CaseFileRecord {
    Id: number;
    CaseNumber: string;
    Title: string;
    Description: string;
    IncidentDate: Date;
    IncidentLocation: string | null;
    StatusId: number;
    StatusName: string;
    RegisteredById: number;
    RegisteredByName: string;
    ReviewedById: number | null;
    ReviewedByName: string | null;
    RejectionReason: string | null;
    RegisteredAt: Date;
    ReviewedAt: Date | null;
    ApprovedAt: Date | null;
    EvidenceCount: number;
}

/**
 * Create a new case file
 */
export const createCaseFile = async (
    caseNumber: string,
    title: string,
    description: string,
    location: string | undefined,
    incidentDate: Date,
    createdBy: number
): Promise<{ caseFileId: number; message: string }> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseNumber', sql.VarChar(50), caseNumber)
        .input('Title', sql.VarChar(200), title)
        .input('Description', sql.NVarChar(sql.MAX), description)
        .input('Location', sql.VarChar(300), location || null)
        .input('IncidentDate', sql.DateTime, incidentDate)
        .input('CreatedById', sql.Int, createdBy)
        .output('NewCaseFileId', sql.Int)
        .execute('sp_CreateCaseFile');

    const caseFileId = result.output.NewCaseFileId;

    return {
        caseFileId,
        message: 'Expediente creado exitosamente',
    };
};

/**
 * Get case file by ID
 */
export const getCaseFileById = async (caseFileId: number): Promise<ICaseFile | null> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .execute('sp_GetCaseFileById');

    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[ 0 ] as ICaseFile;
    }

    return null;
};

/**
 * Get all case files with pagination
 */
export const getAllCaseFiles = async (
    page: number,
    pageSize: number,
    statusId?: number,
    userId?: number,
    search?: string
): Promise<IPaginatedCaseFiles> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('PageNumber', sql.Int, page)
        .input('PageSize', sql.Int, pageSize)
        .input('StatusId', sql.Int, statusId || null)
        .input('RegisteredById', sql.Int, userId || null)
        .input('SearchTerm', sql.VarChar(255), search || null)
        .output('TotalRecords', sql.Int)
        .execute('sp_GetAllCaseFiles');

    const caseFiles = result.recordset || [];
    const totalRecords = result.output.TotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
        caseFiles: caseFiles.map((cf: CaseFileRecord) => ({
            caseFileId: cf.Id,
            caseNumber: cf.CaseNumber,
            title: cf.Title,
            description: cf.Description,
            statusId: cf.StatusId,
            statusName: cf.StatusName,
            location: cf.IncidentLocation || undefined,
            incidentDate: cf.IncidentDate,
            createdBy: cf.RegisteredById,
            createdByName: cf.RegisteredByName,
            reviewedBy: cf.ReviewedById || undefined,
            reviewedByName: cf.ReviewedByName || undefined,
            rejectionReason: cf.RejectionReason || undefined,
            createdAt: cf.RegisteredAt,
            reviewedAt: cf.ReviewedAt || undefined,
            approvedAt: cf.ApprovedAt || undefined,
            updatedAt: cf.RegisteredAt,
            evidenceCount: cf.EvidenceCount,
        })),
        totalRecords,
        page,
        pageSize,
        totalPages,
    };
};

/**
 * Update case file
 */
export const updateCaseFile = async (
    caseFileId: number,
    title?: string,
    description?: string,
    location?: string,
    incidentDate?: Date,
    updatedById: number = 1
): Promise<{ message: string }> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .input('Title', sql.NVarChar(200), title || null)
        .input('Description', sql.NVarChar(sql.MAX), description || null)
        .input('IncidentDate', sql.DateTime2, incidentDate || null)
        .input('Location', sql.NVarChar(300), location || null)
        .input('Priority', sql.Int, null)
        .input('UpdatedById', sql.Int, updatedById)
        .execute('sp_UpdateCaseFile');

    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[ 0 ];
    }

    return { message: 'Caso actualizado correctamente' };
};

/**
 * Submit case file for review
 */
export const submitCaseFileForReview = async (caseFileId: number): Promise<{ message: string }> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .execute('sp_SubmitCaseFileForReview');

    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[ 0 ];
    }

    return { message: 'Caso enviado a revisión correctamente' };
};

/**
 * Approve case file
 */
export const approveCaseFile = async (
    caseFileId: number,
    approvedBy: number
): Promise<{ message: string }> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .input('ApprovedBy', sql.Int, approvedBy)
        .execute('sp_ApproveCaseFile');

    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[ 0 ];
    }

    return { message: 'Caso aprobado correctamente' };
};

/**
 * Reject case file
 */
export const rejectCaseFile = async (
    caseFileId: number,
    rejectedBy: number,
    rejectionReason: string
): Promise<{ message: string }> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .input('RejectedBy', sql.Int, rejectedBy)
        .input('RejectionReason', sql.VarChar(500), rejectionReason)
        .execute('sp_RejectCaseFile');

    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[ 0 ];
    }

    return { message: 'Caso rechazado correctamente' };
};

/**
 * Delete case file
 */
export const deleteCaseFile = async (caseFileId: number): Promise<{ message: string }> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .execute('sp_DeleteCaseFile');

    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[ 0 ];
    }

    return { message: 'Caso eliminado correctamente' };
};

/**
 * Get case file statistics
 */
export const getCaseFileStatistics = async (): Promise<{
    total: number;
    approved: number;
    rejected: number;
    pending: number;
}> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .query(`
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN StatusId = 3 THEN 1 ELSE 0 END) AS approved,
                SUM(CASE WHEN StatusId = 4 THEN 1 ELSE 0 END) AS rejected,
                SUM(CASE WHEN StatusId IN (1, 2) THEN 1 ELSE 0 END) AS pending
            FROM CaseFiles
        `);

    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[ 0 ];
    }

    return {
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
    };
};
