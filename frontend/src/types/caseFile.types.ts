// Case File Status IDs (matches backend)
export const CaseFileStatus = {
    DRAFT: 1,
    UNDER_REVIEW: 2,
    APPROVED: 3,
    REJECTED: 4,
} as const;

export type CaseFileStatusValue = typeof CaseFileStatus[ keyof typeof CaseFileStatus ];

export interface Status {
    id: number;
    name: string;
    description?: string;
}

// Case File Interface (matches backend ICaseFileResponse)
export interface CaseFile {
    caseFileId: number;
    caseNumber: string;
    title: string;
    description: string;
    statusId: number;
    statusName?: string;
    location?: string;
    incidentDate: string;
    createdBy: number;
    createdByName?: string;
    reviewedBy?: number;
    reviewedByName?: string;
    rejectionReason?: string;
    createdAt: string;
    reviewedAt?: string;
    approvedAt?: string;
    updatedAt?: string;
    evidenceCount?: number;
}

// DTOs
export interface CreateCaseFileDTO {
    caseNumber: string;
    title: string;
    description: string;
    location?: string;
    incidentDate: string;
}

export interface UpdateCaseFileDTO {
    title?: string;
    description?: string;
    location?: string;
    incidentDate?: string;
}

export interface SubmitCaseFileDTO {
    caseFileId: number;
}

export interface ApproveCaseFileDTO {
    approvedBy: number;
}

export interface RejectCaseFileDTO {
    rejectedBy: number;
    rejectionReason: string;
}

// Filters
export interface CaseFileFilters {
    statusId?: number;
    userId?: number;
    search?: string;
    page?: number;
    limit?: number;
}
