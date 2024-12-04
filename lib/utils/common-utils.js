const { exec } = require('child_process');

const fs = require('fs-extra');

const util = require('util');

const os = require('os');

const path = require('path');

const axios = require('axios');

const stat = util.promisify(fs.stat);

const readdirPromisified = util.promisify(fs.readdir);

const writeFilePromisified = util.promisify(fs.writeFile);

const mkdirPromisified = util.promisify(fs.mkdir);

const readFilePromisified = util.promisify(fs.readFile);

const copyFilePromisified = util.promisify(fs.copyFile);

const lsStatPromisified = util.promisify(fs.lstat);

const websiteLogo = util.promisify(require('website-logo'));

const constants = require('../constants');

async function copyDirectory(src, dest) {
  try {
    await fs.copy(src, dest);
  } catch (err) {
    throw err;
  }
}

// Bash command helpers
const executeCommand = async (cmd) => {
  const debuglog = (global.__debug || (console.debug)).bind(null, __filename);

  debuglog(`!!!! Executing command - ${cmd} !!!!`);

  const execPromisified = util.promisify(exec);
  try {
    const result = await execPromisified(cmd, { shell: true });
    debuglog(`!!!! Successfully executed command - ${cmd} !!!!`);

    return result.stdout.toString('utf8').trim();
  } catch (er) {
    console.error(`!!!! Exception in executing command - ${cmd} !!!!`);
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
      // eslint-disable-next-line
      delete require.cache[require.resolve(pJsonPath)];
      return require(pJsonPath);
    }
    throw new Error(`Not a valid file - ${constants.files.PACKAGE_JSON}`);
  } catch (er) {
    return null;
  }
};

const writeToPackageJson = async (dir, pJsonValue) => {
  const pJsonPath = `${dir}/${constants.files.PACKAGE_JSON}`;

  return writeFilePromisified(pJsonPath, JSON.stringify(pJsonValue));
};

const packageOperation = async (pkg, packageManager, operation) => {
  let op;
  switch (operation) {
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
    let command = `${packageManager} ${op} ${pkg.name}${versionCondition} ${operation === 'install' && pkg.isDev ? ' -D' : ''}`;

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
    constants.packageManagers.map(async (pkgManager) => {
      try {
        const res = scope === 'local' ?
          await stat(`${dir}/${constants.files[pkgManager.file]}`)
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

const createSourceDirectory = async (dir) => {
  const pathToCreate = `${dir}/src`;

  return mkdirPromisified(pathToCreate);
};

const isEmptyDir = async (dir) => {
  const numberOfFiles = (await readdirPromisified(dir))
    .filter(entry => !constants.nopalmFileEntryNames.includes(entry))
    .length;

  return numberOfFiles === 0;
};

const getTemplateCodePathFromAddon = (type, template, tsIncluded) => {
  const globalNopalmFolderPath = path.join(os.homedir(), '.nopalm');

  const pathToRead = path.join(globalNopalmFolderPath, 'addon/templates', type, `${template}${tsIncluded ? '_ts' : ''}`);

  debugger;

  return pathToRead;
};

const bashHelpers = {
  executeCommand,
  packageOperation
};

const thirdPartyHelpers = {
  getPackageDetails,
  getPackagesListFromSearch,
  getWebsiteLogo
};

const fileHelpers = {
  getPackageJson,
  getPackageManagers,
  isEmptyDir,
  copyDirectory,
  writeToPackageJson,
  createSourceDirectory,
  getTemplateCodePathFromAddon
};

const Utils = {
  ...bashHelpers,
  ...thirdPartyHelpers,
  ...fileHelpers
};

module.exports = Utils;
