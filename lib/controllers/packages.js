import { fileURLToPath } from 'url';

import constants from '../constants.js';

import Utils from '../utils/common-utils.js';

import { InvalidProjectError, InvalidRequestBodyError } from '../utils/errors.js';

const { getPackageDetails, getWebsiteLogo, getPackageJson, getPackagesListFromSearch, changeDirectory, packageOperation: _packageOperation } = Utils;

const { messages } = constants;

async function getInstalledPackagesWithDetails(pJson) {
  const dependenciesResult = await Promise.all(Object.entries(pJson.dependencies || []).map(async ([depName, installedVersion]) => {
    const packageDetails = await getPackageDetails(depName);

    const logoImgSrc = await getWebsiteLogo(packageDetails.homepage);

    return {
      name: packageDetails.name,
      installed_version: installedVersion,
      latest_version: packageDetails['dist-tags'].latest,
      description: packageDetails.description || 'Not available',
      homepage: packageDetails.homepage,
      logo: logoImgSrc,
      versions: Object.keys(packageDetails.versions).reverse(),
      is_dev: false
    };
  }));

  const devDependenciesResult = await Promise.all(Object.entries(pJson.devDependencies || []).map(async ([depName, installedVersion]) => {
    const packageDetails = await getPackageDetails(depName);

    const logoImgSrc = await getWebsiteLogo(packageDetails.homepage);

    return {
      name: packageDetails.name,
      installed_version: installedVersion,
      latest_version: packageDetails['dist-tags'].latest,
      description: packageDetails.description || 'Not available',
      homepage: packageDetails.homepage,
      logo: logoImgSrc,
      versions: Object.keys(packageDetails.versions).reverse(),
      is_dev: true
    };
  }));

  return [
    ...dependenciesResult,
    ...devDependenciesResult
  ];
}

async function getRelevantPackages(q, dirPath) {
  const pJson = await getPackageJson(dirPath);
  const allInstalledPackageKeys = [...Object.keys(pJson.dependencies || {}), ...Object.keys(pJson.devDependencies || {})]
  const packagesListFromSearch = (
    await getPackagesListFromSearch(q)
  ).filter(pkg => !allInstalledPackageKeys.includes(pkg.package.name));

  const dependenciesResult = await Promise.all(packagesListFromSearch.map(async (obj) => {
    const packageDetails = await getPackageDetails(obj.package.name);

    const logoImgSrc = await getWebsiteLogo(packageDetails.homepage);

    return {
      name: packageDetails.name,
      latest_version: packageDetails['dist-tags'].latest,
      description: packageDetails.description || 'Not available',
      homepage: packageDetails.homepage,
      logo: logoImgSrc,
      versions: Object.keys(packageDetails.versions).reverse()
    };
  }));

  return dependenciesResult;
}

const getInstalledPackages = async (dir) => {
  const pJson = await getPackageJson(dir);

  __debug(import.meta.url, 'Successfully read package.json file');

  if (!pJson) { 
    throw new InvalidProjectError(messages.INVALID_PROJECT);
  }

  const installedPackagesWithDetails = await getInstalledPackagesWithDetails(pJson);

  return {
    packages: installedPackagesWithDetails
  };
};

const packageOperation = async (meta, dir, pkg, operation) => {
  // Change the directory first
  const parentDir = process.cwd();
  changeDirectory(dir);

  const packageManager = meta.settings.package_manager;

  if (!pkg.name) {
    throw new InvalidRequestBodyError(messages.INVALID_REQUEST_BODY);
  }

  const isSuccess = await _packageOperation(pkg, packageManager, operation);

  // Reset to parent directory
  changeDirectory(parentDir);

  if (isSuccess) {
    return isSuccess;
  }

  throw new Error(`Package ${operation} failed`);
};

const packageController = {
  getRelevantPackages,
  getInstalledPackages,
  packageOperation,
};

export default packageController;
