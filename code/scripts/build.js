const { spawn, spawnSync } = require('child_process');
const path = require('path');

const logger = require('./logger');

const projectName = process.argv[2];
const PROJECT_DIR =
  projectName === 'utils'
    ? path.join(process.cwd(), projectName)
    : path.join(process.cwd(), 'projects', projectName);

logger.info(`Building project '${projectName}'...`);

spawnSync('rm', ['-rf', '.dist'], { cwd: PROJECT_DIR });
const proc = spawn('tsc', ['--outDir', path.join(PROJECT_DIR, './.dist')], {
  cwd: PROJECT_DIR
});
proc.stdout.pipe(process.stdout);
proc.stderr.pipe(process.stderr);

proc.on('close', () => {
  logger.info('Finished build.');
});
