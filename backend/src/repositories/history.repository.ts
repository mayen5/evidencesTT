import { getPool } from '../config/database';
import sql from 'mssql';
import { ICaseFileHistory } from '../types/history.types';

/**
 * Get case file history
 */
export const getCaseFileHistory = async (caseFileId: number): Promise<ICaseFileHistory[]> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .execute('sp_GetCaseFileHistory');

    return result.recordset as ICaseFileHistory[];
};
