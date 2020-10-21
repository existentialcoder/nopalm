const express = require('express');

const router = express.Router();

const constants = require('../../constants');
const controllers = require('../../controllers');

const { packageController } = controllers;

router.get('/', async (req, res) => {
  const packageManagers = await packageController.retrievePackageManagers();

  res.status(constants.statusCodes.SUCCESS).send(packageManagers);
});

module.exports = router;
