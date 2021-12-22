const path = require('path');

const logger = require('./lib/logger');
const runner = require('./lib/runner');
const Validator = require('./lib/validator');

const [, , projectName, ...args] = process.argv;
Validator.ensureProjectSpecified(projectName);

const PROJECT_DIR = path.join(process.cwd(), 'projects', projectName);
Validator.ensureProjectExists(PROJECT_DIR);

const { run } = runner(PROJECT_DIR);

logger.info('Running CLI command...');
run('node', ['./.dist/main.js', ...args], () => {
  logger.info('Finished.');
});
