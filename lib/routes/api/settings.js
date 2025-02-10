import { Router } from 'express';

import { join } from 'path';

const router = Router();

import controllers from '../../controllers/index.js';

import { errorHandler } from '../../utils/errors.js';

import constants from '../../constants.js';

const { settingsController } = controllers;

const { statusCodes, messages } = constants;

function getGlobalNopalmPath() {
  return join()
}

// Get global or local settings based on the `scope` query param
router.get('/', async (req, res) => {
  try {
    const { scope } = req.query || {};

    if (!scope || !['global', 'local'].includes(scope)) {
      return res.status(statusCodes.BAD_REQUEST)
        .send({ message: messages.INVALID_SCOPE_QUERY_PARAM });
    }

    const settings = await settingsController.getSettingsController(scope);

    res.send({ settings });
  } catch (ex) {
    return errorHandler(ex, res);
  }
});

// update local settings
router.patch('/', (req, res) => {
  try {
    const { scope } = req.query || {};

    const { body } = req;

    if (!scope || !['global', 'local'].includes(scope)) {
      return res.status(statusCodes.BAD_REQUEST)
        .send({ message: messages.INVALID_SCOPE_QUERY_PARAM });
    }

    const settings = settingsController.updateSettingsController(scope, body);

    res.send({ settings });
  } catch (ex) {
    return errorHandler(ex, res);
  }
});

export default router;
