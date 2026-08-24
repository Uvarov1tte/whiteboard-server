//  @ts-check

import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig({
  extends: [js.configs.recommended, tseslint.configs.recommended],
  plugins: {
    '@stylistic': stylistic,
  },
  files: ['src/**/*.ts'],
  rules: {
    '@stylistic/indent': ['error', 2],
    '@stylistic/quotes': ['error', 'single'],
    'import/no-cycle': 'off',
    'import/order': 'off',
    'sort-imports': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/require-await': 'off',
    'pnpm/json-enforce-catalog': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  ignores: ['eslint.config.js', 'prettier.config.js', 'node-modules/', 'dist/'],
})
