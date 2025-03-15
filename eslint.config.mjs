import pluginJs from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      /** 컴포넌트의 display-name 이 누락되었는지 체크하는 rule */
      'react/display-name': 'warn',

      /** 사용하지 않는 모듈 import 를 체크하는 rule  */
      'import/no-unresolved': 'error',

      /** import 구문이 코드 상단에 위치하는지 체크하는 rule */
      'import/first': 'error',

      /** import 구문 후 빈 줄이 하나 존재하는지 체크하는 rule */
      'import/newline-after-import': ['error', { count: 1 }],

      /** 사용하지 않는 변수에 대한 처리 rule */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_$',
          caughtErrorsIgnorePattern: '^_$',
        },
      ],

      /** type import 과정에서 `type` 을 명시적으로 붙여주는 rule */
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: false,
        },
      ],

      /** object, array literals 의 마지막 요소에 comma 를 붙여주는 rule */
      'comma-dangle': ['error', 'always-multiline'],

      /** 개행 rule */
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        { blankLine: 'any', prev: 'case', next: 'case' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
        { blankLine: 'any', prev: 'expression', next: 'expression' },
        { blankLine: 'any', prev: 'export', next: 'export' },
        { blankLine: 'any', prev: '*', next: 'break' },
      ],

      /** import 구문 정렬을 위한 rule */
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            /** P0: Side Effects (ex: import 'some-package') */
            ['^\\u0000.*'],
            /* P1: External - core libraries (react) */
            ['^(?=react)'],
            /** P2: External - libraries (ex: @tanstack/) */
            ['^(?=[@\\w])'],
            /** P3: Internal - relative path */
            ['^(?=\\.)'],
            /** P4: Internal - image assets */
            [
              '\\.png$',
              '\\.webp$',
              '\\.jpg$',
              '\\.jpeg$',
              '\\.svg$',
              '\\.lottie$',
              '\\.mp4$',
              '\\.wav$',
            ],
          ],
        },
      ],

      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: true,
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },
];
