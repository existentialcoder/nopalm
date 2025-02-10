import { join, basename, resolve } from 'path';

import { fileURLToPath } from 'url';

import { isGitInstalled, getGitRemoteRepoHttpsUrl, getGlobalUserEmail } from '../utils/git.js';

import Utils from '../utils/common-utils.js';

const { 
  getTemplateCodePathFromAddon,
  copyFileOrDirectory,
  executeCommand,
  getTsConfigPath,
  getPackageJson,
  writeToPackageJson,
  getAllProjectChildDirectories,
  isEmptyDir,
  changeDirectory,
  packageOperation
} = Utils;

async function cliAppProjectSetup(newProjectDetailsBody, dir) {
  const cliTemplate = newProjectDetailsBody.projectSetupDetails.cli_utility_package.length > 0
    ? newProjectDetailsBody.projectSetupDetails.cli_utility_package
    : 'default';

  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

  const templatePath = getTemplateCodePathFromAddon('cli', cliTemplate, typeScriptIncluded);

  return copyFileOrDirectory(templatePath, dir);
}

async function webAppProjectSetup(newProjectDetailsBody, packageManager, typeScriptIncluded, dir) {
  const { type_of_web_app: typeOfWebApp } = newProjectDetailsBody.projectSetupDetails;

  if (!typeOfWebApp) {
    // Default web app template
    const templatePath = await getTemplateCodePathFromAddon('web', 'default', false);

    __debug(import.meta.url, `Reading the selected template from path : ${templatePath}`);

    return copyFileOrDirectory(templatePath, dir);
  }

  const isFrontendIncluded = ['frontend_only', 'fullstack'].includes(typeOfWebApp),
    isBackendIncluded = ['backend_only', 'fullstack'].includes(typeOfWebApp);

  if (isFrontendIncluded) {
    __debug(import.meta.url, 'Frontend is included in the project setup details. Creating frontend project under /client directory using vite');
    const frontendFramework = newProjectDetailsBody.projectSetupDetails.frontend_framework && newProjectDetailsBody.projectSetupDetails.frontend_framework.length > 0
      ? newProjectDetailsBody.projectSetupDetails.frontend_framework
      : 'vanilla';

    // Using vite as the default and only build tool for frontend
    const commandToExecute = `${packageManager} create vite@latest -- client --template ${frontendFramework}${typeScriptIncluded ? '-ts' : ''}`;

    await executeCommand(commandToExecute, dir);
  }

  if (isBackendIncluded) {
    __debug(import.meta.url, 'Backend is included in the project setup details. Creating backend project using express');
    const webServerFramework = newProjectDetailsBody.projectSetupDetails.web_server_framework.length > 0
      ? newProjectDetailsBody.projectSetupDetails.web_server_framework
      : 'default';

    const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

    const templatePath = getTemplateCodePathFromAddon('web/backend', webServerFramework, typeScriptIncluded);

    return copyFileOrDirectory(templatePath, `${dir}/server`);
  }
}

async function defaultProjectSetup(newProjectDetailsBody, dir) {
  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

  const templatePath = await getTemplateCodePathFromAddon('default', 'default', typeScriptIncluded);

  __debug(import.meta.url, `Reading the selected template from path : ${templatePath}`);

  return copyFileOrDirectory(templatePath, dir);
}

async function initializeProjectWithSelectedTools(newProjectDetailsBody, packageManager, dir) {
  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

  const initializer = () => {
    switch (newProjectDetailsBody.projectSetupDetails.type_of_app) {
      case 'cli':
        return cliAppProjectSetup(newProjectDetailsBody, dir);
      case 'web_app':
        return webAppProjectSetup(newProjectDetailsBody, packageManager, typeScriptIncluded, dir);
      // type_of_app not selected. write a default js file
      default:
        return defaultProjectSetup(newProjectDetailsBody, dir);
    }
  };

  await initializer();

  if (newProjectDetailsBody.projectSetupDetails.type_of_app !== 'web_app' && typeScriptIncluded) {
    const tsConfigFilePath = await getTsConfigPath();

    await copyFileOrDirectory(tsConfigFilePath, join(dir, 'tsconfig.json'));
  }
}

async function configurePackageJson(projectDetailsBody, dir) {
  // Get and modify the package.json
  const pJson = {
    ...(await getPackageJson(dir))
  };

  [
    'name', 'homepage', 'bugs',
    'author', 'repository', 'keywords',
    'description', 'private', 'license'
  ].forEach(k => {
    if (projectDetailsBody.packageJsonDetails.hasOwnProperty(k)) {
      if (['bugs', 'repository', 'homepage'].includes(k)) {
        pJson[k] = pJson.hasOwnProperty(k) && typeof pJson[k] === 'object' ? {
          ...pJson[k],
          url: projectDetailsBody.packageJsonDetails[k].length > 0 ? `https://${projectDetailsBody.packageJsonDetails[k]}` : ''
        } : projectDetailsBody.packageJsonDetails[k].length > 0 ? `https://${projectDetailsBody.packageJsonDetails[k]}` : '';
      } else {
        pJson[k] = projectDetailsBody.packageJsonDetails[k];
      }
    }
  });

  await writeToPackageJson(dir, pJson);
}

