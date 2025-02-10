import { Router } from 'express';

import { setMeta } from '../../middlewares.js';

import packagesRoutes from './packages.js';

import settingsRoutes from './settings.js';

import projectRoutes from './project.js';

const router = Router();

// Packages routes
router.use('/packages', [setMeta], packagesRoutes);

// Project routes
router.use('/project', [setMeta], projectRoutes)

// Settings route
router.use('/settings', settingsRoutes);

export default router;
