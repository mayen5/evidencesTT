import { getPool } from '../config/database';
import sql from 'mssql';
import { ITraceEvidence, IAllTraceEvidenceRow } from '../types/traceEvidence.types';

/**
 * Add trace evidence to a case file
 */
export const addTraceEvidence = async (
    caseFileId: number,
    traceEvidenceTypeId: number,
    description: string,
    location: string | undefined,
    collectedBy: number,
    collectionDate: Date
): Promise<{ traceEvidenceId: number; message: string }> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .input('TraceEvidenceTypeId', sql.Int, traceEvidenceTypeId)
        .input('Title', sql.NVarChar(200), `Evidence ${new Date().getTime()}`)
        .input('Description', sql.NVarChar(sql.MAX), description)
        .input('CollectionDate', sql.DateTime2, collectionDate)
        .input('CollectionLocation', sql.NVarChar(300), location || null)
        .input('CollectedById', sql.Int, collectedBy)
        .input('StorageLocation', sql.NVarChar(200), null)
        .input('ChainOfCustody', sql.NVarChar(sql.MAX), null)
        .output('NewEvidenceId', sql.Int)
        .execute('sp_AddTraceEvidence');

    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[ 0 ];
    }

    throw new Error('Error al agregar evidencia');
};

/**
 * Get all trace evidence for a case file
 */
export const getTraceEvidenceByCaseFile = async (caseFileId: number): Promise<ITraceEvidence[]> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .execute('sp_GetTraceEvidenceByCaseFile');

    return (result.recordset || []) as ITraceEvidence[];
};

/**
 * Get all trace evidence with pagination
 */
export const getAllTraceEvidence = async (
    page: number,
    pageSize: number,
    search?: string
): Promise<IAllTraceEvidenceRow[]> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('PageNumber', sql.Int, page)
        .input('PageSize', sql.Int, pageSize)
        .input('Search', sql.NVarChar(200), search || null)
        .execute('sp_GetAllTraceEvidence');

    return (result.recordset || []) as IAllTraceEvidenceRow[];
};
