import { Router } from 'express';
import * as evidenceController from '../controllers/evidence.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/evidence:
 *   post:
 *     summary: Add evidence to a case file
 *     tags: [Evidence]
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
 *         description: Evidence added successfully
 */
router.post('/', evidenceController.addEvidence);

/**
 * @swagger
 * /api/v1/evidence/case-file/{caseFileId}:
 *   get:
 *     summary: Get all evidence for a case file
 *     tags: [Evidence]
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
 *         description: List of evidence for case file
 */
router.get('/case-file/:caseFileId', evidenceController.getEvidenceByCaseFile);

export default router;
