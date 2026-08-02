import js from '@eslint/js'
import ts from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,
  {
    // Override base ESLint rules that don't work with TypeScript
    rules: {
      // TypeScript handles undefined variable checking
      'no-undef': 'off',
      // Disable rules that conflict with TypeScript or are too strict
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-empty': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      'no-useless-escape': 'off',
      'no-regex-spaces': 'off',
      'no-constant-binary-expression': 'off',
      'no-control-regex': 'off',
      'prefer-const': 'off',
      'no-irregular-whitespace': 'off',
      // No `any` — warn only
      '@typescript-eslint/no-explicit-any': 'warn',
      // No unused variables — warn only
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // No non-null assertions — warn only
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // Consistent type imports — disabled
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'src/ui/app/', '*.js', '*.mjs'],
  }
)
