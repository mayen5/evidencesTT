import type {
    CaseFile,
    CreateCaseFileDTO,
    UpdateCaseFileDTO,
    CaseFileFilters,
    CaseFileStatus,
} from '../types/caseFile.types';
import type { PaginatedResponse, ApiResponse } from '../types/api.types';
import { apiClient } from '../api/client';

interface CaseFileStatistics {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
}

export const caseFileService = {
    /**
     * Get all case files with optional filters and pagination
     */
    async getAll(
        page = 1,
        limit = 10,
        filters?: CaseFileFilters
    ): Promise<PaginatedResponse<CaseFile>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(filters?.search && { search: filters.search }),
            ...(filters?.statusId && { statusId: filters.statusId.toString() }),
            ...(filters?.technicianId && { technicianId: filters.technicianId.toString() }),
            ...(filters?.coordinatorId && { coordinatorId: filters.coordinatorId.toString() }),
            ...(filters?.fromDate && { fromDate: filters.fromDate }),
            ...(filters?.toDate && { toDate: filters.toDate }),
        });

        const response = await apiClient.get<PaginatedResponse<CaseFile>>(
            `/case-files?${params.toString()}`
        );
        return response.data;
    },

    /**
     * Get a case file by ID
     */
    async getById(id: number): Promise<CaseFile> {
        const response = await apiClient.get<ApiResponse<CaseFile>>(`/case-files/${id}`);
        return response.data.data;
    },

    /**
     * Create a new case file
     */
    async create(data: CreateCaseFileDTO): Promise<CaseFile> {
        const response = await apiClient.post<ApiResponse<CaseFile>>('/case-files', data);
        return response.data.data;
    },

    /**
     * Update a case file
     */
    async update(id: number, data: UpdateCaseFileDTO): Promise<CaseFile> {
        const response = await apiClient.put<ApiResponse<CaseFile>>(`/case-files/${id}`, data);
        return response.data.data;
    },

    /**
     * Delete a case file
     */
    async delete(id: number): Promise<void> {
        await apiClient.delete(`/case-files/${id}`);
    },

    /**
     * Update case file status
     */
    async updateStatus(id: number, status: CaseFileStatus): Promise<CaseFile> {
        const response = await apiClient.patch<ApiResponse<CaseFile>>(
            `/case-files/${id}/status`,
            { status }
        );
        return response.data.data;
    },

    /**
     * Approve a case file
     */
    async approve(id: number): Promise<CaseFile> {
        const response = await apiClient.post<ApiResponse<CaseFile>>(
            `/case-files/${id}/approve`
        );
        return response.data.data;
    },

    /**
     * Reject a case file
     */
    async reject(id: number, reason: string): Promise<CaseFile> {
        const response = await apiClient.post<ApiResponse<CaseFile>>(
            `/case-files/${id}/reject`,
            { reason }
        );
        return response.data.data;
    },

    /**
     * Get case file statistics
     */
    async getStatistics(): Promise<CaseFileStatistics> {
        const response = await apiClient.get<ApiResponse<CaseFileStatistics>>('/case-files/statistics');
        return response.data.data;
    },
};
