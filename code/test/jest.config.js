/** @type {import('@jest/types').Config.InitialOptions} */
const options = {
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/**/*.ts',
    '!<rootDir>/bespoke/**',
    '!<rootDir>/projects/**',
    '!<rootDir>/server/**',
    '!<rootDir>/site/**',
    '!<rootDir>/test/project/controller/main.ts',
    '!<rootDir>/utils/src/*.ts',
    '!<rootDir>/utils/src/lib/cli.ts',
  ],
  coverageDirectory: '<rootDir>/test/suite/.coverage',
  coverageReporters: ['lcov', 'text', 'text-summary'],
  preset: 'jest-puppeteer',
  rootDir: '..',
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  slowTestThreshold: 8,
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  verbose: true,
  watchman: false,
};

if (process.env.CIRCLECI) {
  options.maxWorkers = 2;
}

module.exports = options;
