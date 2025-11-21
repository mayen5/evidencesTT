import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { traceEvidenceService } from '../services/traceEvidenceService';
import type { AddTraceEvidenceDTO } from '../types/traceEvidence.types';

interface ErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

// Query keys
export const traceEvidenceKeys = {
    all: [ 'traceEvidence' ] as const,
    lists: () => [ ...traceEvidenceKeys.all, 'list' ] as const,
    list: (page: number, pageSize: number, search?: string) =>
        [ ...traceEvidenceKeys.lists(), { page, pageSize, search } ] as const,
    byCaseFile: (caseFileId: number) => [ ...traceEvidenceKeys.all, 'caseFile', caseFileId ] as const,
};

/**
 * Hook to get all trace evidence with pagination
 */
export const useAllTraceEvidence = (page: number = 1, pageSize: number = 10, search?: string) => {
    return useQuery({
        queryKey: traceEvidenceKeys.list(page, pageSize, search),
        queryFn: () => traceEvidenceService.getAllTraceEvidence(page, pageSize, search),
        staleTime: 30000, // 30 seconds
    });
};

/**
 * Hook to get trace evidence by case file
 */
export const useTraceEvidence = (caseFileId: number) => {
    return useQuery({
        queryKey: traceEvidenceKeys.byCaseFile(caseFileId),
        queryFn: () => traceEvidenceService.getTraceEvidenceByCaseFile(caseFileId),
        enabled: !!caseFileId,
        staleTime: 30000, // 30 seconds
    });
};

/**
 * Hook to add trace evidence
 */
export const useAddTraceEvidence = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddTraceEvidenceDTO) => traceEvidenceService.addTraceEvidence(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: traceEvidenceKeys.byCaseFile(variables.caseFileId) });
            queryClient.invalidateQueries({ queryKey: traceEvidenceKeys.lists() });
            // Also invalidate case file detail to update evidence count
            queryClient.invalidateQueries({ queryKey: [ 'caseFiles', 'detail', variables.caseFileId ] });
            toast.success('Indicio agregado exitosamente');
        },
        onError: (error: ErrorResponse) => {
            toast.error(error?.response?.data?.message || 'Error al agregar el indicio');
        },
    });
};
