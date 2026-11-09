module.exports = {
  root: true,
  env: { browser: true, node: true },
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  parserOptions: { parser: 'babel-eslint' },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off'
  }
};
