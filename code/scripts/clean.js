const fs = require('fs');
const path = require('path');

const logger = require('./lib/logger');
const runner = require('./lib/runner');

const PROJECTS_DIR = path.join(process.cwd(), 'projects');

const clean = (cwd) => {
  runner(cwd).runSilent('rm', ['-rf', '.cache.json', '.dist', '.out']);
};

logger.info('Cleaning project directories...');
fs.readdirSync(PROJECTS_DIR).forEach((directory) => {
  const cwd = path.join(PROJECTS_DIR, directory);
  if (fs.lstatSync(cwd).isDirectory()) {
    clean(cwd);
  }
});

logger.info('Cleaning test project...');
const cwd = path.join(process.cwd(), 'test/project');
clean(cwd);

logger.info('Finished.');
