const router = require('express').Router();

const { setMeta } = require('../../middlewares');

const packagesRoutes = require('./packages');
const settingsRoutes = require('./settings');
const projectRoutes = require('./project');

// Packages routes
router.use('/packages', [setMeta], packagesRoutes);

// Project routes
router.use('/project', [setMeta], projectRoutes)

// Settings route
router.use('/settings', settingsRoutes);
module.exports = router;
