import { execSync } from "node:child_process"
import fs from "node:fs/promises"
import { tsdownConfig } from "@adamhl8/configs"
import { defineConfig } from "tsdown"

const banner = `// dataviewjs-habit-tracker | https://github.com/adamhl8/dataviewjs-habit-tracker
// Looking to make modifications? See the TypeScript source here: https://github.com/adamhl8/dataviewjs-habit-tracker/blob/main/src/index.ts"
`

const config = tsdownConfig({
  platform: "browser",
  outDir: "./",
  outputOptions: {
    entryFileNames: "dataviewjs.js",
  },
  // banner doesn't work for some reason?
  // banner: {
  //   js: banner,
  // },
  hooks: {
    "build:done": async () => {
      const src = await fs.readFile("./dataviewjs.js", "utf8")
      await fs.writeFile("./dataviewjs.js", `${banner}\n${src}`)
      execSync("biome format --write")
    },
  },
  clean: false,
  unbundle: false,
  sourcemap: false,
  dts: false,
  attw: false,
  publint: false,
} as const)

export default defineConfig(config)
