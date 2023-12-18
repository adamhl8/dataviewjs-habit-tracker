#!/bin/sh

bun build ./src/index.ts --outfile=dataviewjs.js
bun format

sed -i '1i // dataviewjs-habit-tracker | https://github.com/adamhl8/dataviewjs-habit-tracker\n// Looking to make modifications? See the TypeScript source here: https://github.com/adamhl8/dataviewjs-habit-tracker/blob/main/src/index.ts\n' dataviewjs.js
