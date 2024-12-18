const express = require('express');

const router = express.Router();

const constants = require('../../constants');

const controllers = require('../../controllers');

const { projectController } = controllers;

router.get('/', async (req, res) => {
  const projectDetails = await projectController.getProjectDetails();

  res.status(constants.statusCodes.SUCCESS).send(projectDetails);
});

router.patch('/', async (req, res) => {
  const projectDetailsBody = req.body;

  await projectController.updateProject(projectDetailsBody);

  res.status(constants.statusCodes.CREATED).send({
    msg: 'Successfully updated the project'
  });
});

router.post('/new', async (req, res) => {
  const newProjectDetailsBody = req.body;

  await projectController.createNewProject(req.meta, newProjectDetailsBody);

  res.status(constants.statusCodes.CREATED).send({
    msg: 'Successfully created the project'
  });
});

module.exports = router;
