const js = require('@eslint/js');

module.exports = [
  {
    ignores: ['dist/**', 'out-tsc/**', 'release/**', 'node_modules/**', 'src/**', '.angular/**']
  },
  js.configs.recommended,
  {
    files: ['electron/**/*.js', '*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        Buffer: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        fetch: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
];
