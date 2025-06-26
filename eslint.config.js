import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-types': 'off',
      'no-empty': 'off',
      'no-explicit-any': 'off',
      'no-undef': 'off',
      'object-curly-spacing': 'off',
      'prefer-promise-reject-errors': 'off',
      'arrow-parens': ['warn', 'always'],
      'prefer-arrow-callback': 'warn',
      'no-async-promise-executor': 'off',
    },
  },
  {
    files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-types': 'off',
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      '*.config.js',
      '*.config.ts',
      'coverage/',
      'docs/',
      'notes/',
      'postman/',
      '.yarn/',
      '.pnp.*',
      '**/.yarn/',
    ],
  },
];
