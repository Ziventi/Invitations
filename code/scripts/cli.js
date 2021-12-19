const { spawn } = require('child_process');
const path = require('path');

const logger = require('./logger');

const [, , projectName, ...args] = process.argv;

if (!projectName) {
  logger.fatal('No project specified.');
  process.exit(0);
}

const PROJECT_DIR = path.join(process.cwd(), 'projects', projectName);

logger.info('Running CLI command...');
const proc = spawn('node', ['./.dist/main.js', ...args], { cwd: PROJECT_DIR });
proc.stdout.pipe(process.stdout);
proc.stderr.pipe(process.stderr);

proc.on('close', () => {
  logger.info('Finished.');
});
