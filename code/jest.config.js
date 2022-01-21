/** @type {import('@jest/types').Config.InitialOptions} */
const options = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/**/*.ts',
    '!<rootDir>/projects/**',
    '!<rootDir>/server/**',
    '!<rootDir>/test/project/controller/main.ts',
    '!<rootDir>/utils/src/*.ts',
    '!<rootDir>/utils/src/lib/cli.ts'
  ],
  coverageDirectory: '<rootDir>/test/suite/.coverage',
  coverageReporters: ['lcov', 'text', 'text-summary'],
  moduleNameMapper: {
    '@ziventi/utils': '<rootDir>/utils/src/index.ts',
    '@ziventi/utils/src/production': '<rootDir>/utils/src/production.ts'
  },
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  slowTestThreshold: 8,
  testMatch: ['**/*.test.ts'],
  verbose: true,
  watchman: false
};

if (process.env.CIRCLECI) {
  options.maxWorkers = 2;
}

module.exports = options;
