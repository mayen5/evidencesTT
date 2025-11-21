/**
 * Case File Participant Interface (matches backend ICaseFileParticipantResponse)
 */
export interface CaseFileParticipant {
    id: number;
    caseFileId: number;
    userId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    roleId?: number;
    roleName?: string;
    participantRole?: string;
    assignedAt: string;
}

/**
 * Add Participant DTO
 */
export interface AddParticipantDTO {
    userId: number;
    role?: string;
}

/**
 * Remove Participant DTO
 */
export interface RemoveParticipantDTO {
    participantId: number;
}
