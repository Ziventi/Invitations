/**
 * @type {import('eslint').ESLint.Options}
 */
module.exports = {
  extends: '@zzavidd/eslint-config',
  root: true,
  ignorePatterns: [
    '**/.dist/**',
    '**/.out/**',
    '**/dist/**',
    '**/next-env.d.ts',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['**/tsconfig.json']
  }
};
