#!/usr/bin/env node

import express from 'express';

import path from 'path';

import cors from 'cors';

import { fileURLToPath } from 'url';

import { ensureGlobalSettings, getSettings } from './utils/settings.js';

import routes from './routes/index.js';

import loggerInit from './logger.js';

import { cspMiddleware } from './middlewares.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const appServerListen = () => {
  const app = express();
  const port = 8001;

  app.use(cors());
  app.use(express.json());
  
  // API routes
  app.use(routes);

  // Home page route
  if (process.env.NODE_ENV === 'development') {
    app.get('/', (req, res) => res.send('Use /api for apis'));
  } else {
    const publicPath = path.resolve(__dirname, '../', 'public');

    app.use('/', express.static(publicPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    logger.info(`Visit http://localhost:${port} to manage your node project`);
  });
};

const start = async () => {
  ensureGlobalSettings();
  const globalSettings = await getSettings('global');
  loggerInit(globalSettings.preferences.log_level);
  appServerListen();
};

start();
