import * as traceEvidenceRepo from '../repositories/traceEvidence.repository';
import { ITraceEvidenceResponse, IPaginatedTraceEvidenceResponse } from '../types/traceEvidence.types';
import { AddTraceEvidenceInput } from '../validators/traceEvidence.validator';
import { ApiError } from '../utils/ApiError';

/**
 * Add trace evidence to a case file
 */
export const addTraceEvidence = async (data: AddTraceEvidenceInput): Promise<{ traceEvidenceId: number; message: string }> => {
    try {
        const collectionDate = typeof data.collectionDate === 'string'
            ? new Date(data.collectionDate)
            : data.collectionDate instanceof Date
                ? data.collectionDate
                : new Date();

        const result = await traceEvidenceRepo.addTraceEvidence(
            data.caseFileId,
            data.traceEvidenceTypeId,
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
 * Get all trace evidence for a case file
 */
export const getTraceEvidenceByCaseFile = async (caseFileId: number): Promise<ITraceEvidenceResponse[]> => {
    const traceEvidence = await traceEvidenceRepo.getTraceEvidenceByCaseFile(caseFileId);

    return traceEvidence.map(ev => ({
        traceEvidenceId: ev.TraceEvidenceId,
        caseFileId: ev.CaseFileId,
        evidenceNumber: ev.EvidenceNumber,
        traceEvidenceTypeId: ev.TraceEvidenceTypeId,
        traceEvidenceTypeName: ev.TraceEvidenceTypeName,
        description: ev.Description,
        color: ev.Color,
        size: ev.Size,
        weight: ev.Weight,
        location: ev.Location,
        storageLocation: ev.StorageLocation,
        collectedBy: ev.CollectedBy,
        collectedByName: ev.CollectedByName,
        collectedAt: ev.CollectedAt,
        createdAt: ev.CreatedAt,
    }));
};

/**
 * Get all trace evidence with pagination
 */
export const getAllTraceEvidence = async (
    page: number,
    pageSize: number,
    search?: string
): Promise<IPaginatedTraceEvidenceResponse> => {
    const traceEvidence = await traceEvidenceRepo.getAllTraceEvidence(page, pageSize, search);

    if (!traceEvidence || traceEvidence.length === 0) {
        return {
            data: [],
            pagination: {
                page,
                pageSize,
                total: 0,
                totalPages: 0,
            },
        };
    }

    const totalCount = traceEvidence[ 0 ]?.TotalCount || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        data: traceEvidence.map(ev => ({
            traceEvidenceId: ev.TraceEvidenceId,
            caseFileId: ev.CaseFileId,
            caseFileNumber: ev.CaseFileNumber,
            evidenceNumber: ev.EvidenceNumber,
            description: ev.Description,
            traceEvidenceTypeId: ev.TraceEvidenceTypeId,
            traceEvidenceTypeName: ev.TraceEvidenceTypeName,
            color: ev.Color,
            size: ev.Size,
            weight: ev.Weight,
            location: ev.Location,
            storageLocation: ev.StorageLocation,
            collectedById: ev.CollectedById,
            collectedByName: ev.CollectedByName,
            collectedAt: ev.CollectedAt,
            createdAt: ev.CreatedAt,
            updatedAt: ev.UpdatedAt,
        })),
        pagination: {
            page,
            pageSize,
            total: totalCount,
            totalPages,
        },
    };
};
