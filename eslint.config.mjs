// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  // Ignore files
  {
    ignores: ['dist/**', 'node_modules/**', 'src/**/*.spec.ts']
  },

  // Base ESLint rules
  eslint.configs.recommended,

  // TypeScript recommended (Flat config)
  ...tseslint.configs.recommendedTypeChecked,

  // Prettier config
  prettierRecommended,

  // Language + TS Setup
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },

  // Google-based + custom rules (VALID for Flat Config)
  {
    rules: {
      // Google-style spacing rules using correct flat-config format
      // commented the following rules because conflict with prettier config
      // indent: [2, 2],
      // quotes: [2, 'single'],
      // 'no-trailing-spaces': 2,
      // 'keyword-spacing': 2,
      // 'space-before-blocks': 2,
      // 'space-before-function-paren': [2, 'never'],
      // 'object-curly-spacing': [2, 'always'],
      // 'comma-dangle': [2, 'never'],
      'max-len': [2, { code: 120 }],

      // Disable legacy JSdoc rules (Google)
      'require-jsdoc': 0,
      'valid-jsdoc': 0,

      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-floating-promises': 1,
      '@typescript-eslint/no-unsafe-argument': 1,

      // Prettier
      'prettier/prettier': [2, { endOfLine: 'auto' }]
    }
  }
);
