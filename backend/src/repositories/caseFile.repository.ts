import { getPool } from '../config/database';
import sql from 'mssql';
import { ICaseFile, IPaginatedCaseFiles } from '../types/caseFile.types';

interface CaseFileRecord {
    CaseFileId: number;
    CaseNumber: string;
    Title: string;
    Description: string;
    StatusId: number;
    StatusName: string;
    Location: string | null;
    IncidentDate: Date;
    CreatedBy: number;
    CreatedByName: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    ApprovedBy: number | null;
    ApprovedAt: Date | null;
    EvidenceCount: number;
}

interface TotalRecordResult {
    TotalRecords: number;
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
        .input('Page', sql.Int, page)
        .input('PageSize', sql.Int, pageSize)
        .input('StatusId', sql.Int, statusId || null)
        .input('UserId', sql.Int, userId || null)
        .input('SearchTerm', sql.VarChar(200), search || null)
        .execute('sp_GetAllCaseFiles');

    // Type assertion for multiple recordsets
    const recordsets = result.recordsets as unknown as [ CaseFileRecord[], TotalRecordResult[] ];
    const caseFiles = recordsets[ 0 ] || [];
    const totalRecords = recordsets[ 1 ] ? recordsets[ 1 ][ 0 ].TotalRecords : 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
        caseFiles: caseFiles.map((cf: CaseFileRecord) => ({
            caseFileId: cf.CaseFileId,
            caseNumber: cf.CaseNumber,
            title: cf.Title,
            description: cf.Description,
            statusId: cf.StatusId,
            statusName: cf.StatusName,
            location: cf.Location || undefined,
            incidentDate: cf.IncidentDate,
            createdBy: cf.CreatedBy,
            createdByName: cf.CreatedByName,
            createdAt: cf.CreatedAt,
            updatedAt: cf.UpdatedAt,
            approvedBy: cf.ApprovedBy || undefined,
            approvedAt: cf.ApprovedAt || undefined,
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
    incidentDate?: Date
): Promise<{ message: string }> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .input('Title', sql.VarChar(200), title || null)
        .input('Description', sql.NVarChar(sql.MAX), description || null)
        .input('Location', sql.VarChar(200), location || null)
        .input('IncidentDate', sql.DateTime, incidentDate || null)
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
