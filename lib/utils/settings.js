const os = require('os');

const path = require('path');

const fs = require('fs-extra');

const { defaultSettings } = require('../constants');

const loggerInit = require('../logger');

const { getPackageManagers, copyDirectory } = require('./common-utils');

const SETTINGS_FILE = 'settings.json';

function ensureGlobalSettings() {
  const globalNopalmFolderPath = path.join(os.homedir(), '.nopalm');

  if (!fs.existsSync(globalNopalmFolderPath)) {
    fs.mkdirSync(globalNopalmFolderPath);
  }

  if (!fs.existsSync(path.join(globalNopalmFolderPath, SETTINGS_FILE))) {
    fs.writeFileSync(path.join(globalNopalmFolderPath, SETTINGS_FILE), JSON.stringify(defaultSettings));
  }
}

async function getSettings(scope) {
  if (global.__debug) {
    const debuglog = __debug.bind(null, __filename);

    debuglog(`Getting ${scope} settings`);
  }

  const nopalmFolderPath = path.join(scope === 'global' ? os.homedir() : process.cwd(), '.nopalm');

  const nopalmSettingsFilePath = path.join(nopalmFolderPath, SETTINGS_FILE);

  const settings = JSON.parse(
    fs.readFileSync(nopalmSettingsFilePath)
  );

  if (scope === 'local') {
    // if both are found always get the first one
    const [packageManager] = await getPackageManagers(process.cwd(), scope);

    settings.preferences.package_manager = packageManager;
  }

  return settings;
}

function updateSettings(scope, settingsToUpdate) {
  const nopalmFolderPath = path.join(scope === 'global' ? os.homedir() : process.cwd(), '.nopalm');

  const nopalmSettingsFilePath = path.join(nopalmFolderPath, SETTINGS_FILE);

  return fs.writeFileSync(nopalmSettingsFilePath, JSON.stringify(settingsToUpdate),
    { encoding: 'utf8', flag: 'w' });
}

module.exports = {
  ensureGlobalSettings,
  getSettings,
  updateSettings
};
