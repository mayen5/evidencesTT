import type { CaseFileHistory } from '../types/history.types';
import type { ApiResponse } from '../types/api.types';
import { apiClient } from '../api/client';

export const historyService = {
    /**
     * Get case file history
     */
    async getCaseFileHistory(caseFileId: number): Promise<CaseFileHistory[]> {
        const response = await apiClient.get<ApiResponse<CaseFileHistory[]>>(
            `/case-files/${caseFileId}/history`
        );
        return response.data.data;
    },
};
