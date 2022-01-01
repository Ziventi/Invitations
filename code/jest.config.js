/** @type {import('@jest/types').Config.InitialOptions} */
const options = {
  coverageDirectory: '<rootDir>/test/suite/.coverage',
  collectCoverageFrom: [
    '<rootDir>/**/*.ts',
    '!**/projects/**',
    '!**/test/project/**'
  ],
  coverageReporters: ['lcov', 'text', 'text-summary'],
  preset: 'jest-puppeteer',
  testMatch: ['**/*.test.ts'],
  verbose: true,
  watchman: false
};

if (process.env.CIRCLECI) {
  options.maxWorkers = 2;
}

module.exports = options;
