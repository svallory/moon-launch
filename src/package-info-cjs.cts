import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJSONSync } from 'fs-extra';

// @ts-ignore
const filename = __filename || fileURLToPath(__filename);

export const PACKAGE_ROOT = path.resolve(path.basename(filename), '..');

const info = readJSONSync(
	path.join(PACKAGE_ROOT, 'package.json'),
	) as typeof import('../package.json');
	
	export const { name: PACKAGE_NAME, version: PACKAGE_VERSION } = info;