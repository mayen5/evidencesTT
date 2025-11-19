import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import {
    uploadFile,
    getCaseFileAttachments,
    deleteAttachmentById,
} from '../controllers/attachment.controller';

const router = Router();

/**
 * @swagger
 * /case-files/{caseFileId}/attachments:
 *   post:
 *     summary: Upload file attachment to case file
 *     tags: [Attachments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseFileId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Case file ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (max 10MB)
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Attachment'
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid file or file too large
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Case file not found
 */
router.post(
    '/case-files/:caseFileId/attachments',
    authenticate,
    upload.single('file'),
    uploadFile
);

/**
 * @swagger
 * /case-files/{caseFileId}/attachments:
 *   get:
 *     summary: Get all attachments for a case file
 *     tags: [Attachments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseFileId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Case file ID
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include deleted attachments
 *     responses:
 *       200:
 *         description: Attachments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attachment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Case file not found
 */
router.get(
    '/case-files/:caseFileId/attachments',
    authenticate,
    getCaseFileAttachments
);

/**
 * @swagger
 * /attachments/{attachmentId}:
 *   delete:
 *     summary: Delete (soft delete) an attachment
 *     tags: [Attachments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment ID
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Attachment'
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attachment not found
 *       409:
 *         description: Attachment already deleted
 */
router.delete('/attachments/:attachmentId', authenticate, deleteAttachmentById);

/**
 * @swagger
 * components:
 *   schemas:
 *     Attachment:
 *       type: object
 *       properties:
 *         attachmentId:
 *           type: integer
 *           description: Attachment ID
 *         caseFileId:
 *           type: integer
 *           description: Associated case file ID
 *         fileName:
 *           type: string
 *           description: Original file name
 *         filePath:
 *           type: string
 *           description: File path on server
 *         fileSize:
 *           type: integer
 *           description: File size in bytes
 *         mimeType:
 *           type: string
 *           description: MIME type
 *         uploadedById:
 *           type: integer
 *           description: User who uploaded the file
 *         uploadedByName:
 *           type: string
 *           description: Name of user who uploaded
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           description: Upload timestamp
 *         isDeleted:
 *           type: boolean
 *           description: Whether the attachment is deleted
 */

export default router;
