const express = require('express');

const path = require('path');

const router = express.Router();

const controllers = require('../../controllers');

const { errorHandler } = require('../../utils/errors');
const constants = require('../../constants');

const { settingsController } = controllers;

function getGlobalNopalmPath() {
  return path.join()
}

// Get global or local settings based on the `scope` query param
router.get('/', async (req, res) => {
  try {
    const { scope } = req.query || {};

    if (!scope || !['global', 'local'].includes(scope)) {
      return res.status(constants.statusCodes.BAD_REQUEST)
        .send({ message: constants.messages.INVALID_SCOPE_QUERY_PARAM });
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
      return res.status(constants.statusCodes.BAD_REQUEST)
        .send({ message: constants.messages.INVALID_SCOPE_QUERY_PARAM });
    }

    const settings = settingsController.updateSettingsController(scope, body);

    res.send({ settings });
  } catch (ex) {
    return errorHandler(ex, res);
  }
});

module.exports = router;
