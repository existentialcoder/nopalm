import { homedir } from 'os';

import { join } from 'path';

import fsExtra from 'fs-extra';

import constants from '../constants.js';

import Utils from './common-utils.js';

import { Settings } from '../types.js';

const { existsSync, mkdirSync, writeFileSync, readFileSync } = fsExtra;

const { defaultSettings } = constants;

const { getPackageManagers } = Utils;

const SETTINGS_FILE = 'settings.json';

function ensureGlobalSettings(): void {
  const globalNopalmFolderPath = join(homedir(), '.nopalm');

  if (!existsSync(globalNopalmFolderPath)) {
    mkdirSync(globalNopalmFolderPath);
  }

  if (!existsSync(join(globalNopalmFolderPath, SETTINGS_FILE))) {
    writeFileSync(join(globalNopalmFolderPath, SETTINGS_FILE), JSON.stringify(defaultSettings));
  }
}

async function getSettings(scope: string): Promise<Settings> {
  global.__debug?.(import.meta.url, `Getting ${scope} settings`);

  const nopalmFolderPath = join(scope === 'global' ? homedir() : process.cwd(), '.nopalm');

  const nopalmSettingsFilePath = join(nopalmFolderPath, SETTINGS_FILE);

  const settings = JSON.parse(
    readFileSync(nopalmSettingsFilePath, { encoding: 'utf8' })
  ) as Settings;

  if (scope === 'local') {
    const [packageManager] = await getPackageManagers(process.cwd(), scope);
    settings.preferences.package_manager = packageManager;
  }

  return settings;
}

function updateSettings(scope: string, settingsToUpdate: Settings): void {
  const nopalmFolderPath = join(scope === 'global' ? homedir() : process.cwd(), '.nopalm');

  const nopalmSettingsFilePath = join(nopalmFolderPath, SETTINGS_FILE);

  writeFileSync(nopalmSettingsFilePath, JSON.stringify(settingsToUpdate), { encoding: 'utf8', flag: 'w' });
}

export {
  ensureGlobalSettings,
  getSettings,
  updateSettings,
};
