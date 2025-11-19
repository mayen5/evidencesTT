import { Router } from 'express';
import * as caseFileController from '../controllers/caseFile.controller';
import * as historyController from '../controllers/history.controller';
import * as participantController from '../controllers/participant.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/case-files:
 *   post:
 *     summary: Create a new case file
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - caseNumber
 *               - title
 *               - description
 *               - incidentDate
 *             properties:
 *               caseNumber:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               incidentDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Case file created successfully
 */
router.post('/', caseFileController.createCaseFile);

/**
 * @swagger
 * /api/v1/case-files:
 *   get:
 *     summary: Get all case files
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: statusId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of case files
 */
router.get('/', caseFileController.getAllCaseFiles);

/**
 * @swagger
 * /api/v1/case-files/{id}:
 *   get:
 *     summary: Get case file by ID
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Case file details
 *       404:
 *         description: Case file not found
 */
router.get('/:id', caseFileController.getCaseFileById);

/**
 * @swagger
 * /api/v1/case-files/{id}:
 *   patch:
 *     summary: Update case file
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               incidentDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Case file updated successfully
 */
router.patch('/:id', caseFileController.updateCaseFile);

/**
 * @swagger
 * /api/v1/case-files/{id}/submit:
 *   post:
 *     summary: Submit case file for review
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Case file submitted for review
 */
router.post('/:id/submit', caseFileController.submitCaseFileForReview);

/**
 * @swagger
 * /api/v1/case-files/{id}/approve:
 *   post:
 *     summary: Approve case file (Coordinador only)
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approvedBy
 *             properties:
 *               approvedBy:
 *                 type: number
 *     responses:
 *       200:
 *         description: Case file approved
 */
router.post('/:id/approve', caseFileController.approveCaseFile);

/**
 * @swagger
 * /api/v1/case-files/{id}/reject:
 *   post:
 *     summary: Reject case file (Coordinador only)
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectedBy
 *               - rejectionReason
 *             properties:
 *               rejectedBy:
 *                 type: number
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Case file rejected
 */
router.post('/:id/reject', caseFileController.rejectCaseFile);

/**
 * @swagger
 * /api/v1/case-files/{id}:
 *   delete:
 *     summary: Delete case file
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Case file deleted successfully
 */
router.delete('/:id', caseFileController.deleteCaseFile);

/**
 * @swagger
 * /api/v1/case-files/{id}/history:
 *   get:
 *     summary: Get case file history
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Case file history retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       caseFileId:
 *                         type: integer
 *                       changedById:
 *                         type: integer
 *                       changedByUsername:
 *                         type: string
 *                       changedByFirstName:
 *                         type: string
 *                       changedByLastName:
 *                         type: string
 *                       changeType:
 *                         type: string
 *                       oldValue:
 *                         type: string
 *                       newValue:
 *                         type: string
 *                       comments:
 *                         type: string
 *                       changedAt:
 *                         type: string
 *                         format: date-time
 */
router.get('/:id/history', historyController.getCaseFileHistory);

/**
 * @swagger
 * /api/v1/case-files/{id}/participants:
 *   get:
 *     summary: Get all participants of a case file
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Participants retrieved successfully
 */
router.get('/:id/participants', participantController.getCaseFileParticipants);

/**
 * @swagger
 * /api/v1/case-files/{id}/participants:
 *   post:
 *     summary: Add participant to case file
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Participant added successfully
 */
router.post('/:id/participants', participantController.addCaseFileParticipant);

/**
 * @swagger
 * /api/v1/case-files/{id}/participants/{participantId}:
 *   delete:
 *     summary: Remove participant from case file
 *     tags: [CaseFiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Participant removed successfully
 */
router.delete('/:id/participants/:participantId', participantController.removeCaseFileParticipant);

export default router;
