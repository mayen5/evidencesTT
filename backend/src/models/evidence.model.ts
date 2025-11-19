export interface Evidence {
    id: number;
    caseFileId: number;
    evidenceNumber: string;
    description: string;
    evidenceTypeId: number;
    evidenceTypeName?: string;
    color?: string;
    size?: string;
    weight?: number;
    location?: string;
    storageLocation?: string;
    collectedById: number;
    collectedByName?: string;
    collectedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface EvidenceCreateInput {
    caseFileId: number;
    evidenceNumber: string;
    description: string;
    evidenceTypeId: number;
    color?: string;
    size?: string;
    weight?: number;
    location?: string;
    storageLocation?: string;
    collectedById: number;
}

export interface EvidenceUpdateInput {
    description?: string;
    evidenceTypeId?: number;
    color?: string;
    size?: string;
    weight?: number;
    location?: string;
    storageLocation?: string;
}

export interface EvidenceType {
    id: number;
    name: string;
    description?: string;
    requiresSpecialCare: boolean;
    createdAt: Date;
}
