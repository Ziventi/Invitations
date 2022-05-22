const zavidConfig = require('@zzavidd/eslint-config');

/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: '@zzavidd/eslint-config/react-ts',
  root: true,
  ignorePatterns: ['**/next-env.d.ts', '**/dist/**', '**/bespoke/v1/**'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['**/tsconfig.json'],
  },
  rules: {
    'import/order': [
      1,
      {
        ...zavidConfig.rules['import/order'][1],
        pathGroupsExcludedImportTypes: [],
        pathGroups: [
          {
            pattern: '@ziventi/utils',
            group: 'external',
          },
        ],
      },
    ],
  },
};
