// https://www.npmjs.com/package/eslint-config-moon
module.exports = {
	root: true,
	extends: [
		'moon',
		'moon/node'
	],
	rules: {
		"no-console": "off"
	},
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
  },
};
