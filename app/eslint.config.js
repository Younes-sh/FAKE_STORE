import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  eslint.configs.recommended,
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // قوانین دلخواه
    },
  },
];