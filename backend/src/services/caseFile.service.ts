import * as caseFileRepo from '../repositories/caseFile.repository';
import { ICaseFileResponse, IPaginatedCaseFiles } from '../types/caseFile.types';
import { CreateCaseFileInput, UpdateCaseFileInput, GetAllCaseFilesInput, ApproveCaseFileInput, RejectCaseFileInput } from '../validators/caseFile.validator';
import { ApiError, NotFoundError, ForbiddenError } from '../utils/ApiError';

/**
 * Create a new case file
 */
export const createCaseFile = async (data: CreateCaseFileInput, createdBy: number): Promise<{ caseFileId: number; message: string }> => {
    try {
        const incidentDate = typeof data.incidentDate === 'string' ? new Date(data.incidentDate) : data.incidentDate;

        const result = await caseFileRepo.createCaseFile(
            data.caseNumber,
            data.title,
            data.description,
            data.location,
            incidentDate,
            createdBy
        );

        return result;
    } catch (error: unknown) {
        if (error instanceof Error && error.message && error.message.includes('ya existe')) {
            throw new ApiError(409, error.message);
        }
        throw error;
    }
};

/**
 * Get case file by ID
 */
export const getCaseFileById = async (caseFileId: number): Promise<ICaseFileResponse> => {
    const caseFile = await caseFileRepo.getCaseFileById(caseFileId);

    if (!caseFile) {
        throw new NotFoundError('Caso no encontrado');
    }

    return {
        caseFileId: caseFile.CaseFileId,
        caseNumber: caseFile.CaseNumber,
        title: caseFile.Title,
        description: caseFile.Description,
        statusId: caseFile.StatusId,
        statusName: caseFile.StatusName,
        location: caseFile.Location,
        incidentDate: caseFile.IncidentDate,
        createdBy: caseFile.CreatedBy,
        createdByName: caseFile.CreatedByName,
        createdAt: caseFile.CreatedAt,
        updatedAt: caseFile.UpdatedAt,
        approvedBy: caseFile.ApprovedBy,
        approvedAt: caseFile.ApprovedAt,
        evidenceCount: caseFile.EvidenceCount,
    };
};

/**
 * Get all case files with pagination
 */
export const getAllCaseFiles = async (data: GetAllCaseFilesInput): Promise<IPaginatedCaseFiles> => {
    return await caseFileRepo.getAllCaseFiles(
        data.page,
        data.pageSize,
        data.statusId,
        data.userId,
        data.search
    );
};

/**
 * Update case file
 */
export const updateCaseFile = async (caseFileId: number, data: UpdateCaseFileInput, updatedById: number): Promise<{ message: string }> => {
    try {
        const incidentDate = data.incidentDate
            ? (typeof data.incidentDate === 'string' ? new Date(data.incidentDate) : data.incidentDate)
            : undefined;

        const result = await caseFileRepo.updateCaseFile(
            caseFileId,
            data.title,
            data.description,
            data.location,
            incidentDate,
            updatedById
        );

        return result;
    } catch (error: unknown) {
        if (error instanceof Error && error.message && (error.message.includes('Borrador') || error.message.includes('Rechazado'))) {
            throw new ForbiddenError(error.message);
        }
        throw error;
    }
};

/**
 * Submit case file for review
 */
export const submitCaseFileForReview = async (caseFileId: number): Promise<{ message: string }> => {
    try {
        return await caseFileRepo.submitCaseFileForReview(caseFileId);
    } catch (error: unknown) {
        if (error instanceof Error && error.message && error.message.includes('evidencia')) {
            throw new ApiError(400, error.message);
        }
        throw error;
    }
};

/**
 * Approve case file
 */
export const approveCaseFile = async (caseFileId: number, data: ApproveCaseFileInput): Promise<{ message: string }> => {
    try {
        return await caseFileRepo.approveCaseFile(caseFileId, data.approvedBy);
    } catch (error: unknown) {
        if (error instanceof Error && error.message && error.message.includes('Coordinador')) {
            throw new ForbiddenError(error.message);
        }
        throw error;
    }
};

/**
 * Reject case file
 */
export const rejectCaseFile = async (caseFileId: number, data: RejectCaseFileInput): Promise<{ message: string }> => {
    try {
        return await caseFileRepo.rejectCaseFile(caseFileId, data.rejectedBy, data.rejectionReason);
    } catch (error: unknown) {
        if (error instanceof Error && error.message && error.message.includes('Coordinador')) {
            throw new ForbiddenError(error.message);
        }
        throw error;
    }
};

/**
 * Delete case file
 */
export const deleteCaseFile = async (caseFileId: number): Promise<{ message: string }> => {
    try {
        return await caseFileRepo.deleteCaseFile(caseFileId);
    } catch (error: unknown) {
        if (error instanceof Error && error.message && (error.message.includes('Borrador') || error.message.includes('Rechazado'))) {
            throw new ForbiddenError(error.message);
        }
        throw error;
    }
};

/**
 * Get case file statistics
 */
export const getCaseFileStatistics = async (): Promise<{
    total: number;
    approved: number;
    rejected: number;
    pending: number;
}> => {
    return await caseFileRepo.getCaseFileStatistics();
};
