'use strict';

const express = require('express');
const router = express.Router();

const controllers = require('../../controllers');
const constants = require('../../constants');
const { errorHandler } = require('../../utils/errors');
const { packageController } = controllers;

// Get package information with the search word in query
// router.get('/', async (req, res) => {
//   try {
//     const packages = await packageController.getRelevantPackages()
//   }
// });

// Get all installed packages in the project
router.get('/installed', async (req, res) => {
  try {
    const packages = await packageController.getInstalledPackages();

    return res.status(constants.statusCodes.SUCCESS).send(packages);
  } catch(er) {
    return errorHandler(er, res)
  }
});

// Install a package
router.post('/installed', async (req, res) => {
  try {
    const body = req.body;
  
    if (!body.package) {
      return res.status(constants.statusCodes.BAD_REQUEST)
        .send({ message: constants.messages.INVALID_PACKAGE_INFORMATION })
    }

    const response = await packageController.packageOperation(req.query,
     body.package, 'install');
  
    if (response) {
      return res.status(constants.statusCodes.CREATED)
        .send({ message: constants.messages.SUCCESSFUL_PACKAGE_INSTALL });
    }
  } catch(er) {
    return errorHandler(er, res);
  }
});

// Uninstall a package
router.delete('/installed', async (req, res) => {
  try {
    const body = req.body;
  
    if (!body.package) {
      return res.status(constants.statusCodes.BAD_REQUEST)
        .send({ message: constants.messages.INVALID_PACKAGE_INFORMATION })
    }

    const response = await packageController.packageOperation(req.query,
     body.package, 'uninstall');
  
    if (response) {
      return res.status(constants.statusCodes.DELETED)
        .send({ message: constants.messages.SUCCESSFUL_PACKAGE_UNINSTALL });
    }
  } catch(er) {
    return errorHandler(er, res);
  }
});



module.exports = router;
