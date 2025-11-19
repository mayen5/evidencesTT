import * as historyRepo from '../repositories/history.repository';
import { ICaseFileHistoryResponse } from '../types/history.types';

/**
 * Get case file history
 */
export const getCaseFileHistory = async (caseFileId: number): Promise<ICaseFileHistoryResponse[]> => {
    const history = await historyRepo.getCaseFileHistory(caseFileId);

    return history.map(h => ({
        id: h.Id,
        caseFileId: h.CaseFileId,
        changedById: h.ChangedById,
        changedByUsername: h.ChangedByUsername,
        changedByFirstName: h.ChangedByFirstName,
        changedByLastName: h.ChangedByLastName,
        changeType: h.ChangeType,
        oldValue: h.OldValue,
        newValue: h.NewValue,
        comments: h.Comments,
        changedAt: h.ChangedAt,
    }));
};
