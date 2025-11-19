import { getPool } from '../config/database';
import sql from 'mssql';
import { ICaseFileParticipant } from '../types/participant.types';

/**
 * Get all participants for a case file
 */
export const getCaseFileParticipants = async (caseFileId: number): Promise<ICaseFileParticipant[]> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .execute('sp_GetCaseFileParticipants');

    return result.recordset as ICaseFileParticipant[];
};

/**
 * Add participant to case file
 */
export const addCaseFileParticipant = async (
    caseFileId: number,
    userId: number,
    role: string | undefined,
    addedById: number
): Promise<number> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .input('CaseFileId', sql.Int, caseFileId)
        .input('UserId', sql.Int, userId)
        .input('Role', sql.NVarChar(100), role || null)
        .input('AddedById', sql.Int, addedById)
        .execute('sp_AddCaseFileParticipant');

    return result.recordset[ 0 ].NewParticipantId;
};

/**
 * Remove participant from case file
 */
export const removeCaseFileParticipant = async (
    participantId: number,
    removedById: number
): Promise<void> => {
    const pool = await getPool();
    await pool
        .request()
        .input('ParticipantId', sql.Int, participantId)
        .input('RemovedById', sql.Int, removedById)
        .execute('sp_RemoveCaseFileParticipant');
};
