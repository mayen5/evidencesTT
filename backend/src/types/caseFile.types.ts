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
    ReviewedBy?: number;
    ReviewedByName?: string;
    RejectionReason?: string;
    CreatedAt: Date;
    ReviewedAt?: Date;
    ApprovedAt?: Date;
    UpdatedAt?: Date;
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
    reviewedBy?: number;
    reviewedByName?: string;
    rejectionReason?: string;
    createdAt: Date;
    reviewedAt?: Date;
    approvedAt?: Date;
    updatedAt?: Date;
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
