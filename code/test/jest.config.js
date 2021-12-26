const { Paths } = require('@ziventi/utils');

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  coverageDirectory: './.coverage',
  // collectCoverage: true,
  collectCoverageFrom: ['../utils/**/*.ts'],
  preset: 'jest-puppeteer',
  watchman: false
};
