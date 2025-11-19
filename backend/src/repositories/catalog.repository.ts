import { getPool } from '../config/database';

interface Role {
    RoleId: number;
    RoleName: string;
    Description: string;
}

interface CaseFileStatus {
    StatusId: number;
    StatusName: string;
    Description: string;
}

interface EvidenceType {
    EvidenceTypeId: number;
    TypeName: string;
    Description: string;
}

/**
 * Get all roles
 */
export const getAllRoles = async (): Promise<Role[]> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .query('SELECT Id as RoleId, Name as RoleName, Description FROM Roles ORDER BY Id');

    return result.recordset || [];
};

/**
 * Get all case file statuses
 */
export const getAllCaseFileStatuses = async (): Promise<CaseFileStatus[]> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .query('SELECT Id as StatusId, Name as StatusName, Description FROM CaseFileStatus ORDER BY Id');

    return result.recordset || [];
};

/**
 * Get all evidence types
 */
export const getAllEvidenceTypes = async (): Promise<EvidenceType[]> => {
    const pool = await getPool();
    const result = await pool
        .request()
        .query('SELECT Id as EvidenceTypeId, Name as TypeName, Description FROM EvidenceTypes ORDER BY Name');

    return result.recordset || [];
};
