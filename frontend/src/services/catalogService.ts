import type { ApiResponse } from '../types/api.types';
import { apiClient } from '../api/client';

/**
 * Role from backend (PascalCase)
 */
interface RoleResponse {
    RoleId: number;
    RoleName: string;
    Description: string;
}

/**
 * CaseFileStatus from backend (PascalCase)
 */
interface CaseFileStatusResponse {
    StatusId: number;
    StatusName: string;
    Description: string;
}

/**
 * EvidenceType from backend (PascalCase)
 */
interface EvidenceTypeResponse {
    EvidenceTypeId: number;
    TypeName: string;
    Description: string;
}

/**
 * Frontend types (camelCase)
 */
export interface Role {
    id: number;
    name: string;
    description: string;
}

export interface CaseFileStatusCatalog {
    id: number;
    name: string;
    description: string;
}

export interface EvidenceTypeCatalog {
    id: number;
    name: string;
    description: string;
}

export const catalogService = {
    /**
     * Get all roles
     */
    async getRoles(): Promise<Role[]> {
        const response = await apiClient.get<ApiResponse<RoleResponse[]>>('/catalogs/roles');
        return response.data.data.map(role => ({
            id: role.RoleId,
            name: role.RoleName,
            description: role.Description,
        }));
    },

    /**
     * Get all case file statuses
     */
    async getCaseFileStatuses(): Promise<CaseFileStatusCatalog[]> {
        const response = await apiClient.get<ApiResponse<CaseFileStatusResponse[]>>('/catalogs/case-file-statuses');
        return response.data.data.map(status => ({
            id: status.StatusId,
            name: status.StatusName,
            description: status.Description,
        }));
    },

    /**
     * Get all evidence types
     */
    async getEvidenceTypes(): Promise<EvidenceTypeCatalog[]> {
        const response = await apiClient.get<ApiResponse<EvidenceTypeResponse[]>>('/catalogs/evidence-types');
        return response.data.data.map(type => ({
            id: type.EvidenceTypeId,
            name: type.TypeName,
            description: type.Description,
        }));
    },
};
