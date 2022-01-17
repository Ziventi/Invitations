const zavidConfig = require('@zzavidd/eslint-config');

/**
 * @type {import('eslint').ESLint.Options}
 */
const eslintConfig = {
  extends: '@zzavidd/eslint-config/node-ts',
  root: true,
  ignorePatterns: ['**/.dist/**', '**/.out/**', '**/next-env.d.ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['**/tsconfig.json'],
  },
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    'import/order': [
      1,
      {
        ...zavidConfig.rules['import/order'][1],
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

module.exports = eslintConfig;
