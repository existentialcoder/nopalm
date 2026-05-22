import Utils from './common-utils.js';

async function isGitInstalled(): Promise<boolean> {
    try {
        await Utils.executeCommand('git version');
        return true;
    } catch {
        return false;
    }
}

async function getGlobalUserEmail(): Promise<string> {
    const command = 'git config --global user.email';
    try {
        const result = await Utils.executeCommand(command);
        return result;
    } catch {
        return '';
    }
}

async function getGitRemoteRepoHttpsUrl(): Promise<string> {
    const command = 'git config --get remote.origin.url';
    try {
        const result = await Utils.executeCommand(command);
        const [remoteUrlHost, remoteUrlRepoPath] = result.split('@')[1].split(':');
        return `https://${remoteUrlHost}/${remoteUrlRepoPath.split('.')[0]}`;
    } catch {
        return '';
    }
}

export {
    isGitInstalled,
    getGlobalUserEmail,
    getGitRemoteRepoHttpsUrl,
};
