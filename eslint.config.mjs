import babelParser from '@babel/eslint-parser'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
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
