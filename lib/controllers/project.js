const path = require('path');

const {
  isGitInstalled,
  getGitRemoteRepoHttpsUrl,
  getGlobalUserEmail
} = require('../utils/git');

const Utils = require('../utils/common-utils');

async function cliAppProjectSetup(newProjectDetailsBody, dir, packageManager) {
  debugger;
  const cliTemplate = newProjectDetailsBody.projectSetupDetails.cli_utility_package.length > 0
    ? newProjectDetailsBody.projectSetupDetails.cli_utility_package
    : 'default';

  debugger;
  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

  const templatePath = Utils.getTemplateCodePathFromAddon('cli', cliTemplate, typeScriptIncluded);

  debugger;

  return Utils.copyDirectory(templatePath, dir);
}

async function defaultProjectSetup(newProjectDetailsBody, packageManager) {
  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

  debugger;

  const templateScript = await Utils.getTemplateCodePathFromAddon('', 'default', typeScriptIncluded);

  debugger;

  Utils.createFile(`${dir}/index.${typeScriptIncluded ? 'ts' : 'js'}`, templateScript);
}

async function initializeProjectWithSelectedTools(newProjectDetailsBody, dir, packageManager) {
  debugger;
  const initializer = () => {
    switch (newProjectDetailsBody.projectSetupDetails.type_of_app) {
      case 'cli':
        debugger;
        return cliAppProjectSetup(newProjectDetailsBody, dir, packageManager);
      case 'web_app':
        return webAppProjectSetup(newProjectDetailsBody, dir, packageManager);
      // type_of_app not selected. write a default js file
      case 'default':
        debugger;
        return defaultProjectSetup(newProjectDetailsBody, dir, packageManager);
    }
  };

  await initializer();

  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

  if (typeScriptIncluded) {
    // Include tsconfig.json
  }
}

async function configurePackageJson(newProjectDetailsBody, dir, packageManager) {
  // Get and modify the package.json
  const pJson = {
    ...(await Utils.getPackageJson(dir))
  };

  debugger;

  [
    'name', 'homepage', 'bugs',
    'author', 'repository', 'keywords',
    'description', 'private'
  ].forEach(k => {
    if (newProjectDetailsBody.packageJsonDetails.hasOwnProperty(k)) {
      pJson[k] = newProjectDetailsBody.packageJsonDetails[k];
    }
  });

  await Utils.writeToPackageJson(dir, pJson);
}

function restructureNewProjectDetails(input) {
  debugger;
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
  }

  debugger; 

  const projectSetupDetails = {
    type_of_app: input.type_of_app || 'default',
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
  }

  return {
    packageJsonDetails,
    projectSetupDetails
  };
}

function pickRelevantKeys(pJson) {
  return {
    name: pJson.name,
    descripiton: pJson.descripiton,
    private: !!pJson.private,
    keywords: pJson.keywords || [],
    repository: pJson.repository || {},
    homepage: pJson.homepage || '',
    bugs: pJson.bugs || {},
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
  debugger;
  const packageManager = meta.settings.package_manager;

  const restructuredNewProjectDetailsBody = restructureNewProjectDetails(newProjectDetailsBody);

  await initializeProjectWithSelectedTools(restructuredNewProjectDetailsBody, dir, packageManager);

  await configurePackageJson(restructuredNewProjectDetailsBody, dir, packageManager);

  return true;
};

const projectController = {
  getProjectDetails,
  createNewProject
};

module.exports = projectController;
