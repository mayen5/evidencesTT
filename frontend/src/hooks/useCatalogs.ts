import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../services/catalogService';

// Query keys
export const catalogKeys = {
    all: [ 'catalogs' ] as const,
    roles: () => [ ...catalogKeys.all, 'roles' ] as const,
    statuses: () => [ ...catalogKeys.all, 'statuses' ] as const,
    evidenceTypes: () => [ ...catalogKeys.all, 'evidenceTypes' ] as const,
};

/**
 * Hook to get all roles
 */
export const useRoles = () => {
    return useQuery({
        queryKey: catalogKeys.roles(),
        queryFn: () => catalogService.getRoles(),
        staleTime: 1000 * 60 * 60, // 1 hour - catalogs don't change often
    });
};

/**
 * Hook to get all case file statuses
 */
export const useCaseFileStatuses = () => {
    return useQuery({
        queryKey: catalogKeys.statuses(),
        queryFn: () => catalogService.getCaseFileStatuses(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

/**
 * Hook to get all evidence types
 */
export const useEvidenceTypes = () => {
    return useQuery({
        queryKey: catalogKeys.evidenceTypes(),
        queryFn: () => catalogService.getEvidenceTypes(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
