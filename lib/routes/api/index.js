const router = require('express').Router();

const packagesRoutes = require('./packages');
const packageManagerRoutes = require('./package-managers');

// Packages routes
router.use('/packages', packagesRoutes);
router.use('/package-managers', packageManagerRoutes);

module.exports = router;
