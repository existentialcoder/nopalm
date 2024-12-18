const { getPackageManagers } = require('./utils/common-utils');

const { getSettings } = require('./utils/settings');

async function setMeta(req, res, next) {
    const globalSettings = await getSettings('global');

    const packageManagersLocal = await getPackageManagers(process.cwd(), 'local');

    const packageManagerToSet = packageManagersLocal.length === 0 || packageManagersLocal.length === 2
        ? globalSettings.preferences.package_manager :  packageManagersLocal[0]

    const settingsToSetInMeta = {
        package_manager: packageManagerToSet
    };
    
    const meta = {
        settings: settingsToSetInMeta
    };

    req.meta = meta;

    return next();
}

module.exports=  {
    setMeta
};
