const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

import { InstalledPackageProps, NewProjectDefaults, ProjectDetailsProps, ProjectDirectory, SettingsResultProps } from '../helpers/types';

async function getProjectDetails(dir: string): Promise<{ project: ProjectDetailsProps, isEmptyDir: boolean, allProjectDirectories: ProjectDirectory[],defaults: NewProjectDefaults }> {
    const urlPath = 'project';

    const result = await fetch(`${API_BASE_URL}/${urlPath}?dir=${dir}`);

    const { project, is_empty_dir: isEmptyDir, defaults, all_project_directories: allProjectDirectories  } = await result.json();

    return { project, isEmptyDir, defaults, allProjectDirectories };
}

async function getInstalledPackages(dir: string): Promise<InstalledPackageProps[]> {
    const urlPath = 'packages/installed';

    const result = await fetch(`${API_BASE_URL}/${urlPath}?dir=${dir}`);

    const { packages } = await result.json();

    return packages;
}

async function searchPackages(q: string, dir: string) {
    const urlPath = 'packages/search';

    const result = await fetch(`${API_BASE_URL}/${urlPath}?q=${q}&dir=${dir}`);

    const { packages } = await result.json();

    return packages;
}

async function installPackage(dir: string, packageName: string, versionToInstall: string, isDev: boolean) {
    const urlPath = 'packages/install';

    const result = await fetch(`${API_BASE_URL}/${urlPath}?dir=${dir}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            package: {
                name: packageName,
                version: versionToInstall,
                is_dev: isDev
            }
        })
    });

    if (result.ok === false) {
        throw result.json();
    }

    return result;
}

async function updatePackage(dir: string, packageName: string, versionToUpdate: string | undefined, isDev: boolean | undefined) {
    const urlPath = 'packages/upgrade';

    const packageDetailsToUpdate: {
        name: string,
        version?: string,
        latest?: boolean,
        isDev?: boolean
    } = {
        name: packageName
    };

    if (versionToUpdate && versionToUpdate.length > 0) {
        packageDetailsToUpdate.version = versionToUpdate;
        packageDetailsToUpdate.latest = !!packageDetailsToUpdate.latest
    }

    if (isDev !== undefined) {
        packageDetailsToUpdate.isDev = isDev;
    }

    const result = await fetch(`${API_BASE_URL}/${urlPath}?dir=${dir}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            package: packageDetailsToUpdate
        })
    });

    if (result.ok === false) {
        throw result.json();
    }

    return result;
}

async function uninstallPackage(dir: string, packageName: string) {
    const urlPath = 'packages/uninstall';

    const result = await fetch(`${API_BASE_URL}/${urlPath}?dir=${dir}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            package: { name: packageName }
        })
    });

    if (result.ok === false) {
        throw result.json();
    }

    return result;
}

async function getSettings(scope: 'global' | 'local'): Promise<SettingsResultProps> {
    const urlPath = 'settings';

    const result = await fetch(`${API_BASE_URL}/${urlPath}?scope=${scope}`);

    const { settings } = await result.json();

    return settings;
}

async function updateSettings(scope: 'global' | 'local', settingsToUpdate: SettingsResultProps) {
    const urlPath = 'settings';

    const result = await fetch(`${API_BASE_URL}/${urlPath}?scope=${scope}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsToUpdate)
    });

    if (result.ok === false) {
        throw result.json();
    }

    return result;
}

async function createNewProject(dir: string, projectDetails: ProjectDetailsProps) {
    const urlPath = 'project/new';

    try {
        const requestPromise = (await fetch(`${API_BASE_URL}/${urlPath}?dir=${dir}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectDetails)
        })).json();
    
        return requestPromise.then((res) => {
            if (res.msg === 'Successfully created the project') {
                return true;
            }
    
            return false;
        });
    } catch (ex) {
        return false;
    }
}

async function updateProject(dir: string, projectDetails: ProjectDetailsProps) {
    const urlPath = 'project';

    try {
        const requestPromise = (await fetch(`${API_BASE_URL}/${urlPath}?dir=${dir}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectDetails)
        })).json();
    
        return requestPromise.then((res) => {
            if (res.msg === 'Successfully updated the project') {
                return true;
            }
    
            return false;
        });
    } catch (ex) {
        return false;
    }
}

const Dataservice = {
    getProjectDetails,
    getInstalledPackages,
    searchPackages,
    installPackage,
    updatePackage,
    uninstallPackage,
    getSettings,
    updateSettings,
    createNewProject,
    updateProject
};

export default Dataservice;
