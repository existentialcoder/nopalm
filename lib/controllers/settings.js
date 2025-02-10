let debuglog = null;

import { fileURLToPath } from 'url';

import { getSettings, updateSettings } from '../utils/settings.js';

const __filename = fileURLToPath(import.meta.url);

async function getSettingsController(scope) {
  const settings = await getSettings(scope);

  return settings;
}

function updateSettingsController(scope, settingsToUpdate) {
  if (global.__debug) {
    debuglog = __debug.bind(null, __filename);
    __debug(import.meta.url, `Updating ${scope} settings with ${JSON.stringify(settingsToUpdate)}`);
  }

  updateSettings(scope, settingsToUpdate);
}

const settingsController = {
  getSettingsController,
  updateSettingsController
};

export default settingsController;
