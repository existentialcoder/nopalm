import { getSettings, updateSettings } from '../utils/settings.js';

import { Settings } from '../types.js';

async function getSettingsController(scope: string): Promise<Settings> {
  return getSettings(scope);
}

function updateSettingsController(scope: string, settingsToUpdate: Settings): void {
  global.__debug?.(import.meta.url, `Updating ${scope} settings with ${JSON.stringify(settingsToUpdate)}`);
  updateSettings(scope, settingsToUpdate);
}

const settingsController = {
  getSettingsController,
  updateSettingsController,
};

export default settingsController;
