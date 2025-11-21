import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { participantService } from '../services/participantService';
import type { AddParticipantDTO } from '../types/participant.types';

interface ErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

// Query keys
export const participantKeys = {
    all: [ 'participants' ] as const,
    byCaseFile: (caseFileId: number) => [ ...participantKeys.all, 'caseFile', caseFileId ] as const,
};

/**
 * Hook to get participants by case file
 */
export const useParticipants = (caseFileId: number) => {
    return useQuery({
        queryKey: participantKeys.byCaseFile(caseFileId),
        queryFn: () => participantService.getParticipants(caseFileId),
        enabled: !!caseFileId,
        staleTime: 30000, // 30 seconds
    });
};

/**
 * Hook to add participant
 */
export const useAddParticipant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ caseFileId, data }: { caseFileId: number; data: AddParticipantDTO }) =>
            participantService.addParticipant(caseFileId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: participantKeys.byCaseFile(variables.caseFileId) });
            toast.success('Participante agregado exitosamente');
        },
        onError: (error: ErrorResponse) => {
            toast.error(error?.response?.data?.message || 'Error al agregar el participante');
        },
    });
};

/**
 * Hook to remove participant
 */
export const useRemoveParticipant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ caseFileId, participantId }: { caseFileId: number; participantId: number }) =>
            participantService.removeParticipant(caseFileId, participantId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: participantKeys.byCaseFile(variables.caseFileId) });
            toast.success('Participante removido exitosamente');
        },
        onError: (error: ErrorResponse) => {
            toast.error(error?.response?.data?.message || 'Error al remover el participante');
        },
    });
};
