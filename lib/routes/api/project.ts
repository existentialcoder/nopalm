import { Router, Request, Response } from 'express';

import constants from '../../constants.js';

import controllers from '../../controllers/index.js';

import { NewProjectBody, PackageJsonDetails } from '../../types.js';

const { projectController } = controllers;

const { statusCodes } = constants;

const router = Router();

interface DirQuery {
  dir?: string;
}

router.get('/', async (req: Request<{}, {}, {}, DirQuery>, res: Response) => {
  const { dir } = req.query;
  const dirPath = dir && dir.length > 0 ? dir : process.cwd();
  const projectDetails = await projectController.getProjectDetails(dirPath);
  res.status(statusCodes.SUCCESS).send(projectDetails);
});

router.patch('/', async (req: Request<{}, {}, Partial<PackageJsonDetails>, DirQuery>, res: Response) => {
  const { dir } = req.query;
  const dirPath = dir && dir.length > 0 ? dir : process.cwd();
  await projectController.updateProject(req.body, dirPath);
  res.status(statusCodes.CREATED).send({ msg: 'Successfully updated the project' });
});

router.post('/new', async (req: Request<{}, {}, NewProjectBody, DirQuery>, res: Response) => {
  const { dir } = req.query;
  const dirPath = dir && dir.length > 0 ? dir : process.cwd();
  await projectController.createNewProject(req.meta, req.body, dirPath);
  res.status(statusCodes.CREATED).send({ msg: 'Successfully created the project' });
});

export default router;
