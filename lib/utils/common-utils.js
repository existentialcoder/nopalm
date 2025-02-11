import { exec } from 'child_process';

import { createRequire } from 'module';

import fsEx from 'fs-extra';

import { promisify } from 'util';

import { homedir } from 'os';

import { join } from 'path';

import axios from 'axios';

import website_logo from 'website-logo';

import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);

const { stat: _stat, readdir, copy, writeFile, mkdir, readFile:_readFile } = fsEx;

const stat = promisify(_stat);

const websiteLogo = promisify(website_logo);

import constants from '../constants.js';

const { files: _files, packageManagers, nopalmFileEntryNames } = constants;

async function getAllProjectChildDirectories(startPath) {
    const nodeProjects = [];

    async function searchDirectory(dir) {
        const files = await readdir(dir, { withFileTypes: true });

        let hasPackageJson = false;

        for (const file of files) {
            const fullPath = join(dir, file.name);

            if (file.isDirectory()) {
                if (file.name === 'node_modules') continue;
                await searchDirectory(fullPath);
            } else if (file.name === 'package.json') {
                hasPackageJson = true;
            }
        }

        if (hasPackageJson) {
            nodeProjects.push(dir);
        }
    }

    await searchDirectory(startPath);

    return nodeProjects;
}

async function copyFileOrDirectory(src, dest) {
    try {
        await copy(src, dest);
    } catch (err) {
        throw err;
    }
}

// Bash command helpers
const executeCommand = async (cmd) => {
    __debug(import.meta.url, `!!!! Executing command - ${cmd} !!!!`);

    const execPromisified = promisify(exec);
    try {
        const result = await execPromisified(cmd, { shell: true });
        __debug(import.meta.url, `!!!! Successfully executed command - ${cmd} !!!!`);

        return result.stdout.toString('utf8').trim();
    } catch (er) {
        logger.error(`!!!! Exception in executing command - ${cmd} !!!!`);
        throw er;
    }
};

const checkPackageManager = async (manager) => {
    try {
        const version = await executeCommand(`${manager} -v`);

        return Boolean(version);
    } catch (er) {
        return false;
    }
};

// File helpers
const getPackageJson = async (dir) => {
    const pJsonPath = `${dir}/${constants.files.PACKAGE_JSON}`;
    try {
        const stats = await stat(pJsonPath);
        if (stats.isFile()) {
            delete require.cache[require.resolve(pJsonPath)];
            return require(pJsonPath);
        }
        throw new Error(`Not a valid file - ${constants.files.PACKAGE_JSON}`);
    } catch (er) {
        return null;
    }
};

const writeToPackageJson = async (dir, pJsonValue) => {
    const pJsonPath = `${dir}/${_files.PACKAGE_JSON}`;

    return writeFile(pJsonPath, JSON.stringify(pJsonValue));
};

const packageOperation = async (pkg, packageManager, operation) => {
    let op;
    switch (operation) {
        case 'install_all':
            op = 'install';
            break;
        case 'install':
            op = packageManager === 'npm' ? 'i' : 'add';
            break;
        case 'uninstall':
            op = packageManager === 'npm' ? 'uninstall' : 'remove';
            break;
        case 'upgrade':
            op = packageManager === 'npm' ? 'install' : 'upgrade';
            break;
    }

    try {
        const exactVersion = pkg.version && pkg.version.slice(['^', '~'].includes(pkg.version[0]) ? 1 : 0);
        const versionCondition = pkg.version ? (pkg.latest ? '@latest' : `@${exactVersion}`) : '';
        const nameCondition = pkg.name ? pkg.name : '';
        let command = `${packageManager} ${op} ${nameCondition}${versionCondition} ${operation === 'install' && pkg.isDev ? ' -D' : ''}`;

        if (operation === 'upgrade' && pkg.hasOwnProperty('isDev')) {
            const uninstallCommand = packageManager === 'npm' ? 'uninstall' : 'remove';
            const installCommand = packageManager === 'npm' ? 'i' : 'add';

            command = `${packageManager} ${uninstallCommand} ${pkg.name} && ${packageManager} ${installCommand} ${pkg.name}${versionCondition} ${pkg.isDev ? ' -D' : ''}`
        }

        const result = await executeCommand(command);

        return Boolean(result);
    } catch (er) {
        return false;
    }
};

