import { type ExecSyncOptionsWithBufferEncoding, execSync } from 'node:child_process';
import * as fs from 'node:fs';
import path from 'node:path';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import { PACKAGE_NAME } from './package-info.js';

function runCommand(command: string, options: ExecSyncOptionsWithBufferEncoding) {
	console.log(`▶︎▶︎ ${command}`);
	execSync(command, options)
}

export function checkDependencies() {
	const isInstalled = (cmd: string) => {
		try {
			runCommand(`command -v ${cmd}`, { stdio: 'ignore' });
			return true;
		} catch {
			return false;
		}
	};

	if (!isInstalled('proto')) {
		console.log('`proto` is not installed. It is required to proceed.');
		const installProto = 'curl -fsSL https://moonrepo.dev/install/proto.sh | $SHELL';
		runCommand(installProto, { stdio: 'inherit' });
	}

	if (!isInstalled('moon')) {
		console.log('`moon` is not installed. Installing it using `proto`...');
		const protoPath = `${process.env.HOME}/.proto/bin/proto`;
		runCommand(
			`${protoPath} plugin add moon "source:https://raw.githubusercontent.com/moonrepo/moon/master/proto-plugin.toml"`,
			{ stdio: 'inherit' },
		);
		runCommand(`${protoPath} install moon`, { stdio: 'inherit' });
	}
}

export function createProjectFolder(destination: string) {
	if (!fs.existsSync(destination)) {
		fs.mkdirSync(destination, { recursive: true });
	}
}

export function initializePackage(destination: string, packageManager: string) {
	runCommand(`${packageManager} init -y`, { cwd: destination, stdio: 'inherit' });
}

export function installSelf(destination: string, packageManager: string) {
	runCommand(`${packageManager} add -D ${PACKAGE_NAME}`, { cwd: destination, stdio: 'inherit' });
}

export function initializeProject(destination: string) {
	
	// minimal config so we can run templates
	const workspaceYml = `generator: { templates: ['./node_modules/${PACKAGE_NAME}/templates'] }`;
	
	const moonDir = path.join(destination, '.moon');	
	
	ensureDirSync(moonDir);
	writeFileSync(path.join(destination, '.moon', 'workspace.yml'), workspaceYml);
}

export function runMoonGenerateMonorepo(destination: string) {
	runCommand(`cd ${destination} && moon generate monorepo`, { stdio: 'inherit' });
}
