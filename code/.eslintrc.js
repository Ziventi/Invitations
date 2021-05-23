module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  env: {
    node: true,
    es6: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['import'],
  root: true,
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '.'],
        extensions: ['.js'],
      },
    },
    'import/ignore': ['.json', '.scss', '.ejs'],
  },
  rules: {
    'import/named': 0,
    'import/namespace': 0,
    'import/no-unresolved': ['error'],
    'import/order': [
      1,
      {
        groups: ['external', 'builtin', 'internal', 'sibling'],
        pathGroupsExcludedImportTypes: ['internal'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 1,
      },
    ],
    'no-unreachable': 'warn',
    'no-unused-vars': 'off',
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    semi: ['error', 'always'],
    'spaced-comment': [
      'warn',
      'always',
      {
        exceptions: ['*'],
      },
    ],
    'no-case-declarations': 'off',
    'no-useless-escape': 'off',
    quotes: 'off',
  },
};