const getPackageDetails = async (pkgName) => {
    const { data } = await axios.get(`https://registry.npmjs.org/${pkgName}`);

    return data;
};

const getPackagesListFromSearch = async (searchQ) => {
    // 40 results
    // get search results
    // get suggestions too
    const searchUrl = `https://api.npms.io/v2/search?q=${searchQ}`,
        suggestionsUrl = `https://api.npms.io/v2/search/suggestions?q=${searchQ}`;

    const [searchResults, suggestionsResults] = await Promise.all([suggestionsUrl, searchUrl].map(async url => {
        const { data } = await axios.get(url);

        return data;
    }));

    const completeSearchResults = [...searchResults.slice(0, 20), ...suggestionsResults.results.slice(0, 20)];

    return completeSearchResults.reduce((uniquePackages, result) => {
        const packageName = result.package.name;
        if (!uniquePackages.find(item => item.package.name === packageName)) {
            uniquePackages.push(result);
        }
        return uniquePackages;
    }, []);
};

const getWebsiteLogo = async (homepage) => {
    if (!homepage || !homepage.startsWith('http')) {
        return '';
    }

    try {
        const logoImgSrc = await websiteLogo(homepage);

        if (logoImgSrc && logoImgSrc.icon && logoImgSrc.icon.href && logoImgSrc.icon.href.length > 0) {
            return logoImgSrc.icon.href;
        }
        return '';
    } catch (ex) {
        return '';
    }
};

const getPackageManagers = async (dir, scope) => {
    return Promise.all(
        packageManagers.map(async (pkgManager) => {
            try {
                const res = scope === 'local' ?
                    await stat(`${dir}/${_files[pkgManager.file]}`)
                    : await checkPackageManager(pkgManager.name);
                return { isValid: scope === 'local' ? res.isFile() : res, pkgManagerName: pkgManager.name };
            } catch (ex) {
                return { isValid: false, pkgManagerName: pkgManager.name };
            }
        }),
    ).then((result) => result
        .filter(({ isValid }) => isValid)
        .map(({ pkgManagerName }) => pkgManagerName));
}

const createDirectoryFromPath = async (dir) => {
    const pathToCreate = `${dir}/src`;

    return mkdir(pathToCreate);
};

const changeDirectory = process.chdir;

const isEmptyDir = async (dir) => {
    const numberOfFiles = (await readdir(dir))
        .filter(entry => !nopalmFileEntryNames.includes(entry))
        .length;

    return numberOfFiles === 0;
};

const getTemplateCodePathFromAddon = (type, template, tsIncluded) => {
    const globalNopalmFolderPath = join(homedir(), '.nopalm');

    const pathToRead = join(globalNopalmFolderPath, 'addon/templates', type, `${template}${tsIncluded ? '_ts' : ''}`);

    return pathToRead;
};

const getTsConfigPath = async () => {
    const globalNopalmFolderPath = join(homedir(), '.nopalm');

    const pathToRead = join(globalNopalmFolderPath, 'addon/common', 'tsconfig.json');

    return pathToRead;
};

const bashHelpers = {
    executeCommand,
    packageOperation
};

const thirdPartyHelpers = {
    getPackageDetails,
    getPackagesListFromSearch,
    getWebsiteLogo,
    getAllProjectChildDirectories
};

const fileHelpers = {
    getPackageJson,
    getPackageManagers,
    isEmptyDir,
    copyFileOrDirectory,
    readFile: _readFile,
    createFile: writeFile,
    writeToPackageJson,
    createDirectoryFromPath,
    changeDirectory,
    getTemplateCodePathFromAddon,
    getTsConfigPath
};

const Utils = {
    ...bashHelpers,
    ...thirdPartyHelpers,
    ...fileHelpers
};

export default Utils;
