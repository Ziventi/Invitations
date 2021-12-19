const path = require('path');

const logger = require('./lib/logger');
const runner = require('./lib/runner');
const { ensureProjectSpecified } = require('./lib/validator');

const projectName = process.argv[2];
ensureProjectSpecified(projectName);

const PROJECT_DIR =
  projectName === 'utils'
    ? path.join(process.cwd(), projectName)
    : path.join(process.cwd(), 'projects', projectName);

const { run, runSync } = runner(PROJECT_DIR);

logger.info(`Building project '${projectName}'...`);
runSync('rm', ['-rf', '.dist']);
run('tsc', ['--outDir', path.join(PROJECT_DIR, './.dist')], () => {
  logger.info('Finished build.');
});
