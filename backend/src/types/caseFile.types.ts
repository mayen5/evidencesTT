/**
 * Case File interface
 */
export interface ICaseFile {
    CaseFileId: number;
    CaseNumber: string;
    Title: string;
    Description: string;
    StatusId: number;
    StatusName?: string;
    Location?: string;
    IncidentDate: Date;
    CreatedBy: number;
    CreatedByName?: string;
    CreatedAt: Date;
    UpdatedAt?: Date;
    ApprovedBy?: number;
    ApprovedAt?: Date;
    EvidenceCount?: number;
}

/**
 * Case File response
 */
export interface ICaseFileResponse {
    caseFileId: number;
    caseNumber: string;
    title: string;
    description: string;
    statusId: number;
    statusName?: string;
    location?: string;
    incidentDate: Date;
    createdBy: number;
    createdByName?: string;
    createdAt: Date;
    updatedAt?: Date;
    approvedBy?: number;
    approvedAt?: Date;
    evidenceCount?: number;
}

/**
 * Paginated case files response
 */
export interface IPaginatedCaseFiles {
    caseFiles: ICaseFileResponse[];
    totalRecords: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
