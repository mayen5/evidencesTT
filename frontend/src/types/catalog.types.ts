/**
 * Role Catalog
 */
export interface Role {
    id: number;
    name: string;
    description?: string;
}

/**
 * Case File Status Catalog
 */
export interface CaseFileStatus {
    id: number;
    name: string;
    description?: string;
}

/**
 * Evidence Type Catalog
 */
export interface EvidenceType {
    id: number;
    name: string;
    description?: string;
}

/**
 * Case File Status IDs
 */
export const CaseFileStatusId = {
    DRAFT: 1,
    UNDER_REVIEW: 2,
    APPROVED: 3,
    REJECTED: 4,
} as const;

export type CaseFileStatusId = typeof CaseFileStatusId[ keyof typeof CaseFileStatusId ];
