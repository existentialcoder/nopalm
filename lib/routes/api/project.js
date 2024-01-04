const express = require('express');

const router = express.Router();

const constants = require('../../constants');
const controllers = require('../../controllers');

const { projectController } = controllers;

router.get('/', async (req, res) => {
  const projectDetails = await projectController.getProjectDetails();

  res.status(constants.statusCodes.SUCCESS).send(projectDetails);
});

module.exports = router;
