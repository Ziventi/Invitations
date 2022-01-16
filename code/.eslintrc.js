/**
 * @type {import('eslint').ESLint.Options}
 */
module.exports = {
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
