const chokidar = require('chokidar');

const path = require('path');

const logger = require('./lib/logger');
const { run } = require('./lib/runner')('.');

const ROOT = path.resolve(__dirname, '..');

/** @type {import('child_process').ChildProcessWithoutNullStreams} */
let child = null;
const projectsRebuilding = new Set();
const processesInterrupted = new Set();

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
  .on('change', rebuildProject);

/**
 * Runs a build on the project of a changed file.
 * @param {string} filePath The path of the changed file.
 */
async function rebuildProject(filePath) {
  const [baseDirectory, projectName] = filePath.split('/');
  const isProject = baseDirectory === 'projects';
  const name = isProject ? projectName : baseDirectory;

  // Kill a build if already running and rerun.
  if (projectsRebuilding.has(name)) {
    processesInterrupted.add(name);
    child.kill('SIGINT');
  } else {
    projectsRebuilding.add(name);
  }

  await new Promise((resolve) => {
    logger.info(`Rebuilding project '${name}'...`);
    child = run('node', ['./scripts/build.js', name]);
    child.on('exit', (err) => {
      if (processesInterrupted.has(name)) {
        processesInterrupted.delete(name);
      } else {
        if (!err) {
          logger.info('Finished rebuilding.');
        }
        logger.info('Watching for TS file changes...');
      }
      resolve();
    });
  });

  projectsRebuilding.delete(name);
}
