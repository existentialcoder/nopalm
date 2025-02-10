import { homedir } from 'os';

import { join } from 'path';

import { fileURLToPath } from 'url';

import fsExtra from 'fs-extra';

import constants from '../constants.js';

import Utils from './common-utils.js';

const __filename = fileURLToPath(import.meta.url);

const { existsSync, mkdirSync, writeFileSync, readFileSync } = fsExtra;

const { defaultSettings } = constants;

const { getPackageManagers, copyFileOrDirectory } = Utils;

let debuglog = null;

const SETTINGS_FILE = 'settings.json';

function ensureGlobalSettings() {
  const globalNopalmFolderPath = join(homedir(), '.nopalm');

  if (!existsSync(globalNopalmFolderPath)) {
    mkdirSync(globalNopalmFolderPath);
  }

  if (!existsSync(join(globalNopalmFolderPath, SETTINGS_FILE))) {
    writeFileSync(join(globalNopalmFolderPath, SETTINGS_FILE), JSON.stringify(defaultSettings));
  }
}

async function getSettings(scope) {
  if (global.__debug) {
    debuglog = __debug.bind(null, __filename);

    __debug(import.meta.url, `Getting ${scope} settings`);
  }

  const nopalmFolderPath = join(scope === 'global' ? homedir() : process.cwd(), '.nopalm');

  const nopalmSettingsFilePath = join(nopalmFolderPath, SETTINGS_FILE);

  const settings = JSON.parse(
    readFileSync(nopalmSettingsFilePath)
  );

  if (scope === 'local') {
    // if both are found always get the first one
    const [packageManager] = await getPackageManagers(process.cwd(), scope);

    settings.preferences.package_manager = packageManager;
  }

  return settings;
}

function updateSettings(scope, settingsToUpdate) {
  const nopalmFolderPath = join(scope === 'global' ? homedir() : process.cwd(), '.nopalm');

  const nopalmSettingsFilePath = join(nopalmFolderPath, SETTINGS_FILE);

  return writeFileSync(nopalmSettingsFilePath, JSON.stringify(settingsToUpdate),
    { encoding: 'utf8', flag: 'w' });
}

export {
  ensureGlobalSettings,
  getSettings,
  updateSettings
};
