import { Router } from 'express';
import authRoutes from './auth.routes';
import caseFileRoutes from './caseFile.routes';
import evidenceRoutes from './evidence.routes';
import catalogRoutes from './catalog.routes';
import userRoutes from './user.routes';
import attachmentRoutes from './attachment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/case-files', caseFileRoutes);
router.use('/evidence', evidenceRoutes);
router.use('/catalogs', catalogRoutes);
router.use('/users', userRoutes);
router.use('/', attachmentRoutes); // Includes both /case-files/:id/attachments and /attachments/:id

export default router;
