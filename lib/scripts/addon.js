const fs = require('fs-extra');

const path = require('path');

const os = require('os');

const { copyDirectory } = require('../utils/common-utils');

const ADDON_FOLDER = 'addon';

const globalNopalmFolderPath = path.join(os.homedir(), '.nopalm');

const projectNopalmFolderPath = process.cwd();

async function createCopiedAddonFolder() {
    // Delete existing .nopalm parent global folder for every install / update
    await fs.remove(globalNopalmFolderPath);

    // Create empty global nopalm folder path
    await fs.mkdir(globalNopalmFolderPath);

    // Create addon in the global nopam folder path
    const ADDON_SRC_PATH = path.join(projectNopalmFolderPath, 'addon'),
        ADDON_DESTINATION_PATH = path.join(globalNopalmFolderPath, ADDON_FOLDER);

    copyDirectory(ADDON_SRC_PATH, ADDON_DESTINATION_PATH);
}

(() => {
    const args = process.argv;

    const methodToExecute = args[2].split('=')[1];

    switch (methodToExecute) {
        case 'createCopiedAddonFolder':
            return createCopiedAddonFolder();
    }
})();
