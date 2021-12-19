const chokidar = require('chokidar');

const { spawn } = require('child_process');
const path = require('path');

const logger = require('./logger');

const ROOT = path.resolve(__dirname, '..');

/** @type {import('child_process').ChildProcessWithoutNullStreams} */
let child = null;
let rebuildInProgress = false;
let processInterrupted = false;

chokidar
  .watch(['**/*.ts', '*/**/tsconfig.json'], {
    cwd: ROOT,
    ignored: '**/node_modules/**',
    persistent: true,
    awaitWriteFinish: false
  })
  .on('ready', () => {
    logger.info('Watching for TS file changes...');
  })
  .on('change', async (path) => {
    if (rebuildInProgress) {
      processInterrupted = true;
      child.kill('SIGINT');
    }
    await rebuildProject(path);
    rebuildInProgress = false;
  });

/**
 * Runs a build on the project of a changed file.
 * @param {string} filePath The path of the changed file.
 */
async function rebuildProject(filePath) {
  rebuildInProgress = true;
  const [superDir, project] = filePath.split('/');

  const isProject = superDir === 'projects';
  const cwd = isProject ? path.join(superDir, project) : superDir;
  const name = isProject ? project : superDir;

  await new Promise((resolve) => {
    logger.info(`Rebuilding project '${name}'...`);
    child = spawn('npm', ['run', 'build'], {
      cwd: path.join(ROOT, cwd)
    });

    child.stdout.pipe(process.stdout);

    child.on('exit', (err) => {
      if (processInterrupted) {
        processInterrupted = false;
      } else {
        if (!err) {
          logger.info('Finished rebuilding.');
        }
        logger.info('Watching for TS file changes...');
      }
      resolve();
    });
  });
}
