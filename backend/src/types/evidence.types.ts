/**
 * Evidence interface
 */
export interface IEvidence {
    EvidenceId: number;
    CaseFileId: number;
    EvidenceTypeId: number;
    EvidenceTypeName?: string;
    Description: string;
    Location?: string;
    CollectedBy: number;
    CollectedByName?: string;
    CollectionDate: Date;
    CreatedAt: Date;
}

/**
 * Evidence response
 */
export interface IEvidenceResponse {
    evidenceId: number;
    caseFileId: number;
    evidenceTypeId: number;
    evidenceTypeName?: string;
    description: string;
    location?: string;
    collectedBy: number;
    collectedByName?: string;
    collectionDate: Date;
    createdAt: Date;
}
