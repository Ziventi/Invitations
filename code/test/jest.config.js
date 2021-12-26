const { Paths } = require('@ziventi/utils');

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  coverageDirectory: '<rootDir>/test/suite/.coverage',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  projects: ['<rootDir>/utils', '<rootDir>/test'],
  rootDir: Paths.PROJECT_ROOT,
  preset: '<rootDir>/test/node_modules/jest-puppeteer',
  // preset: 'jest-puppeteer',
  watchman: false
};
