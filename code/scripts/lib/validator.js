const fs = require('fs');
const path = require('path');

const logger = require('./logger');

/**
 * Ensures that a project has been specified.
 * @param {string} project The project name.
 */
exports.ensureProjectSpecified = (project) => {
  if (!project) {
    logger.fatal('No project specified.');
    process.exit(0);
  }
};

/**
 * Ensures that a specified project exists.
 * @param {string} project The project name.
 */
exports.ensureProjectExists = (project) => {
  if (!fs.existsSync(project)) {
    logger.fatal(`Project '${path.basename(project)}' does not exist.`);
    process.exit(0);
  }
};
