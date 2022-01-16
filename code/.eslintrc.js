const zavidConfig = require('@zzavidd/eslint-config');

/**
 * @type {import('eslint').ESLint.Options}
 */
const eslintConfig = {
  extends: '@zzavidd/eslint-config',
  root: true,
  ignorePatterns: ['**/.dist/**', '**/.out/**', '**/next-env.d.ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['**/tsconfig.json']
  },
  rules: {
    '@typescript-eslint/no-namespace': 'off'
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  }
};

eslintConfig.rules = {
  ...eslintConfig.rules,
  'import/order': [
    1,
    {
      groups: [
        'type',
        'external',
        'builtin',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'always',
      pathGroups: [
        {
          pattern: '@ziventi/utils',
          group: 'external'
        },
        {
          pattern: 'dotenv',
          group: 'external'
        }
      ],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }
  ]
};

module.exports = eslintConfig;
