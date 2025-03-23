import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'plugin:@typescript-eslint/strict',
      'plugin:@typescript-eslint/stylistic',
      'plugin:eslint-comments/recommended',
      'prettier',
    ],
    plugins: ['simple-import-sort'],
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'no-console': 'warn',
      'no-alert': 'error',
      'eslint-comments/no-unused-disable': 'error',
    },
  }),
];

export default eslintConfig;
