const constants = require('../constants');

const Utils = require('../utils/common-utils');

const {
  InvalidProjectError,
  InvalidRequestBodyError,
} = require('../utils/errors');

async function getInstalledPackagesWithDetails(pJson) {
  const dependenciesResult = await Promise.all(Object.entries(pJson.dependencies || []).map(async ([depName, installedVersion]) => {
    const packageDetails = await Utils.getPackageDetails(depName);

    const logoImgSrc = await Utils.getWebsiteLogo(packageDetails.homepage);

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
    const packageDetails = await Utils.getPackageDetails(depName);

    const logoImgSrc = await Utils.getWebsiteLogo(packageDetails.homepage);

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

async function getRelevantPackages(q) {
  const pJson = await Utils.getPackageJson(process.cwd());
  const allInstalledPackageKeys = [...Object.keys(pJson.dependencies || {}), ...Object.keys(pJson.devDependencies || {})]
  const packagesListFromSearch = (
    await Utils.getPackagesListFromSearch(q)
  ).filter(pkg => !allInstalledPackageKeys.includes(pkg.package.name));

  const dependenciesResult = await Promise.all(packagesListFromSearch.map(async (obj) => {
    const packageDetails = await Utils.getPackageDetails(obj.package.name);

    const logoImgSrc = await Utils.getWebsiteLogo(packageDetails.homepage);

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

const getInstalledPackages = async (dir = process.cwd()) => {
  const pJson = await Utils.getPackageJson(dir);
  console.debug('Successfully read package.json file')
  if (!pJson) { 
    throw new InvalidProjectError(constants.messages.INVALID_PROJECT);
  }

  const installedPackagesWithDetails = await getInstalledPackagesWithDetails(pJson);

  return {
    packages: installedPackagesWithDetails
  };
};

const packageOperation = async (reqQuery, pkg, operation) => {
  const packageManager = (reqQuery && reqQuery.package_manager) || 'npm';

  if (!pkg.name) {
    throw new InvalidRequestBodyError(constants.messages.INVALID_REQUEST_BODY);
  }

  const isSuccess = await Utils.packageOperation(pkg, packageManager, operation);

  if (isSuccess) {
    return isSuccess;
  }

  throw new Error(`Package ${operation} failed`);
};

const retrievePackageManagers = async (dir = process.cwd()) => Utils.getPackageManagers(dir);

const packageController = {
  getRelevantPackages,
  getInstalledPackages,
  packageOperation,
  retrievePackageManagers,
};

module.exports = packageController;
