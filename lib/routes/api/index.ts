import { Router } from 'express';

import { setMeta } from '../../middlewares.js';

import packagesRoutes from './packages.js';
import settingsRoutes from './settings.js';
import projectRoutes from './project.js';

const router = Router();

router.use('/packages', setMeta, packagesRoutes);

router.use('/project', setMeta, projectRoutes);

router.use('/settings', settingsRoutes);

export default router;
