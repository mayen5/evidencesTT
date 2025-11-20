import type { BaseEntity } from './api.types';
import type { User } from './auth.types';

// Case File Status
export const CaseFileStatus = {
    DRAFT: 1,
    UNDER_REVIEW: 2,
    APPROVED: 3,
    REJECTED: 4,
} as const;

export type CaseFileStatus = typeof CaseFileStatus[ keyof typeof CaseFileStatus ];

export interface Status {
    id: number;
    name: string;
    description: string;
}

// Case File Interface
export interface CaseFile extends BaseEntity {
    caseNumber: string;
    prosecutor: string;
    crime: string;
    accused: string;
    victim: string;
    location: string;
    incidentDate: string;
    statusId: number;
    status?: Status;
    technicianId: number;
    technician?: User;
    coordinatorId?: number;
    coordinator?: User;
    reviewNotes?: string;
    evidenceCount?: number;
}

// DTOs
export interface CreateCaseFileDTO {
    caseNumber: string;
    prosecutor: string;
    crime: string;
    accused: string;
    victim: string;
    location: string;
    incidentDate: string;
}

export interface UpdateCaseFileDTO {
    caseNumber?: string;
    prosecutor?: string;
    crime?: string;
    accused?: string;
    victim?: string;
    location?: string;
    incidentDate?: string;
}

export interface SubmitCaseFileDTO {
    caseFileId: number;
}

export interface ApproveCaseFileDTO {
    caseFileId: number;
    reviewNotes?: string;
}

export interface RejectCaseFileDTO {
    caseFileId: number;
    reviewNotes: string;
}

// Filters
export interface CaseFileFilters {
    statusId?: number;
    technicianId?: number;
    coordinatorId?: number;
    fromDate?: string;
    toDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}
