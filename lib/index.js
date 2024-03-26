const express = require('express');

const cors = require('cors');

const { ensureGlobalSettings, ensureLocalSettings, getSettings } = require('./utils/settings');

const appServerListen = () => {
  const routes = require('./routes');

  const app = express();

  const port = 8001;

  app.use(cors());
  app.use(express.json());

  // Home page route
  if (process.env.NODE_ENV === 'development') {
    app.get('/', (req, res) => res.send('Use /api for apis'));
  } else {
    app.use('/', express.static('public'));
  }

  // Other routes
  app.use(routes);

  app.listen(port, () => {
    logger.info(`Visit http://localhost:${port} to manage your node project`);
  });
};

const start = async () => {
  ensureGlobalSettings();
  ensureLocalSettings();

  const globalSettings = await getSettings('global');

  const loggerInit = require('./logger');

  loggerInit(globalSettings.preferences.log_level);
  appServerListen();
};

start();
