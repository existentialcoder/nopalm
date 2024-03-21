module.exports = {
  statusCodes: {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SUCCESS: 200,
    CREATED: 201,
    DELETED: 204,
    INTERNAL_ERROR: 500,
  },
  messages: {
    INVALID_PROJECT: 'Invalid project. Please check if the current directory is a node project and has a package.json',
    INVALID_PACKAGE_QUERY: 'Invalid/missing query string for package search',
    INVALID_PACKAGE_INFORMATION: 'Invalid package information',
    INVALID_REQUEST_BODY: 'Invalid request. Please check the request body',
    SOMETHING_WRONG: 'Something went wrong',
    SUCCESSFUL_PACKAGE_INSTALL: 'Package is succesfully installed',
    SUCCESSFUL_PACKAGE_UNINSTALL: 'Package is succesfully uninstalled',
  },
  files: {
    PACKAGE_JSON: 'package.json',
    PACKAGE_LOCK_JSON: 'package-lock.json',
    YARN_LOCK: 'yarn.lock',
  },
  packageManagers: [
    {
      name: 'npm',
      file: 'PACKAGE_LOCK_JSON',
    },
    {
      name: 'yarn',
      file: 'YARN_LOCK',
    },
  ],
};
