import { join, basename, resolve } from 'path';

import { isGitInstalled, getGitRemoteRepoHttpsUrl, getGlobalUserEmail } from '../utils/git.js';

import Utils from '../utils/common-utils.js';

import {
  Meta,
  NewProjectBody,
  NewProjectDetails,
  PackageJsonDetails,
  PackageJson,
} from '../types.js';

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
  packageOperation,
} = Utils;

async function cliAppProjectSetup(newProjectDetailsBody: NewProjectDetails, dir: string): Promise<void> {
  const cliTemplate = newProjectDetailsBody.projectSetupDetails.cli_utility_package.length > 0
    ? newProjectDetailsBody.projectSetupDetails.cli_utility_package
    : 'default';

  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

  const templatePath = getTemplateCodePathFromAddon('cli', cliTemplate, typeScriptIncluded);

  return copyFileOrDirectory(templatePath, dir);
}

async function webAppProjectSetup(
  newProjectDetailsBody: NewProjectDetails,
  packageManager: string,
  typeScriptIncluded: boolean,
  dir: string
): Promise<void> {
  const { type_of_web_app: typeOfWebApp } = newProjectDetailsBody.projectSetupDetails;

  if (!typeOfWebApp) {
    const templatePath = await getTemplateCodePathFromAddon('web', 'default', false);
    global.__debug?.(import.meta.url, `Reading the selected template from path : ${templatePath}`);
    return copyFileOrDirectory(templatePath, dir);
  }

  const isFrontendIncluded = ['frontend_only', 'fullstack'].includes(typeOfWebApp);
  const isBackendIncluded = ['backend_only', 'fullstack'].includes(typeOfWebApp);

  if (isFrontendIncluded) {
    global.__debug?.(import.meta.url, 'Frontend is included in the project setup details. Creating frontend project under /client directory using vite');
    const frontendFramework = newProjectDetailsBody.projectSetupDetails.frontend_framework &&
      newProjectDetailsBody.projectSetupDetails.frontend_framework.length > 0
      ? newProjectDetailsBody.projectSetupDetails.frontend_framework
      : 'vanilla';

    const commandToExecute = `${packageManager} create vite@latest -- client --template ${frontendFramework}${typeScriptIncluded ? '-ts' : ''}`;
    await executeCommand(commandToExecute);
  }

  if (isBackendIncluded) {
    global.__debug?.(import.meta.url, 'Backend is included in the project setup details. Creating backend project using express');
    const webServerFramework = newProjectDetailsBody.projectSetupDetails.web_server_framework.length > 0
      ? newProjectDetailsBody.projectSetupDetails.web_server_framework
      : 'default';

    const templatePath = getTemplateCodePathFromAddon('web/backend', webServerFramework, typeScriptIncluded);
    return copyFileOrDirectory(templatePath, `${dir}/server`);
  }
}

async function defaultProjectSetup(newProjectDetailsBody: NewProjectDetails, dir: string): Promise<void> {
  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;
  const templatePath = await getTemplateCodePathFromAddon('default', 'default', typeScriptIncluded);
  global.__debug?.(import.meta.url, `Reading the selected template from path : ${templatePath}`);
  return copyFileOrDirectory(templatePath, dir);
}

