const express = require('express');

const router = express.Router();

const controllers = require('../../controllers');
const constants = require('../../constants');
const { errorHandler } = require('../../utils/errors');

const { packageController } = controllers;

// Get packages list with a search query
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length === 0) {
      return res.status(constants.statusCodes.BAD_REQUEST)
        .send({ message: constants.messages.INVALID_PACKAGE_QUERY });
    }

    const packages = await packageController.getRelevantPackages(q)

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

    return res.status(constants.statusCodes.SUCCESS).send(packages);
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
      return res.status(constants.statusCodes.BAD_REQUEST)
        .send({ message: constants.messages.INVALID_PACKAGE_INFORMATION });
    }

    const response = await packageController.packageOperation(req.meta,
      dirPath, body.package, 'install');

    if (response) {
      return res.status(constants.statusCodes.CREATED)
        .send({ message: constants.messages.SUCCESSFUL_PACKAGE_INSTALL });
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
      return res.status(constants.statusCodes.BAD_REQUEST)
        .send({ message: constants.messages.INVALID_PACKAGE_INFORMATION });
    }

    const response = await packageController.packageOperation(req.meta,
      dirPath, body.package, 'upgrade');

    if (response) {
      return res.status(constants.statusCodes.SUCCESS)
        .send({ message: constants.messages.SUCCESSFUL_PACKAGE_UNINSTALL });
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
      return res.status(constants.statusCodes.BAD_REQUEST)
        .send({ message: constants.messages.INVALID_PACKAGE_INFORMATION });
    }

    const response = await packageController.packageOperation(req.meta, dirPath,
      body.package, 'uninstall');

    if (response) {
      return res.status(constants.statusCodes.DELETED)
        .send({ message: constants.messages.SUCCESSFUL_PACKAGE_UNINSTALL });
    }
  } catch (er) {
    return errorHandler(er, res);
  }
  return null;
});


module.exports = router;
