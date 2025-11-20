import type { BaseEntity } from './api.types';

// Evidence Type
export interface EvidenceType {
    id: number;
    name: string;
    description: string;
}

// Evidence Interface
export interface Evidence extends BaseEntity {
    caseFileId: number;
    evidenceTypeId: number;
    evidenceType?: EvidenceType;
    description: string;
    location: string;
    collectionDate: string;
    collectedBy: string;
    notes?: string;
}

// DTOs
export interface CreateEvidenceDTO {
    caseFileId: number;
    evidenceTypeId: number;
    description: string;
    location: string;
    collectionDate: string;
    collectedBy: string;
    notes?: string;
}

export interface UpdateEvidenceDTO {
    evidenceTypeId?: number;
    description?: string;
    location?: string;
    collectionDate?: string;
    collectedBy?: string;
    notes?: string;
}
