const chokidar = require('chokidar');

const path = require('path');

const logger = require('./lib/logger');
const { run } = require('./lib/runner')('.');

const ROOT = path.resolve(__dirname, '..');

const [, , ...projectNames] = process.argv;

/** @type {import('child_process').ChildProcessWithoutNullStreams} */
let child = null;
const projectsRebuilding = new Set();
const processesInterrupted = new Set();

// If projects are specified, only watch files under them.
const watchedProjects = projectNames.length
  ? projectNames.flatMap((projectName) => {
      return [
        `**/${projectName}/**/*.ts`,
        `**/${projectName}/**/tsconfig.json`
      ];
    })
  : ['**/*.ts', '*/**/tsconfig.json'];

chokidar
  .watch(watchedProjects, {
    cwd: ROOT,
    ignored: ['**/node_modules/**', '**/server/**', '**/test/**'],
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

  child = await run('node', ['./scripts/build.js', name]);
  if (processesInterrupted.has(name)) {
    processesInterrupted.delete(name);
  } else {
    logger.info('Watching for TS file changes...');
  }

  projectsRebuilding.delete(name);
}
