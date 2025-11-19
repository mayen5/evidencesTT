import * as catalogRepo from '../repositories/catalog.repository';

/**
 * Get all roles
 */
export const getAllRoles = async (): Promise<Array<{ RoleId: number; RoleName: string; Description: string }>> => {
    return await catalogRepo.getAllRoles();
};

/**
 * Get all case file statuses
 */
export const getAllCaseFileStatuses = async (): Promise<Array<{ StatusId: number; StatusName: string; Description: string }>> => {
    return await catalogRepo.getAllCaseFileStatuses();
};

/**
 * Get all evidence types
 */
export const getAllEvidenceTypes = async (): Promise<Array<{ EvidenceTypeId: number; TypeName: string; Description: string }>> => {
    return await catalogRepo.getAllEvidenceTypes();
};
