const constants = require('../constants');
const Utils = require('../utils/common-utils');
const {
  InvalidProjectError,
  InvalidRequestBodyError,
} = require('../utils/errors');

const getInstalledPackages = async (dir = process.cwd()) => {
  const pJson = await Utils.getPackageJson(dir);
  if (!pJson) {
    throw new InvalidProjectError(constants.messages.INVALID_PROJECT);
  }

  return {
    packages: {
      dependencies: pJson.dependencies || {},
      devDependencies: pJson.devDependencies || {},
    },
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
