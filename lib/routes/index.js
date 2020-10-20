const router = require('express').Router();

const apiRoutes = require('./api');
const constants = require('../constants');

router.use('/api', apiRoutes);
router.use('/api', (req, res) => res.status(constants.statusCodes.NOT_FOUND).json('No API route found'));

module.exports = router;
