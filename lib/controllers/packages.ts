import constants from '../constants.js';

import Utils from '../utils/common-utils.js';

import { InvalidProjectError, InvalidRequestBodyError } from '../utils/errors.js';

import { PackageJson, DependencyResult, InstalledPackageResult, Meta, Package } from '../types.js';

const { getPackageDetails, getWebsiteLogo, getPackageJson, getPackagesListFromSearch, changeDirectory, packageOperation: _packageOperation } = Utils;

const { messages } = constants;

async function getInstalledPackagesWithDetails(pJson: PackageJson): Promise<InstalledPackageResult[]> {
  const allDependencyEntries: [string, string][] = [
    ...Object.entries(pJson.dependencies || {}),
    ...Object.entries(pJson.devDependencies || {}),
  ];

  const devDependencyKeys = Object.keys(pJson.devDependencies || {});

  return Promise.all(allDependencyEntries.map(async ([depName, installedVersion]) => {
    const packageDetails = await getPackageDetails(depName);
    const logoImgSrc = await getWebsiteLogo(packageDetails.homepage ?? '');

    return {
      name: packageDetails.name,
      installed_version: installedVersion,
      latest_version: packageDetails['dist-tags'].latest,
      description: packageDetails.description || 'Not available',
      homepage: packageDetails.homepage ?? '',
      logo: logoImgSrc,
      versions: Object.keys(packageDetails.versions).reverse(),
      is_dev: devDependencyKeys.includes(packageDetails.name),
    };
  }));
}

async function getRelevantPackages(q: string, dirPath: string): Promise<DependencyResult[]> {
  const pJson = await getPackageJson(dirPath);
  const allInstalledPackageKeys = [
    ...Object.keys(pJson?.dependencies || {}),
    ...Object.keys(pJson?.devDependencies || {}),
  ];

  const packagesListFromSearch = (
    await getPackagesListFromSearch(q)
  ).filter(pkg => !allInstalledPackageKeys.includes(pkg.package.name));

  return Promise.all(packagesListFromSearch.map(async (obj) => {
    const packageDetails = await getPackageDetails(obj.package.name);
    const logoImgSrc = await getWebsiteLogo(packageDetails.homepage ?? '');

    return {
      name: packageDetails.name,
      latest_version: packageDetails['dist-tags'].latest,
      description: packageDetails.description || 'Not available',
      homepage: packageDetails.homepage ?? '',
      logo: logoImgSrc,
      versions: Object.keys(packageDetails.versions).reverse(),
    };
  }));
}

const getInstalledPackages = async (dir: string): Promise<{ packages: InstalledPackageResult[] }> => {
  const pJson = await getPackageJson(dir);

  global.__debug?.(import.meta.url, 'Successfully read package.json file');

  if (!pJson) {
    throw new InvalidProjectError(messages.INVALID_PROJECT);
  }

  const installedPackagesWithDetails = await getInstalledPackagesWithDetails(pJson);

  return { packages: installedPackagesWithDetails };
};

const packageOperation = async (meta: Meta, dir: string, pkg: Package, operation: string): Promise<boolean> => {
  const parentDir = process.cwd();
  changeDirectory(dir);

  const packageManager = meta.settings.package_manager;

  if (!pkg.name) {
    throw new InvalidRequestBodyError(messages.INVALID_REQUEST_BODY);
  }

  const isSuccess = await _packageOperation(pkg, packageManager, operation);

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
