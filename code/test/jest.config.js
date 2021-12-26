const { Paths } = require('@ziventi/utils');

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  coverageDirectory: './test/.coverage',
  collectCoverage: true,
  collectCoverageFrom: ['**/utils/**/*.ts'],
  rootDir: Paths.PROJECT_ROOT,
  watchman: false
};
