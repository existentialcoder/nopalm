const express = require('express');

const router = express.Router();

const constants = require('../../constants');

const controllers = require('../../controllers');

const { projectController } = controllers;

router.get('/', async (req, res) => {
  const query = req.query;

  const dirPath = query.dir && query.dir.length > 0 ? query.dir : process.cwd();

  const projectDetails = await projectController.getProjectDetails(dirPath);

  res.status(constants.statusCodes.SUCCESS).send(projectDetails);
});

router.patch('/', async (req, res) => {
  const projectDetailsBody = req.body;

  const query = req.query;

  const dirPath = query.dir && query.dir.length > 0 ? query.dir : process.cwd();

  await projectController.updateProject(projectDetailsBody, dirPath);

  res.status(constants.statusCodes.CREATED).send({
    msg: 'Successfully updated the project'
  });
});

router.post('/new', async (req, res) => {
  const newProjectDetailsBody = req.body;

  const query = req.query;

  const dirPath = query.dir && query.dir.length > 0 ? query.dir : process.cwd();

  await projectController.createNewProject(req.meta, newProjectDetailsBody, dirPath);

  res.status(constants.statusCodes.CREATED).send({
    msg: 'Successfully created the project'
  });
});

module.exports = router;