async function initializeProjectWithSelectedTools(
  newProjectDetailsBody: NewProjectDetails,
  packageManager: string,
  dir: string
): Promise<void> {
  const { ts_preference: typeScriptIncluded } = newProjectDetailsBody.projectSetupDetails;

  const initializer = () => {
    switch (newProjectDetailsBody.projectSetupDetails.type_of_app) {
      case 'cli':
        return cliAppProjectSetup(newProjectDetailsBody, dir);
      case 'web_app':
        return webAppProjectSetup(newProjectDetailsBody, packageManager, typeScriptIncluded, dir);
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

async function configurePackageJson(
  projectDetailsBody: { packageJsonDetails: Partial<PackageJsonDetails> },
  dir: string
): Promise<void> {
  const pJson: PackageJson = {
    ...(await getPackageJson(dir))
  };

  (
    ['name', 'homepage', 'bugs', 'author', 'repository', 'keywords', 'description', 'private', 'license'] as
    (keyof PackageJsonDetails)[]
  ).forEach(k => {
    if (Object.prototype.hasOwnProperty.call(projectDetailsBody.packageJsonDetails, k)) {
      const val = projectDetailsBody.packageJsonDetails[k];
      const pJsonAny = pJson as Record<string, unknown>;
      if (['bugs', 'repository', 'homepage'].includes(k)) {
        const strVal = val as string;
        pJsonAny[k] = pJson[k] && typeof pJson[k] === 'object'
          ? { ...(pJson[k] as object), url: strVal.length > 0 ? `https://${strVal}` : '' }
          : strVal.length > 0 ? `https://${strVal}` : '';
      } else {
        pJsonAny[k] = val;
      }
    }
  });

  await writeToPackageJson(dir, pJson);
}

function restructureNewProjectDetails(input: NewProjectBody): NewProjectDetails {
  const packageJsonDetails: PackageJsonDetails = {
    name: input.name || 'sample-node-project',
    homepage: input.homepage || '',
    bugs: input.bugs || '',
    author: input.author || '',
    repository: input.repository || '',
    keywords: input.keywords || [],
    description: input.description || '',
    private: !!input.private,
    license: input.license || '',
  };

  const projectSetupDetails = {
    type_of_app: input.type_of_app ?? 'default',
    linter: input.linter || '',
    ts_preference: input.ts_preference === 'yes',
    cli_utility_package: input.cli_utility_package || '',
    type_of_web_app: input.type_of_web_app || '',
    frontend_framework: input.frontend_framework || '',
    frontend_build_tool: input.frontend_build_tool || '',
    unit_test_framework: input.unit_test_framework || '',
    web_server_framework: input.web_server_framework || '',
    database: input.database || '',
    orm: input.orm || '',
  };

  return { packageJsonDetails, projectSetupDetails };
}

function extractUrlWithoutProtocol(url: string): string {
  return url.split('://')[1] ?? url;
}

function pickRelevantKeys(pJson: PackageJson): Partial<PackageJsonDetails> {
  const repository = 'repository' in pJson ? (
    typeof pJson.repository === 'object' && pJson.repository !== null
      ? extractUrlWithoutProtocol((pJson.repository as { url: string }).url)
      : extractUrlWithoutProtocol(pJson.repository as string)
  ) : '';

  const bugs = 'bugs' in pJson ? (
    typeof pJson.bugs === 'object' && pJson.bugs !== null
      ? extractUrlWithoutProtocol((pJson.bugs as { url: string }).url)
      : extractUrlWithoutProtocol(pJson.bugs as string)
  ) : '';

  const homepage = pJson.homepage ? extractUrlWithoutProtocol(pJson.homepage) : '';

  return {
    name: pJson.name,
    description: pJson.description || '',
    private: !!pJson.private,
    keywords: pJson.keywords || [],
    repository,
    homepage,
    bugs,
    license: pJson.license,
    author: typeof pJson.author === 'object' && pJson.author !== null
      ? (pJson.author as { name: string }).name
      : (pJson.author as string) || '',
  };
}

async function getDefaultsForNewProject(_dir: string): Promise<Partial<PackageJsonDetails>> {
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
    repository: gitRepoHttpsUrl ? `${gitRepoHttpsUrl}.git` : '',
  };
}

interface ProjectDirectoryEntry {
  root: boolean;
  path: string;
}

interface ProjectDetailsResult {
  project: Partial<PackageJsonDetails> | Record<string, never>;
  is_empty_dir: boolean;
  defaults: Partial<PackageJsonDetails>;
  all_project_directories: ProjectDirectoryEntry[];
}

const getProjectDetails = async (dir: string): Promise<ProjectDetailsResult> => {
  const pJson = await getPackageJson(dir);

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
      all_project_directories: allProjectChildDirectories,
    };
  }

  return {
    project: pickRelevantKeys(pJson),
    is_empty_dir: false,
    defaults: {},
    all_project_directories: allProjectChildDirectories,
  };
};

const createNewProject = async (meta: Meta, newProjectDetailsBody: NewProjectBody, dir: string): Promise<boolean> => {
  const packageManager = meta.settings.package_manager;

  const restructuredNewProjectDetailsBody = restructureNewProjectDetails(newProjectDetailsBody);

  await initializeProjectWithSelectedTools(restructuredNewProjectDetailsBody, packageManager, dir);

  await configurePackageJson(restructuredNewProjectDetailsBody, dir);

  const isFrontendIncluded = ['frontend_only', 'fullstack'].includes(
    restructuredNewProjectDetailsBody?.projectSetupDetails?.type_of_web_app || ''
  );
  const isBackendIncluded = ['backend', 'fullstack'].includes(
    restructuredNewProjectDetailsBody?.projectSetupDetails?.type_of_web_app || ''
  );

  const directoriesToInstallPackages = [
    dir,
    isFrontendIncluded ? join(dir, 'client') : '',
    isBackendIncluded ? join(dir, 'server') : '',
  ].filter(d => d.length > 0);

  void Promise.all(directoriesToInstallPackages.map(async dirPath => {
    global.__debug?.(import.meta.url, `Installing packages from package.json post project creation in path : ${dirPath}`);
    changeDirectory(dirPath);
    await packageOperation({}, packageManager, 'install_all');
    changeDirectory(dir);
  }));

  changeDirectory(dir);

  return true;
};

const updateProject = async (projectDetailsBody: Partial<PackageJsonDetails>, dir: string): Promise<boolean> => {
  await configurePackageJson({ packageJsonDetails: projectDetailsBody }, dir);
  return true;
};

const projectController = {
  getProjectDetails,
  createNewProject,
  updateProject,
};

export default projectController;
