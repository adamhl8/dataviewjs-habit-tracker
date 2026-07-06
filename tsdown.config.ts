import { tsdownBinConfig } from "@adamhl8/configs"
import { defineConfig } from "tsdown"

const banner = `// dataviewjs-habit-tracker | https://github.com/adamhl8/dataviewjs-habit-tracker
// Looking to make modifications? See the TypeScript source here: https://github.com/adamhl8/dataviewjs-habit-tracker/blob/main/src/index.ts"
`

const config = tsdownBinConfig({
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
  inputOptions: {
    experimental: {
      attachDebugInfo: "none", // remove region comments in output
    },
  },
  publint: false,
})

export default defineConfig(config)
