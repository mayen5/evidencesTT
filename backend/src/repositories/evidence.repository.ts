import { getPool } from '../config/database';
import sql from 'mssql';
import { IEvidence } from '../types/evidence.types';

/**
 * Add evidence to a case file
 */
export const addEvidence = async (
    caseFileId: number,
    evidenceTypeId: number,
    description: string,
    location: string | undefined,
    collectedBy: number,
    collectionDate: Date
): Promise<{ evidenceId: number; message: string }> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .input('EvidenceTypeId', sql.Int, evidenceTypeId)
        .input('Title', sql.NVarChar(200), `Evidence ${new Date().getTime()}`)
        .input('Description', sql.NVarChar(sql.MAX), description)
        .input('CollectionDate', sql.DateTime2, collectionDate)
        .input('CollectionLocation', sql.NVarChar(300), location || null)
        .input('CollectedById', sql.Int, collectedBy)
        .input('StorageLocation', sql.NVarChar(200), null)
        .input('ChainOfCustody', sql.NVarChar(sql.MAX), null)
        .output('NewEvidenceId', sql.Int)
        .execute('sp_AddEvidence');

    if (result.recordset && result.recordset.length > 0) {
        return result.recordset[ 0 ];
    }

    throw new Error('Error al agregar evidencia');
};

/**
 * Get all evidence for a case file
 */
export const getEvidenceByCaseFile = async (caseFileId: number): Promise<IEvidence[]> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .execute('sp_GetEvidenceByCaseFile');

    return (result.recordset || []) as IEvidence[];
};
