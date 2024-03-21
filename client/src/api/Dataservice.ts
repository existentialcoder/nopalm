// Testing
const API_BASE_URL = 'http://localhost:8001/api';

// Actual
// const API_BASE_URL = '/api'

import { InstalledPackageProps, ProjectDetailsProps } from '../helpers/types';

async function getProjectDetails(): Promise<ProjectDetailsProps> {
    const urlPath = 'project';

    const result = await fetch(`${API_BASE_URL}/${urlPath}`);

    const { project } = await result.json();

    return project;
}

async function getInstalledPackages(): Promise<InstalledPackageProps[]> {
    const urlPath = 'packages/installed';

    const result = await fetch(`${API_BASE_URL}/${urlPath}`);

    const { packages } = await result.json();

    return packages;
}

async function searchPackages(q: string) {
    const urlPath = 'packages/search';

    const result = await fetch(`${API_BASE_URL}/${urlPath}?q=${q}`);

    const { packages } = await result.json();

    return packages;
}

async function installPackage(packageName: string, versionToInstall: string, isDev: boolean) {
    const urlPath = 'packages/install';

    const result = await fetch(`${API_BASE_URL}/${urlPath}`, {
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

    return result;
}

async function updatePackage(packageName: string, versionToUpdate: string | undefined, isDev: boolean | undefined) {
    const urlPath = 'packages/upgrade';

    const packageDetailsToUpdate: {
        name: string,
        version?: string,
        latest?: boolean,
        isDev?: boolean
    } = {
        name: packageName
    };

    if (versionToUpdate.length > 0) {
        packageDetailsToUpdate.version = versionToUpdate;
        packageDetailsToUpdate.latest = !!packageDetailsToUpdate.latest
    }

    if (isDev !== undefined) {
        packageDetailsToUpdate.isDev = isDev;
    }

    const result = await fetch(`${API_BASE_URL}/${urlPath}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            package: packageDetailsToUpdate
        })
    });

    return result;
}

async function uninstallPackage(packageName: string) {
    const urlPath = 'packages/uninstall';

    const result = await fetch(`${API_BASE_URL}/${urlPath}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            package: { name: packageName }
        })
    });

    return result;
}

const Dataservice = {
    getProjectDetails,
    getInstalledPackages,
    searchPackages,
    installPackage,
    updatePackage,
    uninstallPackage
};

export default Dataservice;
