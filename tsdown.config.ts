import { tsdownBundleConfig } from "@adamhl8/configs"
import { $ } from "bun"
import { defineConfig } from "tsdown"

const banner = `// dataviewjs-habit-tracker | https://github.com/adamhl8/dataviewjs-habit-tracker
// Looking to make modifications? See the TypeScript source here: https://github.com/adamhl8/dataviewjs-habit-tracker/blob/main/src/index.ts
`

const config = tsdownBundleConfig({
  entry: "./src/index.ts",
  platform: "browser",
  outDir: "./",
  clean: false,
  outputOptions: {
    entryFileNames: "dataviewjs.js",
  },
  banner: {
    js: banner,
  },
  hooks: {
    "build:done": async () => {
      await $`bun oxfmt dataviewjs.js`
    },
  },
})

export default defineConfig(config)
