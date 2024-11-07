// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  rules: {
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "no-unused-vars": "warn",
    "no-console": "warn",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "brace-style": ["error", "1tbs"],
    "comma-dangle": ["error", "always-multiline"],
    "indent": ["error", 2],
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "space-before-function-paren": ["error", "never"],
    "keyword-spacing": ["error", { "before": true, "after": true }],
    "space-infix-ops": "error",
    "space-in-parens": ["error", "never"],
    "array-bracket-spacing": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
  },
};