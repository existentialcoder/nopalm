import Utils from './utils/common-utils.js';

import { getSettings } from './utils/settings.js';

const { getPackageManagers } = Utils;

async function setMeta(req, res, next) {
    const globalSettings = await getSettings('global');

    const packageManagersLocal = await getPackageManagers(process.cwd(), 'local');

    const packageManagerToSet = packageManagersLocal.length === 0 || packageManagersLocal.length === 2
        ? globalSettings.preferences.package_manager : packageManagersLocal[0]

    const settingsToSetInMeta = {
        package_manager: packageManagerToSet
    };

    const meta = {
        settings: settingsToSetInMeta
    };

    req.meta = meta;

    return next();
}


function cspMiddleware(req, res, next) {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +  // Allow Google Fonts CSS
        "font-src 'self' https://fonts.gstatic.com; " +  // Allow fonts from Google Fonts
        "img-src * data:; "
    );

    return next();
}

export {
    setMeta,
    cspMiddleware
};
