import { Router, Request, Response } from 'express';

import controllers from '../../controllers/index.js';
import constants from '../../constants.js';
import { errorHandler } from '../../utils/errors.js';
import { Package } from '../../types.js';

const router = Router();

const { statusCodes, messages } = constants;
const { packageController } = controllers;

interface DirQuery {
  dir?: string;
  q?: string;
}

interface PackageBody {
  package?: Package;
}

router.get(
  '/search',
  async (req: Request<{}, {}, {}, DirQuery>, res: Response) => {
    try {
      const { q, dir } = req.query;

      const dirPath = dir && dir.length > 0 ? dir : process.cwd();

      if (!q || q.length === 0) {
        return res
          .status(statusCodes.BAD_REQUEST)
          .send({ message: messages.INVALID_PACKAGE_QUERY });
      }

      const packages = await packageController.getRelevantPackages(q, dirPath);

      return res.send({ packages });
    } catch (ex) {
      return errorHandler(ex as Error, res);
    }
  }
);

router.get(
  '/installed',
  async (req: Request<{}, {}, {}, DirQuery>, res: Response) => {
    try {
      const { dir } = req.query;

      const dirPath = dir && dir.length > 0 ? dir : process.cwd();

      const packages = await packageController.getInstalledPackages(dirPath);

      return res.status(statusCodes.SUCCESS).send(packages);
    } catch (er) {
      return errorHandler(er as Error, res);
    }
  }
);

router.post(
  '/install',
  async (req: Request<{}, {}, PackageBody, DirQuery>, res: Response) => {
    try {
      const { body, query } = req;

      const dirPath = query.dir && query.dir.length > 0 ? query.dir : process.cwd();

      if (!body.package) {
        return res
          .status(statusCodes.BAD_REQUEST)
          .send({ message: messages.INVALID_PACKAGE_INFORMATION });
      }

      const response = await packageController.packageOperation(
        req.meta,
        dirPath,
        body.package,
        'install'
      );

      if (response) {
        return res
          .status(statusCodes.CREATED)
          .send({ message: messages.SUCCESSFUL_PACKAGE_INSTALL });
      }
    } catch (er) {
      return errorHandler(er as Error, res);
    }

    return null;
  }
);

router.put(
  '/upgrade',
  async (req: Request<{}, {}, PackageBody, DirQuery>, res: Response) => {
    try {
      const { body, query } = req;

      const dirPath = query.dir && query.dir.length > 0 ? query.dir : process.cwd();

      if (!body.package) {
        return res
          .status(statusCodes.BAD_REQUEST)
          .send({ message: messages.INVALID_PACKAGE_INFORMATION });
      }

      const response = await packageController.packageOperation(
        req.meta,
        dirPath,
        body.package,
        'upgrade'
      );

      if (response) {
        return res
          .status(statusCodes.SUCCESS)
          .send({ message: messages.SUCCESSFUL_PACKAGE_UNINSTALL });
      }
    } catch (ex) {
      return errorHandler(ex as Error, res);
    }
  }
);

router.delete(
  '/uninstall',
  async (req: Request<{}, {}, PackageBody, DirQuery>, res: Response) => {
    try {
      const { body, query } = req;

      const dirPath = query.dir && query.dir.length > 0 ? query.dir : process.cwd();

      if (!body.package) {
        return res
          .status(statusCodes.BAD_REQUEST)
          .send({ message: messages.INVALID_PACKAGE_INFORMATION });
      }

      const response = await packageController.packageOperation(
        req.meta,
        dirPath,
        body.package,
        'uninstall'
      );

      if (response) {
        return res
          .status(statusCodes.DELETED)
          .send({ message: messages.SUCCESSFUL_PACKAGE_UNINSTALL });
      }
    } catch (er) {
      return errorHandler(er as Error, res);
    }

    return null;
  }
);

export default router;
