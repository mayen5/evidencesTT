import type { TraceEvidence, AddTraceEvidenceDTO, PaginatedTraceEvidenceResponse } from '../types/traceEvidence.types';
import type { ApiResponse } from '../types/api.types';
import { apiClient } from '../api/client';

export const traceEvidenceService = {
    /**
     * Add trace evidence to a case file
     */
    async addTraceEvidence(data: AddTraceEvidenceDTO): Promise<{ traceEvidenceId: number; message: string }> {
        const response = await apiClient.post<ApiResponse<{ traceEvidenceId: number; message: string }>>(
            '/trace-evidence',
            data
        );
        return response.data.data;
    },

    /**
     * Get all trace evidence for a case file
     */
    async getTraceEvidenceByCaseFile(caseFileId: number): Promise<TraceEvidence[]> {
        const response = await apiClient.get<ApiResponse<TraceEvidence[]>>(
            `/trace-evidence/case-file/${caseFileId}`
        );
        return response.data.data;
    },

    /**
     * Get all trace evidence with pagination
     */
    async getAllTraceEvidence(page: number = 1, pageSize: number = 10, search?: string): Promise<PaginatedTraceEvidenceResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        if (search) {
            params.append('search', search);
        }

        const response = await apiClient.get<any>(
            `/trace-evidence?${params.toString()}`
        );

        // Backend returns { success, data: [...], pagination: {...} }
        return {
            data: response.data.data || [],
            pagination: response.data.pagination || { page, pageSize, total: 0, totalPages: 0 },
        };
    },
};
