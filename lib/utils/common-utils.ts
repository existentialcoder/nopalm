import { exec } from 'child_process';

import { createRequire } from 'module';

import fsEx from 'fs-extra';

import { promisify } from 'util';

import { homedir } from 'os';

import { join } from 'path';

import axios from 'axios';

import website_logo from 'website-logo';

import constants from '../constants.js';

import { Package, PackageJson, PackageOperationType, NpmPackageData, SearchResult } from '../types.js';

const require = createRequire(import.meta.url);

const { stat: _stat, readdir, copy, writeFile, mkdir, readFile: _readFile } = fsEx;

const stat = promisify(_stat);

const websiteLogo = promisify(website_logo);

const { files: _files, packageManagers, nopalmFileEntryNames } = constants;

async function getAllProjectChildDirectories(startPath: string): Promise<string[]> {
    const nodeProjects: string[] = [];

    async function searchDirectory(dir: string): Promise<void> {
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

async function copyFileOrDirectory(src: string, dest: string): Promise<void> {
    await copy(src, dest);
}

const executeCommand = async (cmd: string): Promise<string> => {
    global.__debug?.(import.meta.url, `!!!! Executing command - ${cmd} !!!!`);

    const execPromisified = promisify(exec);
    const result = await execPromisified(cmd);
    global.__debug?.(import.meta.url, `!!!! Successfully executed command - ${cmd} !!!!`);

    return result.stdout.toString().trim();
};

const checkPackageManager = async (manager: string): Promise<boolean> => {
    try {
        const version = await executeCommand(`${manager} -v`);
        return Boolean(version);
    } catch {
        return false;
    }
};

const getPackageJson = async (dir: string): Promise<PackageJson | null> => {
    const pJsonPath = `${dir}/${constants.files.PACKAGE_JSON}`;
    try {
        const stats = await stat(pJsonPath);
        if (stats.isFile()) {
            delete require.cache[require.resolve(pJsonPath)];
            return require(pJsonPath) as PackageJson;
        }
        throw new Error(`Not a valid file - ${constants.files.PACKAGE_JSON}`);
    } catch {
        return null;
    }
};

const writeToPackageJson = async (dir: string, pJsonValue: PackageJson): Promise<void> => {
    const pJsonPath = `${dir}/${_files.PACKAGE_JSON}`;
    await writeFile(pJsonPath, JSON.stringify(pJsonValue));
};

const packageOperation = async (
    pkg: Package,
    packageManager: string,
    operation: PackageOperationType | string
): Promise<boolean> => {
    let op: string;
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
        default:
            op = operation;
    }

    try {
        const exactVersion = pkg.version && pkg.version.slice(['^', '~'].includes(pkg.version[0]) ? 1 : 0);
        const versionCondition = pkg.version ? (pkg.latest ? '@latest' : `@${exactVersion}`) : '';
        const nameCondition = pkg.name ? pkg.name : '';
        let command = `${packageManager} ${op} ${nameCondition}${versionCondition}${operation === 'install' && pkg.isDev ? ' -D' : ''}`;

        if (operation === 'upgrade' && Object.prototype.hasOwnProperty.call(pkg, 'isDev')) {
            const uninstallCommand = packageManager === 'npm' ? 'uninstall' : 'remove';
            const installCommand = packageManager === 'npm' ? 'i' : 'add';
            command = `${packageManager} ${uninstallCommand} ${pkg.name} && ${packageManager} ${installCommand} ${pkg.name}${versionCondition}${pkg.isDev ? ' -D' : ''}`;
        }

        const result = await executeCommand(command);
        return Boolean(result);
    } catch {
        return false;
    }
};

const getPackageDetails = async (pkgName: string): Promise<NpmPackageData> => {
    const { data } = await axios.get<NpmPackageData>(`https://registry.npmjs.org/${pkgName}`);
    return data;
};

const getPackagesListFromSearch = async (searchQ: string): Promise<SearchResult[]> => {
    const searchUrl = `https://api.npms.io/v2/search?q=${searchQ}`;
    const suggestionsUrl = `https://api.npms.io/v2/search/suggestions?q=${searchQ}`;

    const [searchResults, suggestionsResults] = await Promise.all(
        [suggestionsUrl, searchUrl].map(async url => {
            const { data } = await axios.get(url);
            return data;
        })
    ) as [SearchResult[], { results: SearchResult[] }];

    const completeSearchResults: SearchResult[] = [
        ...searchResults.slice(0, 20),
        ...(suggestionsResults.results ?? []).slice(0, 20),
    ];

    return completeSearchResults.reduce((uniquePackages: SearchResult[], result) => {
        const packageName = result.package.name;
        if (!uniquePackages.find(item => item.package.name === packageName)) {
            uniquePackages.push(result);
        }
        return uniquePackages;
    }, []);
};

const getWebsiteLogo = async (homepage: string): Promise<string> => {
    if (!homepage || !homepage.startsWith('http')) {
        return '';
    }

    try {
        const logoImgSrc = await websiteLogo(homepage) as { icon?: { href?: string } };

        if (logoImgSrc?.icon?.href && logoImgSrc.icon.href.length > 0) {
            return logoImgSrc.icon.href;
        }
        return '';
    } catch {
        return '';
    }
};

const getPackageManagers = async (dir: string, scope: string): Promise<string[]> => {
    return Promise.all(
        packageManagers.map(async (pkgManager) => {
            try {
                let isValid: boolean;
                if (scope === 'local') {
                    const stats = await stat(`${dir}/${_files[pkgManager.file as keyof typeof _files]}`);
                    isValid = stats.isFile();
                } else {
                    isValid = await checkPackageManager(pkgManager.name);
                }
                return { isValid, pkgManagerName: pkgManager.name };
            } catch {
                return { isValid: false, pkgManagerName: pkgManager.name };
            }
        }),
    ).then(result => result
        .filter(({ isValid }) => isValid)
        .map(({ pkgManagerName }) => pkgManagerName));
};

const createDirectoryFromPath = async (dir: string): Promise<void> => {
    const pathToCreate = `${dir}/src`;
    await mkdir(pathToCreate);
};

const changeDirectory = process.chdir;

const isEmptyDir = async (dir: string): Promise<boolean> => {
    const numberOfFiles = (await readdir(dir))
        .filter(entry => !nopalmFileEntryNames.includes(entry))
        .length;

    return numberOfFiles === 0;
};

const getTemplateCodePathFromAddon = (type: string, template: string, tsIncluded: boolean): string => {
    const globalNopalmFolderPath = join(homedir(), '.nopalm');
    return join(globalNopalmFolderPath, 'addon/templates', type, `${template}${tsIncluded ? '_ts' : ''}`);
};

const getTsConfigPath = async (): Promise<string> => {
    const globalNopalmFolderPath = join(homedir(), '.nopalm');
    return join(globalNopalmFolderPath, 'addon/common', 'tsconfig.json');
};

const Utils = {
    executeCommand,
    packageOperation,
    getPackageDetails,
    getPackagesListFromSearch,
    getWebsiteLogo,
    getAllProjectChildDirectories,
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
    getTsConfigPath,
};

export default Utils;
