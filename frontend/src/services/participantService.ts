import type { CaseFileParticipant, AddParticipantDTO } from '../types/participant.types';
import type { ApiResponse } from '../types/api.types';
import { apiClient } from '../api/client';

export const participantService = {
    /**
     * Get all participants for a case file
     */
    async getParticipants(caseFileId: number): Promise<CaseFileParticipant[]> {
        const response = await apiClient.get<ApiResponse<CaseFileParticipant[]>>(
            `/case-files/${caseFileId}/participants`
        );
        return response.data.data;
    },

    /**
     * Add participant to case file
     */
    async addParticipant(
        caseFileId: number,
        data: AddParticipantDTO
    ): Promise<{ participantId: number; message: string }> {
        const response = await apiClient.post<ApiResponse<{ participantId: number; message: string }>>(
            `/case-files/${caseFileId}/participants`,
            data
        );
        return response.data.data;
    },

    /**
     * Remove participant from case file
     */
    async removeParticipant(caseFileId: number, participantId: number): Promise<void> {
        await apiClient.delete(`/case-files/${caseFileId}/participants/${participantId}`);
    },
};
