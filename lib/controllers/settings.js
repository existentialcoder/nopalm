let debuglog = null;

const { getSettings, updateSettings } = require('../utils/settings');

async function getSettingsController(scope) {
  const settings = await getSettings(scope);

  return settings;
}

function updateSettingsController(scope, settingsToUpdate) {
  if (global.__debug) {
    debuglog = __debug.bind(null, __filename);
    debuglog(`Updating ${scope} settings with ${JSON.stringify(settingsToUpdate)}`);
  }

  updateSettings(scope, settingsToUpdate);
}

const settingsController = {
  getSettingsController,
  updateSettingsController
};

module.exports = settingsController;
