import { Router } from 'express';
import * as traceEvidenceController from '../controllers/traceEvidence.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/trace-evidence:
 *   get:
 *     summary: Get all trace evidence with pagination
 *     tags: [TraceEvidence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of all trace evidence
 *   post:
 *     summary: Add trace evidence to a case file
 *     tags: [TraceEvidence]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - caseFileId
 *               - evidenceTypeId
 *               - description
 *               - collectedBy
 *             properties:
 *               caseFileId:
 *                 type: number
 *               evidenceTypeId:
 *                 type: number
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               collectedBy:
 *                 type: number
 *               collectionDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Trace evidence added successfully
 */
router.get('/', traceEvidenceController.getAllTraceEvidence);
router.post('/', traceEvidenceController.addTraceEvidence);

/**
 * @swagger
 * /api/v1/trace-evidence/case-file/{caseFileId}:
 *   get:
 *     summary: Get all trace evidence for a case file
 *     tags: [TraceEvidence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseFileId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of trace evidence for case file
 */
router.get('/case-file/:caseFileId', traceEvidenceController.getTraceEvidenceByCaseFile);

export default router;
