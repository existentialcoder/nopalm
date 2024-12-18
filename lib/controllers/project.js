const path = require('path');

const {
  isGitInstalled,
  getGitRemoteRepoHttpsUrl,
  getGlobalUserEmail
} = require('../utils/git');

const Utils = require('../utils/common-utils');
const { debuglog } = require('util');

async function cliAppProjectSetup(newProjectDetailsBody, dir) {
  const cliTemplate = newProjectDetailsBody.projectSetupDetails.cli_utility_package.length > 0
    ? newProjectDetailsBody.projectSetupDetails.cli_utility_package
    : 'default';

  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

  const templatePath = Utils.getTemplateCodePathFromAddon('cli', cliTemplate, typeScriptIncluded);

  return Utils.copyDirectory(templatePath, dir);
}

async function defaultProjectSetup(newProjectDetailsBody, dir) {
  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

  const templatePath = await Utils.getTemplateCodePathFromAddon('default', 'default', typeScriptIncluded);

  return Utils.copyDirectory(templatePath, dir);
}

async function initializeProjectWithSelectedTools(newProjectDetailsBody, dir) {
  const initializer = () => {
    switch (newProjectDetailsBody.projectSetupDetails.type_of_app) {
      case 'cli':
        return cliAppProjectSetup(newProjectDetailsBody, dir);
      case 'web_app':
        return webAppProjectSetup(newProjectDetailsBody, dir);
      // type_of_app not selected. write a default js file
      case 'default':
        return defaultProjectSetup(newProjectDetailsBody, dir);
    }
  };

  await initializer();

  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

  if (typeScriptIncluded) {
    // Include tsconfig.json
  }
}

async function configurePackageJson(projectDetailsBody, dir) {
  // Get and modify the package.json
  const pJson = {
    ...(await Utils.getPackageJson(dir))
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
          url: `https://${projectDetailsBody.packageJsonDetails[k]}`
        } : `https://${projectDetailsBody.packageJsonDetails[k]}`;
      } else {
        pJson[k] = projectDetailsBody.packageJsonDetails[k];
      }
    }
  });

  await Utils.writeToPackageJson(dir, pJson);
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
    type_of_app: ['', 'none', 'default'].includes(input.type_of_app) ? 'default' : input.type_of_app,
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
    description: pJson.description,
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

  const dirName = path.basename(path.resolve(process.cwd()));

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

const getProjectDetails = async (dir = process.cwd()) => {
  const pJson = await Utils.getPackageJson(dir);

  if (!pJson) {
    return {
      project: {},
      is_empty_dir: await Utils.isEmptyDir(dir),
      defaults: await getDefaultsForNewProject(dir)
    };
  }

  return {
    project: pickRelevantKeys(pJson),
    // false! obviously!
    is_empty_dir: false,
    // Defaults do not apply for an existing project
    defaults: {}
  };
};

const createNewProject = async (meta, newProjectDetailsBody, dir = process.cwd()) => {
  const packageManager = meta.settings.package_manager;

  const restructuredNewProjectDetailsBody = restructureNewProjectDetails(newProjectDetailsBody);

  await initializeProjectWithSelectedTools(restructuredNewProjectDetailsBody, dir);

  await configurePackageJson(restructuredNewProjectDetailsBody, dir);

  // Asynchronously install packages
  debuglog('Installing packages from package.json post project creation');
  Utils.packageOperation({}, packageManager, 'install_all');

  return true;
};

const updateProject = async (projectDetailsBody, dir = process.cwd()) => {
  await configurePackageJson({ packageJsonDetails: projectDetailsBody }, dir);

  return true;
};

const projectController = {
  getProjectDetails,
  createNewProject,
  updateProject
};

module.exports = projectController;
