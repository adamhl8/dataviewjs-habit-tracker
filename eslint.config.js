import { ESLintConfigBuilder } from "eslint-config-builder"
import tseslint from "typescript-eslint"

const eslintConfig = new ESLintConfigBuilder().jsonYamlToml().testing().build()

export default tseslint.config({ ignores: ["dataviewjs.js"] }, eslintConfig, {
  rules: {
    "@typescript-eslint/only-throw-error": "off",
    "@typescript-eslint/no-unsafe-type-assertion": "off",
  },
})
