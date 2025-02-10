import fsExtra from 'fs-extra';

import { join } from 'path';

import { homedir } from 'os';

import Utils from '../utils/common-utils.js';

const { remove, mkdir } = fsExtra;

const ADDON_FOLDER = 'addon';

const globalNopalmFolderPath = join(homedir(), '.nopalm');

const projectNopalmFolderPath = process.cwd();

async function createCopiedAddonFolder() {
    // Delete existing .nopalm parent global folder for every install / update
    await remove(globalNopalmFolderPath);
    console.log('Successfully removed the existing global nopalm folder');

    // Create empty global nopalm folder path
    await mkdir(globalNopalmFolderPath);
    console.log('Successfully created new global nopalm folder');

    // Create addon in the global nopam folder path
    const ADDON_SRC_PATH = join(projectNopalmFolderPath, 'addon'),
        ADDON_DESTINATION_PATH = join(globalNopalmFolderPath, ADDON_FOLDER);

    console.log('Copying addon...');
    Utils.copyFileOrDirectory(ADDON_SRC_PATH, ADDON_DESTINATION_PATH);
}

(() => {
    const args = process.argv;

    const methodToExecute = args[2].split('=')[1];

    switch (methodToExecute) {
        case 'createCopiedAddonFolder':
            return createCopiedAddonFolder();
    }
})();
