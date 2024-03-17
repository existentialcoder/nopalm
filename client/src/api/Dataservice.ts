// Testing
const API_BASE_URL = 'http://localhost:8001/api';

// Actual
// const API_BASE_URL = '/api'

import { InstalledPackageProps } from '../helpers/types';

async function getProjectDetails(): Promise<Object> {
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

async function installPackage(packageName: string, versionToInstall: string) {
    const urlPath = 'packages/installed';

    const result = await fetch(`${API_BASE_URL}/${urlPath}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            package: {
                name: packageName,
                version: versionToInstall
            }
        })
    });

    return result;
}

async function upgradePackage(packageName: string, versionToUpdate: string) {
    const urlPath = 'packages/upgrade';

    const result = await fetch(`${API_BASE_URL}/${urlPath}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            package: {
                name: packageName,
                version: versionToUpdate,
                latest: true  
            }
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
    installPackage,
    upgradePackage,
    uninstallPackage
};

export default Dataservice;
