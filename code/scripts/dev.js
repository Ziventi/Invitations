const { spawn } = require('child_process');
const path = require('path');

const logger = require('./logger');

const [, , projectName, ...args] = process.argv;

if (!projectName) {
  logger.fatal('No project specified.');
  process.exit(0);
}

const PROJECT_DIR = path.join(process.cwd(), 'projects', projectName);
logger.debug(PROJECT_DIR);

logger.info('Running live dev...');

const proc = spawn(
  'nodemon',
  [
    '--watch',
    'views',
    '--ext',
    'ejs,scss,json,svg',
    '.dist/main.js',
    '--',
    'generate',
    ...args
  ],
  { cwd: PROJECT_DIR }
);
proc.stdout.pipe(process.stdout);
proc.stderr.pipe(process.stderr);
