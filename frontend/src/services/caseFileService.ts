import type {
    CaseFile,
    CreateCaseFileDTO,
    UpdateCaseFileDTO,
    CaseFileFilters,
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
            pageSize: limit.toString(),
        });

        if (filters?.search) params.append('search', filters.search);
        if (filters?.statusId) params.append('statusId', filters.statusId.toString());
        if (filters?.userId) params.append('userId', filters.userId.toString());

        const response = await apiClient.get<ApiResponse<any>>(
            `/case-files?${params.toString()}`
        );

        // Transform backend response to frontend format
        const backendData = response.data.data;
        return {
            success: response.data.success,
            message: response.data.message || '',
            data: backendData.caseFiles || [],
            pagination: {
                page: backendData.page || page,
                limit: backendData.pageSize || limit,
                total: backendData.totalRecords || 0,
                totalPages: backendData.totalPages || 1,
            },
        };
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
        const response = await apiClient.patch<ApiResponse<CaseFile>>(`/case-files/${id}`, data);
        return response.data.data;
    },

    /**
     * Delete a case file
     */
    async delete(id: number): Promise<void> {
        await apiClient.delete(`/case-files/${id}`);
    },

    /**
     * Submit case file for review
     */
    async submit(id: number): Promise<CaseFile> {
        const response = await apiClient.post<ApiResponse<CaseFile>>(
            `/case-files/${id}/submit`
        );
        return response.data.data;
    },

    /**
     * Approve a case file
     */
    async approve(id: number, approvedBy: number): Promise<CaseFile> {
        const response = await apiClient.post<ApiResponse<CaseFile>>(
            `/case-files/${id}/approve`,
            { approvedBy }
        );
        return response.data.data;
    },

    /**
     * Reject a case file
     */
    async reject(id: number, rejectedBy: number, rejectionReason: string): Promise<CaseFile> {
        const response = await apiClient.post<ApiResponse<CaseFile>>(
            `/case-files/${id}/reject`,
            { rejectedBy, rejectionReason }
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
