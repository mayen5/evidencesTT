/**
 * Attachment Types
 */

export interface IAttachment {
    AttachmentId: number;
    CaseFileId: number;
    FileName: string;
    FilePath: string;
    FileSize: number;
    MimeType: string;
    UploadedById: number;
    UploadedByName: string;
    UploadedAt: Date;
    DeletedById?: number | null;
    DeletedByName?: string | null;
    DeletedAt?: Date | null;
    IsDeleted: boolean;
}

export interface IAttachmentResponse {
    attachmentId: number;
    caseFileId: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadedById: number;
    uploadedByName: string;
    uploadedAt: Date;
    isDeleted: boolean;
}

export interface IUploadFileRequest {
    caseFileId: number;
    uploadedById: number;
}

export interface IDeleteAttachmentRequest {
    attachmentId: number;
    deletedById: number;
}
