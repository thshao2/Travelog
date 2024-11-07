// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  plugins: ["unused-imports"],
  rules: {
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "no-unused-vars": "off", // Turn off the base rule as it can report incorrect errors
    "@typescript-eslint/no-unused-vars": "off", // Turn off the TypeScript rule as it can report incorrect errors
    "unused-imports/no-unused-imports": "error", // Enable the rule to remove unused imports
    "unused-imports/no-unused-vars": ["error", { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }],
    // "no-console": "warn",
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