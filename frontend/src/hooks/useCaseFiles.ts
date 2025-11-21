import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type {
    CreateCaseFileDTO,
    UpdateCaseFileDTO,
    CaseFileFilters,
} from '../types/caseFile.types';
import { caseFileService } from '../services/caseFileService';

interface ErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

// Query keys
export const caseFileKeys = {
    all: [ 'caseFiles' ] as const,
    lists: () => [ ...caseFileKeys.all, 'list' ] as const,
    list: (page: number, limit: number, filters?: CaseFileFilters) =>
        [ ...caseFileKeys.lists(), page, limit, filters ] as const,
    details: () => [ ...caseFileKeys.all, 'detail' ] as const,
    detail: (id: number) => [ ...caseFileKeys.details(), id ] as const,
    statistics: () => [ ...caseFileKeys.all, 'statistics' ] as const,
};

/**
 * Hook to get all case files with pagination and filters
 */
export const useCaseFiles = (page = 1, limit = 10, filters?: CaseFileFilters) => {
    return useQuery({
        queryKey: caseFileKeys.list(page, limit, filters),
        queryFn: () => caseFileService.getAll(page, limit, filters),
        staleTime: 30000, // 30 seconds
    });
};

/**
 * Hook to get a single case file by ID
 */
export const useCaseFile = (id: number) => {
    return useQuery({
        queryKey: caseFileKeys.detail(id),
        queryFn: () => caseFileService.getById(id),
        enabled: !!id,
    });
};

/**
 * Hook to get case file statistics
 */
export const useCaseFileStatistics = () => {
    return useQuery({
        queryKey: caseFileKeys.statistics(),
        queryFn: () => caseFileService.getStatistics(),
        staleTime: 60000, // 1 minute
    });
};

/**
 * Hook to create a case file
 */
export const useCreateCaseFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCaseFileDTO) => caseFileService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: caseFileKeys.lists() });
            queryClient.invalidateQueries({ queryKey: caseFileKeys.statistics() });
            toast.success('Expediente creado exitosamente');
        },
        onError: (error: ErrorResponse) => {
            toast.error(error?.response?.data?.message || 'Error al crear el expediente');
        },
    });
};

/**
 * Hook to update a case file
 */
export const useUpdateCaseFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCaseFileDTO }) =>
            caseFileService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: caseFileKeys.lists() });
            queryClient.invalidateQueries({ queryKey: caseFileKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: caseFileKeys.statistics() });
            toast.success('Expediente actualizado exitosamente');
        },
        onError: (error: ErrorResponse) => {
            toast.error(error?.response?.data?.message || 'Error al actualizar el expediente');
        },
    });
};

/**
 * Hook to delete a case file
 */
export const useDeleteCaseFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => caseFileService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: caseFileKeys.lists() });
            queryClient.invalidateQueries({ queryKey: caseFileKeys.statistics() });
            toast.success('Expediente eliminado exitosamente');
        },
        onError: (error: ErrorResponse) => {
            toast.error(error?.response?.data?.message || 'Error al eliminar el expediente');
        },
    });
};

/**
 * Hook to submit case file for review
 */
export const useSubmitCaseFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => caseFileService.submit(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: caseFileKeys.lists() });
            queryClient.invalidateQueries({ queryKey: caseFileKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: caseFileKeys.statistics() });
            toast.success('Expediente enviado a revisión');
        },
        onError: (error: ErrorResponse) => {
            toast.error(error?.response?.data?.message || 'Error al enviar el expediente');
        },
    });
};

/**
 * Hook to approve a case file
 */
export const useApproveCaseFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, approvedBy }: { id: number; approvedBy: number }) =>
            caseFileService.approve(id, approvedBy),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: caseFileKeys.lists() });
            queryClient.invalidateQueries({ queryKey: caseFileKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: caseFileKeys.statistics() });
            toast.success('Expediente aprobado exitosamente');
        },
        onError: (error: ErrorResponse) => {
            toast.error(error?.response?.data?.message || 'Error al aprobar el expediente');
        },
    });
};

/**
 * Hook to reject a case file
 */
export const useRejectCaseFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, rejectedBy, rejectionReason }: { id: number; rejectedBy: number; rejectionReason: string }) =>
            caseFileService.reject(id, rejectedBy, rejectionReason),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: caseFileKeys.lists() });
            queryClient.invalidateQueries({ queryKey: caseFileKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: caseFileKeys.statistics() });
            toast.success('Expediente rechazado');
        },
        onError: (error: ErrorResponse) => {
            toast.error(error?.response?.data?.message || 'Error al rechazar el expediente');
        },
    });
};
