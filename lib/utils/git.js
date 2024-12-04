const Utils = require("./common-utils");

async function isGitInstalled() {
    try {
        await Utils.executeCommand('git version');

        return true;
    } catch (ex) {
        return false;
    }
}

async function getGlobalUserEmail() {
    const command = 'git config --global user.email';

    try {
        const result = await Utils.executeCommand(command);

        return result;
    } catch (ex) {
        return '';
    }
}

async function getGitRemoteRepoHttpsUrl() {
    // @ts-ignore
    const command = `git config --get remote.origin.url`;

    try {
        const result = await Utils.executeCommand(command);

        const [ remoteUrlHost, remoteUrlRepoPath ] = result.split('@')[1].split(':');

        return `https://${remoteUrlHost}/${remoteUrlRepoPath.split('.')[0]}`;
    } catch (ex) {
        return '';
    }
}

module.exports = {
    isGitInstalled,
    getGlobalUserEmail,
    getGitRemoteRepoHttpsUrl
};
