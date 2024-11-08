// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  plugins: ["unused-imports"],
  rules: {
    // Enforce the use of double quotes for strings
    "quotes": ["error", "double"],

    // Require semicolons at the end of statements
    "semi": ["error", "always"],

    // Turn off the base rule as it can report incorrect errors
    "no-unused-vars": "off",

    // Disable unresolved path errors
    "import/no-unresolved": "off",

    // Turn off the TypeScript rule as it can report incorrect errors
    "@typescript-eslint/no-unused-vars": "off",

    // Enable the rule to remove unused imports
    "unused-imports/no-unused-imports": "error",

    // Enable the rule to remove unused variables, with exceptions for variables and arguments starting with an underscore
    "unused-imports/no-unused-vars": ["error", { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }],

    // Warn when console statements are used
    // "no-console": "warn",

    // Enforce the use of strict equality (===) and inequality (!==)
    "eqeqeq": ["error", "always"],

    // Require curly braces for all control statements
    "curly": ["error", "all"],

    // Enforce one true brace style (1TBS) for brace placement
    "brace-style": ["error", "1tbs"],

    // Require trailing commas in multiline objects and arrays
    "comma-dangle": ["error", "always-multiline"],

    // Enforce 2-space indentation
    "indent": ["error", 2],

    // Disallow multiple empty lines, with a maximum of one empty line
    "no-multiple-empty-lines": ["error", { "max": 1 }],

    // Disallow space before function parentheses
    // "space-before-function-paren": ["error", "never"],

    // Enforce consistent spacing before and after keywords
    "keyword-spacing": ["error", { "before": true, "after": true }],

    // Require spacing around infix operators
    "space-infix-ops": "error",

    // Disallow spaces inside parentheses
    "space-in-parens": ["error", "never"],

    // Disallow spaces inside array brackets
    "array-bracket-spacing": ["error", "never"],

    // Require spaces inside curly braces
    "object-curly-spacing": ["error", "always"],

    // Enforce consistent spacing between keys and values in object literals
    "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
  },
};