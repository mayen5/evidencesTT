/**
 * Case File History Interface (matches backend ICaseFileHistoryResponse)
 */
export interface CaseFileHistory {
    id: number;
    caseFileId: number;
    changedById: number;
    changedByUsername?: string;
    changedByFirstName?: string;
    changedByLastName?: string;
    changeType: string;
    oldValue?: string;
    newValue?: string;
    comments?: string;
    changedAt: string;
}

/**
 * History Change Types
 */
export const HistoryChangeType = {
    STATUS_CHANGE: 'STATUS_CHANGE',
    FIELD_UPDATE: 'FIELD_UPDATE',
    EVIDENCE_ADDED: 'EVIDENCE_ADDED',
    PARTICIPANT_ADDED: 'PARTICIPANT_ADDED',
    PARTICIPANT_REMOVED: 'PARTICIPANT_REMOVED',
    ATTACHMENT_ADDED: 'ATTACHMENT_ADDED',
    ATTACHMENT_DELETED: 'ATTACHMENT_DELETED',
} as const;

export type HistoryChangeType = typeof HistoryChangeType[ keyof typeof HistoryChangeType ];
