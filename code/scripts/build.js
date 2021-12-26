const path = require('path');

const logger = require('./lib/logger');
const runner = require('./lib/runner');
const Validator = require('./lib/validator');

const projectName = process.argv[2];
Validator.ensureProjectSpecified(projectName);

const PROJECT_DIR = Validator.getProjectPath(projectName);
Validator.ensureProjectExists(PROJECT_DIR);

const { run, runSilent } = runner(PROJECT_DIR);

logger.info(`Building project '${projectName}'...`);
runSilent('rm', ['-rf', '.dist']);
run('tsc', ['--outDir', path.join(PROJECT_DIR, './.dist')], () => {
  logger.info('Finished build.');
});
