import { Request, Response, NextFunction } from 'express';
import * as historyService from '../services/history.service';

/**
 * Get case file history
 */
export const getCaseFileHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const caseFileId = parseInt(req.params.id);
        const history = await historyService.getCaseFileHistory(caseFileId);

        res.json({
            success: true,
            data: history,
        });
    } catch (error) {
        next(error);
    }
};
