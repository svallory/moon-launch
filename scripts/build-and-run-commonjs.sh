tsc -p ./.tshy/commonjs.json --module commonjs --moduleResolution node10
mv -f .tshy-build/commonjs/package-info-cjs.cjs .tshy-build/commonjs/package-info.js
rm -rf sandbox/test-cjs
node .tshy-build/commonjs/bin.js sandbox/test-cjs
