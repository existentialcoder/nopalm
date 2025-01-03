const fs = require('fs-extra');

const path = require('path');

const os = require('os');

const { copyFileOrDirectory } = require('../utils/common-utils');

const ADDON_FOLDER = 'addon';

const globalNopalmFolderPath = path.join(os.homedir(), '.nopalm');

const projectNopalmFolderPath = process.cwd();

async function createCopiedAddonFolder() {
    // Delete existing .nopalm parent global folder for every install / update
    await fs.remove(globalNopalmFolderPath);
    console.log('Successfully removed the existing global nopalm folder');

    // Create empty global nopalm folder path
    await fs.mkdir(globalNopalmFolderPath);
    console.log('Successfully created new global nopalm folder');

    // Create addon in the global nopam folder path
    const ADDON_SRC_PATH = path.join(projectNopalmFolderPath, 'addon'),
        ADDON_DESTINATION_PATH = path.join(globalNopalmFolderPath, ADDON_FOLDER);

    console.log('Copying addon...');
    copyFileOrDirectory(ADDON_SRC_PATH, ADDON_DESTINATION_PATH);
}

(() => {
    const args = process.argv;

    const methodToExecute = args[2].split('=')[1];

    switch (methodToExecute) {
        case 'createCopiedAddonFolder':
            return createCopiedAddonFolder();
    }
})();
