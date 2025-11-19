/**
 * Case File Participant interface (database format)
 */
export interface ICaseFileParticipant {
    Id: number;
    CaseFileId: number;
    UserId: number;
    Username?: string;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    RoleId?: number;
    RoleName?: string;
    ParticipantRole?: string;
    AssignedAt: Date;
}

/**
 * Case File Participant response (camelCase for frontend)
 */
export interface ICaseFileParticipantResponse {
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
    assignedAt: Date;
}
