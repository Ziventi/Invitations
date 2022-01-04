const logger = require('./lib/logger');
const runner = require('./lib/runner');
const Validator = require('./lib/validator');

const [, , ...projectNames] = process.argv;

Validator.ensureProjectSpecified(projectNames[0]);

(async () => {
  const promises = projectNames.map((projectName) => {
    const PROJECT_DIR = Validator.getProjectPath(projectName);
    Validator.ensureProjectExists(PROJECT_DIR);
    const { run, runSilent } = runner(PROJECT_DIR);

    logger.info(`Building project '${projectName}'...`);
    runSilent('rm', ['-rf', '.dist']);

    return Promise.resolve()
      .then(() => run('tsc', ['--build']))
      .then(() => {
        logger.info(`Finished building '${projectName}'.`);
      });
  });

  await Promise.all(promises);
})();
