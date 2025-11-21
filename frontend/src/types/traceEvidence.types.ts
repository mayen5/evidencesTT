/**
 * Trace Evidence Type
 */
export interface TraceEvidenceType {
    id: number;
    name: string;
    description?: string;
}

/**
 * Trace Evidence Interface (matches backend ITraceEvidenceResponse)
 */
export interface TraceEvidence {
    traceEvidenceId: number;
    caseFileId: number;
    evidenceNumber: string;
    traceEvidenceTypeId: number;
    traceEvidenceTypeName?: string;
    description: string;
    color?: string;
    size?: string;
    weight?: number;
    location?: string;
    storageLocation?: string;
    collectedBy: number;
    collectedByName?: string;
    collectedAt: string;
    createdAt: string;
}

/**
 * All Trace Evidence Interface (matches backend IAllTraceEvidenceResponse)
 */
export interface AllTraceEvidence {
    traceEvidenceId: number;
    caseFileId: number;
    caseFileNumber: string;
    evidenceNumber: string;
    description: string;
    traceEvidenceTypeId: number;
    traceEvidenceTypeName: string;
    color?: string;
    size?: string;
    weight?: number;
    location?: string;
    storageLocation?: string;
    collectedById: number;
    collectedByName: string;
    collectedAt: string;
    createdAt: string;
    updatedAt?: string;
}

/**
 * Paginated Trace Evidence Response
 */
export interface PaginatedTraceEvidenceResponse {
    data: AllTraceEvidence[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Add Trace Evidence DTO
 */
export interface AddTraceEvidenceDTO {
    caseFileId: number;
    evidenceNumber: string;
    traceEvidenceTypeId: number;
    description: string;
    color?: string;
    size?: string;
    weight?: number;
    location?: string;
    storageLocation?: string;
    collectedBy: number;
    collectedAt?: string;
}

/**
 * Update Trace Evidence DTO
 */
export interface UpdateTraceEvidenceDTO {
    evidenceNumber?: string;
    traceEvidenceTypeId?: number;
    description?: string;
    color?: string;
    size?: string;
    weight?: number;
    location?: string;
    storageLocation?: string;
    collectedAt?: string;
}
