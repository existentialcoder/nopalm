const router = require('express').Router();

const packagesRoutes = require('./packages');
const packageManagerRoutes = require('./package-managers');
const projectRoutes = require('./project');

// Packages routes
router.use('/packages', packagesRoutes);
router.use('/package-managers', packageManagerRoutes);

// Project routes
router.use('/project', projectRoutes)

module.exports = router;
