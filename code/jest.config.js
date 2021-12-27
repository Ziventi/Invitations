/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  coverageDirectory: '<rootDir>/test/suite/.coverage',
  collectCoverageFrom: [
    '<rootDir>/**/*.ts',
    '!**/projects/**',
    '!**/test/project/**'
  ],
  coverageReporters: ['lcov', 'text', 'text-summary'],
  preset: 'jest-puppeteer',
  testTimeout: 10 * 1000,
  watchman: false
};
