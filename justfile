import "node_modules/@adamhl8/configs/dist/configs/justfile.base.just"

build: _build
    bun oxfmt dataviewjs.js
