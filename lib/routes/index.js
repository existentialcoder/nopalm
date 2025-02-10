import { Router } from 'express';

import apiRoutes from './api/index.js';

import constants from '../constants.js';

const { statusCodes } = constants;

const router = Router();

router.use('/api', apiRoutes);

router.all('/api/*', (req, res) => res.status(statusCodes.NOT_FOUND).json('No API route found'));

export default router;
