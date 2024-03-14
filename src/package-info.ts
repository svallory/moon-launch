/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPackageJson } from 'ts-orc/tasks';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const filename = __filename || fileURLToPath(import.meta.url);

export const PACKAGE_ROOT = path.resolve(path.basename(filename), '..');

// const info = readJSONSync(
	// 	path.join(PACKAGE_ROOT, 'package.json'),
	// 	) as typeof import('../package.json');
	
const pkg = readPackageJson()
export const { name: PACKAGE_NAME, version: PACKAGE_VERSION } = pkg;