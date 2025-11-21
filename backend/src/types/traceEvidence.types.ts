/**
 * Trace Evidence interface
 */
export interface ITraceEvidence {
    TraceEvidenceId: number;
    CaseFileId: number;
    EvidenceNumber: string;
    TraceEvidenceTypeId: number;
    TraceEvidenceTypeName?: string;
    Description: string;
    Color?: string;
    Size?: string;
    Weight?: number;
    Location?: string;
    StorageLocation?: string;
    CollectedBy: number;
    CollectedByName?: string;
    CollectedAt: Date;
    CreatedAt: Date;
}

/**
 * Trace Evidence response
 */
export interface ITraceEvidenceResponse {
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
    collectedAt: Date;
    createdAt: Date;
}

/**
 * Trace Evidence with case file info (for global listing)
 */
export interface IAllTraceEvidenceRow {
    TraceEvidenceId: number;
    CaseFileId: number;
    CaseFileNumber: string;
    EvidenceNumber: string;
    Description: string;
    TraceEvidenceTypeId: number;
    TraceEvidenceTypeName: string;
    Color?: string;
    Size?: string;
    Weight?: number;
    Location?: string;
    StorageLocation?: string;
    CollectedById: number;
    CollectedByName: string;
    CollectedAt: Date;
    CreatedAt: Date;
    UpdatedAt?: Date;
    TotalCount: number;
}

/**
 * All trace evidence response
 */
export interface IAllTraceEvidenceResponse {
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
    collectedAt: Date;
    createdAt: Date;
    updatedAt?: Date;
}

/**
 * Pagination response for trace evidence
 */
export interface IPaginatedTraceEvidenceResponse {
    data: IAllTraceEvidenceResponse[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}
