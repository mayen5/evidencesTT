export interface CaseFile {
    id: number;
    caseNumber: string;
    title: string;
    description?: string;
    incidentDate?: Date;
    incidentLocation?: string;
    statusId: number;
    statusName?: string;
    registeredById: number;
    registeredByName?: string;
    registeredByEmail?: string;
    reviewedById?: number;
    reviewedByName?: string;
    rejectionReason?: string;
    registeredAt: Date;
    reviewedAt?: Date;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    evidenceCount?: number;
}

export interface CaseFileCreateInput {
    caseNumber: string;
    title: string;
    description?: string;
    incidentDate?: Date;
    incidentLocation?: string;
    registeredById: number;
}

export interface CaseFileUpdateInput {
    title?: string;
    description?: string;
    incidentDate?: Date;
    incidentLocation?: string;
}

export interface CaseFileFilter {
    pageNumber?: number;
    pageSize?: number;
    statusId?: number;
    registeredById?: number;
    searchTerm?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface CaseFileListResponse {
    data: CaseFile[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
