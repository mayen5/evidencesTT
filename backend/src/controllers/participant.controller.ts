import { Request, Response, NextFunction } from 'express';
import * as participantService from '../services/participant.service';

/**
 * Get all participants for a case file
 */
export const getCaseFileParticipants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const caseFileId = parseInt(req.params.id);
        const participants = await participantService.getCaseFileParticipants(caseFileId);

        res.json({
            success: true,
            data: participants,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add participant to case file
 */
export const addCaseFileParticipant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const caseFileId = parseInt(req.params.id);
        const { userId, role } = req.body;
        const addedById = req.user?.userId || 0;

        const participantId = await participantService.addCaseFileParticipant(caseFileId, userId, role, addedById);

        res.status(201).json({
            success: true,
            data: { participantId },
            message: 'Participante agregado exitosamente',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove participant from case file
 */
export const removeCaseFileParticipant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const participantId = parseInt(req.params.participantId);
        const removedById = req.user?.userId || 0;

        await participantService.removeCaseFileParticipant(participantId, removedById);

        res.json({
            success: true,
            message: 'Participante removido exitosamente',
        });
    } catch (error) {
        next(error);
    }
};
