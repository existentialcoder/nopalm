import { Router, Request, Response } from 'express';

import controllers from '../../controllers/index.js';

import { errorHandler } from '../../utils/errors.js';

import constants from '../../constants.js';

import { Settings } from '../../types.js';

const { settingsController } = controllers;

const { statusCodes, messages } = constants;

const router = Router();

interface ScopeQuery {
  scope?: string;
}

router.get('/', async (req: Request<{}, {}, {}, ScopeQuery>, res: Response) => {
  try {
    const { scope } = req.query;

    if (!scope || !['global', 'local'].includes(scope)) {
      return res.status(statusCodes.BAD_REQUEST)
        .send({ message: messages.INVALID_SCOPE_QUERY_PARAM });
    }

    const settings = await settingsController.getSettingsController(scope);

    return res.send({ settings });
  } catch (ex) {
    return errorHandler(ex as Error, res);
  }
});

router.patch('/', (req: Request<{}, {}, Settings, ScopeQuery>, res: Response) => {
  try {
    const { scope } = req.query;

    const { body } = req;

    if (!scope || !['global', 'local'].includes(scope)) {
      return res.status(statusCodes.BAD_REQUEST)
        .send({ message: messages.INVALID_SCOPE_QUERY_PARAM });
    }

    settingsController.updateSettingsController(scope, body);

    return res.send({ settings: body });
  } catch (ex) {
    return errorHandler(ex as Error, res);
  }
});

export default router;
