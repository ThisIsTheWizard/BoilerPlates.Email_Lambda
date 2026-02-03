import babelParser from '@babel/eslint-parser'
import prettierPlugin from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: 8,
      globals: {
        ...globals.node,
        ...globals.mocha,
        es6: true
      },
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        sourceType: 'module'
      }
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      'arrow-body-style': ['error', 'as-needed'],
      'no-undef': 'error',
      'no-underscore-dangle': 'off',
      'no-unneeded-ternary': 'off',
      'no-unused-vars': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', { const: 'never' }],
      'prettier/prettier': ['error'],
      'prefer-const': 'error'
    }
  },
  {
    files: ['.eslintrc.{js,cjs}'],
    languageOptions: {
      parserOptions: {
        sourceType: 'script'
      }
    }
  }
]
