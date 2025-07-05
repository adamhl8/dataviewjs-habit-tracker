#!/bin/sh

tsc
cp ./dist/index.js ./dataviewjs.js
rm -rf ./dist/

sed -i '1i // dataviewjs-habit-tracker | https://github.com/adamhl8/dataviewjs-habit-tracker\n// Looking to make modifications? See the TypeScript source here: https://github.com/adamhl8/dataviewjs-habit-tracker/blob/main/src/index.ts\n' dataviewjs.js
sed -i -E '/\/\/ biome-ignore/d' dataviewjs.js
sed -i '/export {}/d' dataviewjs.js

biome format --write
