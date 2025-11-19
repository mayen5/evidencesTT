import * as participantRepo from '../repositories/participant.repository';
import { ICaseFileParticipantResponse } from '../types/participant.types';

/**
 * Get all participants for a case file
 */
export const getCaseFileParticipants = async (caseFileId: number): Promise<ICaseFileParticipantResponse[]> => {
    const participants = await participantRepo.getCaseFileParticipants(caseFileId);

    return participants.map(p => ({
        id: p.Id,
        caseFileId: p.CaseFileId,
        userId: p.UserId,
        username: p.Username,
        firstName: p.FirstName,
        lastName: p.LastName,
        email: p.Email,
        roleId: p.RoleId,
        roleName: p.RoleName,
        participantRole: p.ParticipantRole,
        assignedAt: p.AssignedAt,
    }));
};

/**
 * Add participant to case file
 */
export const addCaseFileParticipant = async (
    caseFileId: number,
    userId: number,
    role: string | undefined,
    addedById: number
): Promise<number> => {
    return await participantRepo.addCaseFileParticipant(caseFileId, userId, role, addedById);
};

/**
 * Remove participant from case file
 */
export const removeCaseFileParticipant = async (
    participantId: number,
    removedById: number
): Promise<void> => {
    await participantRepo.removeCaseFileParticipant(participantId, removedById);
};
