const { exec } = require('child_process');

const fs = require('fs');

const util = require('util');

const axios = require('axios');

const stat = util.promisify(fs.stat);

const websiteLogo = util.promisify(require('website-logo'));

const constants = require('../constants');

// Bash command helpers
const executeCommand = async (cmd) => {
  console.debug(`!!!! Executing command - ${cmd} !!!!`);

  const execPromisified = util.promisify(exec);
  try {
    const result = await execPromisified(cmd);
    console.debug(`!!!! Successfully executed command - ${cmd} !!!!`);

    return result.toString('utf8');
  } catch (er) {
    console.error(`!!!! Exception in executing command - ${cmd} !!!!`);
    throw er;
  }
};

const checkPackageManager = async (manager) => {
  try {
    const result = await executeCommand(`which ${manager}`);
    const version = await executeCommand(`${manager} -v`);

    return Boolean(result && version);
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

  const getPackageManagers = async (dir) => Promise.all(
    constants.packageManagers.map(async (pkgManager) => {
      try {
        const stats = await stat(`${dir}/${constants.files[pkgManager.file]}`);
        return { isValid: stats.isFile(), pkgManagerName: pkgManager.name };
      } catch (ex) {
        return { isValid: false, pkgManagerName: pkgManager.name };
      }
    }),
  ).then((result) => result
    .filter(({ isValid }) => isValid)
    .map(({ pkgManagerName }) => pkgManagerName));

  const bashHelpers = {
    executeCommand,
    checkPackageManager,
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
  };

  const Utils = {
    ...bashHelpers,
    ...thirdPartyHelpers,
    ...fileHelpers,
  };

  module.exports = Utils;
