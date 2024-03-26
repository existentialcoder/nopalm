const { getSettings } = require('./utils/settings');

async function setMeta(req, res, next) {
    const localSettings = await getSettings('local');

    const globalSettings = await getSettings('global');

    const settingsToSetInMeta = {
        package_manager: localSettings.preferences.package_manager || globalSettings.preferences.package_manager
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
