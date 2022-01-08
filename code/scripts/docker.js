const path = require('path');

const logger = require('./lib/logger');
const runner = require('./lib/runner');

const PROJECT_ROOT = '../..';
const { run, runSilent } = runner(PROJECT_ROOT);

const DOCKERFILE = path.resolve(PROJECT_ROOT, 'docker/Dockerfile');
const CONTAINER_NAME = 'ziventi-server';
const IMAGE_NAME = 'ziventi';
const PORT = 3000;

(async () => {
  try {
    const startTime = Date.now();
    logger.info(`Building '${IMAGE_NAME}' image...`);
    await run('docker', ['build', '-f', DOCKERFILE, '-t', IMAGE_NAME, '.']);

    logger.info(`Checking for existing container...`);
    const existingContainer = runSilent('docker', [
      'ps',
      '-aq',
      '-f',
      `name=${CONTAINER_NAME}`
    ]);

    if (existingContainer) {
      logger.warn(`Existing container found.`);
      logger.info(`Stopping ${CONTAINER_NAME} container...`);
      runSilent('docker', ['stop', CONTAINER_NAME]);
      logger.info(`Deleting ${CONTAINER_NAME} container...`);
      runSilent('docker', ['rm', CONTAINER_NAME]);
    } else {
      logger.info(`No existing container found.`);
    }

    logger.info(`Re-running container...`);
    runSilent('docker', [
      'run',
      '--detach',
      '--name',
      CONTAINER_NAME,
      '--publish',
      `${PORT}:${PORT}`,
      '--restart',
      'unless-stopped',
      IMAGE_NAME
    ]);
    const endTime = Date.now();
    const difference = (endTime - startTime) / 1000;
    logger.info(`Finished in ${difference.toFixed(2)}s.`);
  } catch (e) {
    logger.fatal(e);
  }
})();
