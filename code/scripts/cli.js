const runner = require('./lib/runner');
const Validator = require('./lib/validator');

const [, , projectName, ...args] = process.argv;
Validator.ensureProjectSpecified(projectName);

const PROJECT_DIR = Validator.getProjectPath(projectName);
Validator.ensureProjectExists(PROJECT_DIR);
Validator.ensureEntryPointExists(PROJECT_DIR);

const { run } = runner(PROJECT_DIR);

run('node', ['./.dist/main.js', ...args]);
