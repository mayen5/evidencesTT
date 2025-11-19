import * as evidenceRepo from '../repositories/evidence.repository';
import { IEvidenceResponse } from '../types/evidence.types';
import { AddEvidenceInput } from '../validators/evidence.validator';
import { ApiError } from '../utils/ApiError';

/**
 * Add evidence to a case file
 */
export const addEvidence = async (data: AddEvidenceInput): Promise<{ evidenceId: number; message: string }> => {
    try {
        const collectionDate = typeof data.collectionDate === 'string'
            ? new Date(data.collectionDate)
            : data.collectionDate instanceof Date
                ? data.collectionDate
                : new Date();

        const result = await evidenceRepo.addEvidence(
            data.caseFileId,
            data.evidenceTypeId,
            data.description,
            data.location,
            data.collectedBy,
            collectionDate
        );

        return result;
    } catch (error: unknown) {
        if (error instanceof Error && error.message && error.message.includes('Borrador')) {
            throw new ApiError(400, error.message);
        }
        throw error;
    }
};

/**
 * Get all evidence for a case file
 */
export const getEvidenceByCaseFile = async (caseFileId: number): Promise<IEvidenceResponse[]> => {
    const evidence = await evidenceRepo.getEvidenceByCaseFile(caseFileId);

    return evidence.map(ev => ({
        evidenceId: ev.EvidenceId,
        caseFileId: ev.CaseFileId,
        evidenceTypeId: ev.EvidenceTypeId,
        evidenceTypeName: ev.EvidenceTypeName,
        description: ev.Description,
        location: ev.Location,
        collectedBy: ev.CollectedBy,
        collectedByName: ev.CollectedByName,
        collectionDate: ev.CollectionDate,
        createdAt: ev.CreatedAt,
    }));
};
