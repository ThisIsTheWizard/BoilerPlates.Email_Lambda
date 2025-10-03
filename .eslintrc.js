module.exports = {
  ignores: ['**/build/**', '**/node_modules/**', '**/.aws-sam/**'],
  parser: '@babel/eslint-parser',
  extends: ['prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 8,
    requireConfigFile: false
  },
  env: {
    node: true,
    mocha: true,
    es6: true
  },
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    'no-undef': 'error',
    'no-underscore-dangle': 'off',
    'no-unneeded-ternary': 'off',
    'no-unused-vars': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', { const: 'never' }],
    'prettier/prettier': ['error'],
    'prefer-const': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'never']
  }
}
