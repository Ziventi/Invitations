const fs = require('fs');
const path = require('path');

const logger = require('./logger');

/**
 * Ensures that the entry point of the project exists.
 * @param {string} projectPath The path to the project.
 */
exports.ensureEntryPointExists = (projectPath) => {
  const entryPoint = path.resolve(projectPath, './.dist/main.js');
  if (!fs.existsSync(entryPoint)) {
    const projectName = path.basename(projectPath);
    logger.error(
      `Entry point for project '${projectName}' does not exist. Try rebuilding the project.`
    );
    process.exit(0);
  }
};

/**
 * Returns the absolute path of a specified project.
 * @param {string} projectName The name of the project.
 * @returns The absolute path of the project.
 */
exports.getProjectPath = (projectName) => {
  const cwd = process.cwd();
  switch (projectName) {
    case 'test':
      return path.join(cwd, 'test', 'project');
    case 'server':
    case 'utils':
      return path.join(cwd, projectName);
    default:
      return path.join(cwd, 'projects', projectName);
  }
};

/**
 * Ensures that a project has been specified.
 * @param {string} project The project name.
 */
exports.ensureProjectSpecified = (project) => {
  if (!project) {
    logger.error('No project specified.');
    process.exit(0);
  }
};

/**
 * Ensures that a specified project exists.
 * @param {string} project The project name.
 */
exports.ensureProjectExists = (project) => {
  if (!fs.existsSync(project)) {
    logger.error(`Project '${path.basename(project)}' does not exist.`);
    process.exit(0);
  }
};
