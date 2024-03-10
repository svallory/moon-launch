/* eslint-disable sort-keys */
import * as path from 'node:path';
import { defineCommand, runMain } from 'citty';
import { packageJson } from 'parent-package-json-ts';
import { showBanner } from './banner.js';
import * as steps from './steps.js';

const pkg = packageJson()!;

const main = defineCommand({
	meta: {
		name: 'moon-launch',
		version: pkg.version,
		description: pkg.description,
	},
	args: {
		dest: {
			type: 'positional',
			description: 'The destination folder for the new project',
			required: true,
		},
		name: {
			type: 'string',
			description: 'The name of the project',
			default: '',
		},
		packageManager: {
			type: 'string',
			description: 'The package manager to be used',
			alias: 'pm',
			default: 'npm',
		},
	},

	run({ args }) {
		steps.checkDependencies();

		const destination = args.dest || process.cwd();
		const projectName = args.name || path.basename(destination);
		const { packageManager } = args;

		showBanner();
		console.log(`Creating project: ${projectName} at ${destination} using ${packageManager}`);

		steps.createProjectFolder(destination);
		steps.initializePackage(destination, packageManager);
		steps.installSelf(destination, packageManager);
		steps.initializeProject(destination);
		steps.runMoonGenerateMonorepo(destination);

		console.log(`Project ${projectName} has been successfully created at ${destination}`);
	},
});

// eslint-disable-next-line unicorn/prefer-top-level-await, promise/prefer-await-to-callbacks
runMain(main).catch((error: unknown) => {
	console.error(error);
});
