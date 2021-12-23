const fs = require('fs');
const path = require('path');

const logger = require('./lib/logger');
const runner = require('./lib/runner');

const PROJECTS_DIR = path.join(process.cwd(), 'projects');

logger.info('Cleaning caches...');
runner('.').runSilent('rm', ['-rf', '.cache']);

logger.info('Cleaning output directories...');
fs.readdirSync(PROJECTS_DIR).forEach((directory) => {
  const cwd = path.join(PROJECTS_DIR, directory);
  runner(cwd).runSilent('rm', ['-rf', '.dist', '.out']);
});

logger.info('Finished.');
