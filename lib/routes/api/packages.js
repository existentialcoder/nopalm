import { Router } from 'express';

const router = Router();

import controllers from '../../controllers/index.js';

import constants from '../../constants.js';

import { errorHandler } from '../../utils/errors.js';

const { statusCodes, messages }  = constants;

const { packageController } = controllers;

// Get packages list with a search query
router.get('/search', async (req, res) => {
  try {
    const { q, dir } = req.query;

    const dirPath = dir && dir.length > 0 ? dir : process.cwd();

    if (!q || q.length === 0) {
      return res.status(statusCodes.BAD_REQUEST)
        .send({ message: messages.INVALID_PACKAGE_QUERY });
    }

    const packages = await packageController.getRelevantPackages(q, dirPath);

    res.send({ packages });
  } catch (ex) {
    return errorHandler(ex, res);
  }
});

// Get all installed packages in the project
router.get('/installed', async (req, res) => {
  try {
    const query = req.query;
    
    const dirPath = query.dir && query.dir.length > 0 ? query.dir : process.cwd();
  
    const packages = await packageController.getInstalledPackages(dirPath);

    return res.status(statusCodes.SUCCESS).send(packages);
  } catch (er) {
    return errorHandler(er, res);
  }
});

// Install a package
router.post('/install', async (req, res) => {
  try {
    const { body, query } = req;
    
    const dirPath = query.dir && query.dir.length > 0 ? query.dir : process.cwd();

    if (!body.package) {
      return res.status(statusCodes.BAD_REQUEST)
        .send({ message: messages.INVALID_PACKAGE_INFORMATION });
    }

    const response = await packageController.packageOperation(req.meta,
      dirPath, body.package, 'install');

    if (response) {
      return res.status(statusCodes.CREATED)
        .send({ message: messages.SUCCESSFUL_PACKAGE_INSTALL });
    }
  } catch (er) {
    return errorHandler(er, res);
  }
  return null;
});

router.put('/upgrade', async(req, res) => {
  try {
    const { body, query } = req;
    
    const dirPath = query.dir && query.dir.length > 0 ? query.dir : process.cwd();
  
    if (!body.package) {
      return res.status(statusCodes.BAD_REQUEST)
        .send({ message: messages.INVALID_PACKAGE_INFORMATION });
    }

    const response = await packageController.packageOperation(req.meta,
      dirPath, body.package, 'upgrade');

    if (response) {
      return res.status(statusCodes.SUCCESS)
        .send({ message: messages.SUCCESSFUL_PACKAGE_UNINSTALL });
    }
  } catch (ex) {
    logger.error(ex);
    return errorHandler(ex, res);
  }
});

// Uninstall a package
router.delete('/uninstall', async (req, res) => {
  try {
    const { body, query } = req;
    
    const dirPath = query.dir && query.dir.length > 0 ? query.dir : process.cwd();

    if (!body.package) {
      return res.status(statusCodes.BAD_REQUEST)
        .send({ message: messages.INVALID_PACKAGE_INFORMATION });
    }

    const response = await packageController.packageOperation(req.meta, dirPath,
      body.package, 'uninstall');

    if (response) {
      return res.status(statusCodes.DELETED)
        .send({ message: messages.SUCCESSFUL_PACKAGE_UNINSTALL });
    }
  } catch (er) {
    return errorHandler(er, res);
  }
  return null;
});


export default router;
