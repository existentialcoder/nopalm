const { promisify } = require('util');

const websiteLogo = promisify(require('website-logo'));

const constants = require('../constants');

const Utils = require('../utils/common-utils');

const {
  InvalidProjectError,
  InvalidRequestBodyError,
} = require('../utils/errors');

async function getInstalledPackagesWithDetails(pJson) {
  const dependenciesResult = await Promise.all(Object.entries(pJson.dependencies || []).map(async ([depName, installedVersion]) => {
    const packageDetails = await Utils.getPackageDetails(depName);

    const logoImgSrc = await websiteLogo(packageDetails.homepage);

    return {
      name: packageDetails.name,
      installed_version: installedVersion,
      latest_version: packageDetails['dist-tags'].latest,
      description: packageDetails.description,
      homepage: packageDetails.homepage,
      logo: logoImgSrc.icon.href,
      is_dev: false
    };
  }));

  const devDependenciesResult = await Promise.all(Object.entries(pJson.devDependencies || []).map(async ([depName, installedVersion]) => {
    const packageDetails = await Utils.getPackageDetails(depName);

    const logoImgSrc = await websiteLogo(packageDetails.homepage);

    return {
      name: packageDetails.name,
      installed_version: installedVersion,
      latest_version: packageDetails['dist-tags'].latest,
      description: packageDetails.description,
      homepage: packageDetails.homepage,
      logo: logoImgSrc.icon.href,
      is_dev: true
    };
  }));

  return [
    ...dependenciesResult,
    ...devDependenciesResult
  ];
}

const getInstalledPackages = async (dir = process.cwd()) => {
  const pJson = await Utils.getPackageJson(dir);
  console.log('Successfully read package.json file')
  if (!pJson) { 
    throw new InvalidProjectError(constants.messages.INVALID_PROJECT);
  }

  console.log(JSON.stringify(pJson));

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
  getInstalledPackages,
  packageOperation,
  retrievePackageManagers,
};

module.exports = packageController;
