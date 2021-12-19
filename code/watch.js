/* eslint-disable @typescript-eslint/no-var-requires */
const chokidar = require('chokidar');
const log4js = require('log4js');

const { spawn } = require('child_process');
const path = require('path');

const logger = log4js.getLogger();
logger.level = 'info';

let rebuildInProgress = false;

chokidar
  .watch(['**/*.ts', '*/**/tsconfig.json'], {
    cwd: '.',
    ignored: '**/node_modules/**',
    persistent: true,
    awaitWriteFinish: false
  })
  .on('ready', () => {
    logger.info('Watching for TS file changes...');
  })
  .on('change', async (path) => {
    if (!rebuildInProgress) {
      await rebuildProject(path);
      rebuildInProgress = false;
    }
  });

/**
 * Runs a build on the project of a changed file.
 * @param {string} filePath The path of the changed file.
 */
async function rebuildProject(filePath) {
  rebuildInProgress = true;
  const [superDir, project] = filePath.split('/');

  const cwd = superDir === 'projects' ? path.join(superDir, project) : superDir;

  await new Promise((resolve) => {
    logger.info(`Rebuilding project '${cwd}'...'`);
    const child = spawn('npm', ['run', 'build'], {
      cwd: path.join(__dirname, cwd)
    });

    child.stdout.pipe(process.stdout);

    child.on('exit', (err) => {
      if (!err) {
        logger.info(`Rebuilt '${cwd}'.'`);
      }
      resolve();
    });
  });
}
