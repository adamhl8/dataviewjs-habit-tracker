module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: "latest",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "unicorn", "sonarjs"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:unicorn/recommended",
    "plugin:sonarjs/recommended",
    "prettier",
  ],
  ignorePatterns: [".eslintrc.cjs", "prettier.config.js", "dataviewjs.js"],
  rules: {
    "@typescript-eslint/no-throw-literal": "off",
    "unicorn/prevent-abbreviations": "off",
  },
}
