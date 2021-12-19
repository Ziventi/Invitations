const logger = require('./logger');

/**
 * Ensures that a project has been specified.
 * @param {string} project The name of the project.
 */
function ensureProjectSpecified(project) {
  if (!project) {
    logger.fatal('No project specified.');
    process.exit(0);
  }
}

module.exports = { ensureProjectSpecified };
