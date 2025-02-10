const appearanceModes = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

const accentColors = {
  red: 'red',
  volcano: 'volcano',
  orange: 'orange',
  gold: 'gold',
  yellow: 'yellow',
  lime: 'lime',
  green: 'green',
  cyan: 'cyan',
  blue: 'blue',
  purple: 'purple',
  magenta: 'magenta',
  geekblue: 'geekblue'
};

const packageManagers = [
  {
    name: 'npm',
    file: 'PACKAGE_LOCK_JSON',
  },
  {
    name: 'yarn',
    file: 'YARN_LOCK',
  },
];

const logLevels = {
  INFO: 'info',
  DEBUG: 'debug',
  ERROR: 'error',
  WARN: 'warn'
};


export default {
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
    INVALID_SCOPE_QUERY_PARAM: 'Invalid / missing query param - scope',
    SOMETHING_WRONG: 'Something went wrong',
    SUCCESSFUL_PACKAGE_INSTALL: 'Package is succesfully installed',
    SUCCESSFUL_PACKAGE_UNINSTALL: 'Package is succesfully uninstalled',
  },
  files: {
    PACKAGE_JSON: 'package.json',
    PACKAGE_LOCK_JSON: 'package-lock.json',
    YARN_LOCK: 'yarn.lock',
  },
  accentColors,
  appearanceModes,
  packageManagers,
  logLevels,
  defaultSettings: {
    appearance: {
      mode: appearanceModes.SYSTEM,
      accent_color: accentColors.geekblue
    },
    preferences: {
      package_manager: packageManagers.find(({ name }) => name === 'npm').name,
      log_level: logLevels.INFO
    }
  },
  nopalmFileEntryNames: [
    '.nopalm',
    'log'
  ]
};
