const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const logger = require('./lib/logger');

const PROJECTS_DIR = path.join(process.cwd(), 'projects');

logger.info('Cleaning caches...');
spawnSync('rm', ['-rf', '.cache']);

logger.info('Cleaning output directories...');
fs.readdirSync(PROJECTS_DIR).forEach((directory) => {
  const cwd = path.join(PROJECTS_DIR, directory);
  spawnSync('rm', ['-rf', '.dist', '.out'], { cwd });
});

logger.info('Finished.');
