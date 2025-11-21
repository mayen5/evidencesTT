/**
 * Attachment Interface (matches backend IAttachmentResponse)
 */
export interface Attachment {
    attachmentId: number;
    caseFileId: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadedById: number;
    uploadedByName: string;
    uploadedAt: string;
    isDeleted: boolean;
}

/**
 * Upload Attachment Response
 */
export interface UploadAttachmentResponse {
    attachmentId: number;
    fileName: string;
    fileSize: number;
    mimeType: string;
}
