const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const logger = require('./common/logger');

const PROJECTS_DIR = path.join(process.cwd(), 'projects');

logger.info('Cleaning caches...');

spawnSync('rm', ['-rf', '.dist', '.out'], {
  cwd: path.join(process.cwd(), '.cache')
});

logger.info('Cleaning output directories...');

fs.readdirSync(PROJECTS_DIR)
  .map((name) => path.join(PROJECTS_DIR, name))
  .forEach((directory) => {
    spawnSync('rm', ['-rf', '.dist', '.out'], {
      cwd: directory
    });
  });

logger.info('Finished.');
