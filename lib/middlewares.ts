import { Request, Response, NextFunction } from 'express';

import Utils from './utils/common-utils.js';

import { getSettings } from './utils/settings.js';

const { getPackageManagers } = Utils;

async function setMeta(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const globalSettings = await getSettings('global');

    const packageManagersLocal = await getPackageManagers(process.cwd(), 'local');

    const packageManagerToSet = packageManagersLocal.length === 0 || packageManagersLocal.length === 2
        ? globalSettings.preferences.package_manager : packageManagersLocal[0];

    req.meta = {
        settings: { package_manager: packageManagerToSet }
    };

    return next();
}

function cspMiddleware(_req: Request, res: Response, next: NextFunction): void {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src * data:; "
    );

    return next();
}

export {
    setMeta,
    cspMiddleware,
};
