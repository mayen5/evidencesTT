import { useQuery } from '@tanstack/react-query';
import { historyService } from '../services/historyService';

// Query keys
export const historyKeys = {
    all: [ 'history' ] as const,
    byCaseFile: (caseFileId: number) => [ ...historyKeys.all, 'caseFile', caseFileId ] as const,
};

/**
 * Hook to get case file history
 */
export const useCaseFileHistory = (caseFileId: number) => {
    return useQuery({
        queryKey: historyKeys.byCaseFile(caseFileId),
        queryFn: () => historyService.getCaseFileHistory(caseFileId),
        enabled: !!caseFileId,
        staleTime: 10000, // 10 seconds - history updates frequently
    });
};
