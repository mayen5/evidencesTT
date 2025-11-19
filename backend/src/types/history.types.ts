/**
 * Case File History interface (database format)
 */
export interface ICaseFileHistory {
    Id: number;
    CaseFileId: number;
    ChangedById: number;
    ChangedByUsername?: string;
    ChangedByFirstName?: string;
    ChangedByLastName?: string;
    ChangeType: string;
    OldValue?: string;
    NewValue?: string;
    Comments?: string;
    ChangedAt: Date;
}

/**
 * Case File History response (camelCase for frontend)
 */
export interface ICaseFileHistoryResponse {
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
    changedAt: Date;
}
