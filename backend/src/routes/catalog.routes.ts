import { Router } from 'express';
import * as catalogController from '../controllers/catalog.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/catalogs/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Catalogs]
 *     responses:
 *       200:
 *         description: List of roles
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
 *                       RoleId:
 *                         type: integer
 *                       RoleName:
 *                         type: string
 *                       Description:
 *                         type: string
 */
router.get('/roles', catalogController.getRoles);

/**
 * @swagger
 * /api/v1/catalogs/case-file-statuses:
 *   get:
 *     summary: Get all case file statuses
 *     tags: [Catalogs]
 *     responses:
 *       200:
 *         description: List of case file statuses
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
 *                       StatusId:
 *                         type: integer
 *                       StatusName:
 *                         type: string
 *                       Description:
 *                         type: string
 */
router.get('/case-file-statuses', catalogController.getCaseFileStatuses);

/**
 * @swagger
 * /api/v1/catalogs/evidence-types:
 *   get:
 *     summary: Get all evidence types
 *     tags: [Catalogs]
 *     responses:
 *       200:
 *         description: List of evidence types
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
 *                       EvidenceTypeId:
 *                         type: integer
 *                       TypeName:
 *                         type: string
 *                       Description:
 *                         type: string
 */
router.get('/evidence-types', catalogController.getEvidenceTypes);

export default router;
