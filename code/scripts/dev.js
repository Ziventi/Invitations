#!/usr/bin/env node
const logger = require('./lib/logger');
const runner = require('./lib/runner');
const Validator = require('./lib/validator');

const [, , projectName, ...args] = process.argv;
Validator.ensureProjectSpecified(projectName);

const PROJECT_DIR = Validator.getProjectPath(projectName);
Validator.ensureProjectExists(PROJECT_DIR);

const { run } = runner(PROJECT_DIR);

logger.info('Running live dev...');

(async () => {
  await run('nodemon', [
    '--watch',
    'views',
    '--ext',
    'ejs,scss,json,svg',
    '.dist/main.js',
    '--',
    'generate',
    ...args
  ]);
})();
