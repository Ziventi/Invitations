/**
 * @type {import('eslint').ESLint.Options}
 */
module.exports = {
  extends: '@zzavidd/eslint-config',
  root: true,
  ignorePatterns: [
    '.eslintrc.js',
    '**/.dist/**',
    '**/.out/**',
    '**/dist/**',
    '**/next-env.d.ts',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['**/tsconfig.eslint.json', '**/tsconfig.json']
  },
  settings: {
    react: 'latest'
  },
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-var-requires': 'off'
  }
};