function restructureNewProjectDetails(input) {
  const packageJsonDetails = {
    name: input.name || 'sample-node-project',
    homepage: input.homepage || '',
    bugs: input.bugs || '',
    author: input.author || '',
    repository: input.repository || '',
    keywords: input.keywords || [],
    description: input.description || '',
    private: !!input.private,
    license: input.license || ''
  };

  const projectSetupDetails = {
    type_of_app: input.hasOwnProperty('type_of_app') ? input.type_of_app : 'default',
    linter: input.linter || '',
    ts_preference: input.ts_preference === 'yes',
    cli_utility_package: input.cli_utility_package || '',
    type_of_web_app: input.type_of_web_app || '',
    frontend_framework: input.frontend_framework || '',
    frontend_build_tool: input.frontend_build_tool || '',
    unit_test_framework: input.unit_test_framework || '',
    web_server_framework: input.web_server_framework || '',
    database: input.database || '',
    orm: input.orm || ''
  };

  return {
    packageJsonDetails,
    projectSetupDetails
  };
}

function extractUrlWithoutProtocol(url) {
  return url.split('://')[1];
}


function pickRelevantKeys(pJson) {
  const repository = pJson.hasOwnProperty('repository') ? (
    typeof pJson.repository === 'object'
      ? extractUrlWithoutProtocol(pJson.repository.url) : extractUrlWithoutProtocol(pJson.repository)
  ) : '';

  const bugs = pJson.hasOwnProperty('bugs') ? (
    typeof pJson.bugs === 'object'
      ? extractUrlWithoutProtocol(pJson.bugs.url) : extractUrlWithoutProtocol(pJson.bugs)
  ) : '';

  const homepage = pJson.hasOwnProperty('homepage') ? extractUrlWithoutProtocol(pJson.homepage) : '';

  return {
    name: pJson.name,
    description: pJson.description || '',
    private: !!pJson.private,
    keywords: pJson.keywords || [],
    repository,
    homepage,
    bugs,
    license: pJson.license,
    author: pJson.author || ''
  };
}

async function getDefaultsForNewProject(dir) {
  // Check if git installed, if not return empty object
  if (!(await isGitInstalled())) {
    return {};
  }

  const dirName = basename(resolve(process.cwd()));

  const gitRepoHttpsUrl = await getGitRemoteRepoHttpsUrl();
  const authorEmail = await getGlobalUserEmail();

  return {
    name: dirName,
    homepage: gitRepoHttpsUrl ? `${gitRepoHttpsUrl}#readme` : '',
    bugs: gitRepoHttpsUrl ? `${gitRepoHttpsUrl}/issues` : '',
    author: authorEmail,
    repository: gitRepoHttpsUrl ? `${gitRepoHttpsUrl}.git` : ''
  }
}

const getProjectDetails = async (dir) => {
  const pJson = await getPackageJson(dir);

  // Directory in which nopalm is initially run
  const parentDir = process.cwd();

  const allProjectChildDirectories = (await getAllProjectChildDirectories(parentDir)).map(dirInScope => ({
    root: dirInScope === process.cwd(),
    path: dirInScope,
  }));

  if (!pJson) {
    return {
      project: {},
      is_empty_dir: await isEmptyDir(dir),
      defaults: await getDefaultsForNewProject(dir),
      all_project_directories: allProjectChildDirectories
    };
  }

  return {
    project: pickRelevantKeys(pJson),
    // false! obviously!
    is_empty_dir: false,
    // Defaults do not apply for an existing project
    defaults: {},
    all_project_directories: allProjectChildDirectories
  };
};

const createNewProject = async (meta, newProjectDetailsBody, dir) => {
  const packageManager = meta.settings.package_manager;

  const restructuredNewProjectDetailsBody = restructureNewProjectDetails(newProjectDetailsBody);

  await initializeProjectWithSelectedTools(restructuredNewProjectDetailsBody, packageManager, dir);

  await configurePackageJson(restructuredNewProjectDetailsBody, dir);

  const isFrontendIncluded = ['frontend_only', 'fullstack'].includes(restructuredNewProjectDetailsBody?.projectSetupDetails?.type_of_web_app || ''),
    isBackendIncluded = ['backend', 'fullstack'].includes(restructuredNewProjectDetailsBody?.projectSetupDetails?.type_of_web_app || '');

  const directoriesToInstallPackages = [
    dir,
    isFrontendIncluded ? join(dir, 'client') : '',
    isBackendIncluded ? join(dir, 'server') : ''
  ].filter(dir => dir.length > 0);

  Promise.all(directoriesToInstallPackages.map(async dirPath => {
    // Asynchronously install packages
    __debug(import.meta.url, `Installing packages from package.json post project creation in path : ${dirPath}`);

    changeDirectory(dirPath);

    await packageOperation({}, packageManager, 'install_all');

    changeDirectory(dir);
  }));

  changeDirectory(dir);

  return true;
};

const updateProject = async (projectDetailsBody, dir) => {
  await configurePackageJson({ packageJsonDetails: projectDetailsBody }, dir);

  return true;
};

const projectController = {
  getProjectDetails,
  createNewProject,
  updateProject
};

export default projectController;
