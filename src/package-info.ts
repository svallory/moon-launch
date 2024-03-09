import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJSONSync } from 'fs-extra';

export function getFilePath(meta: ImportMeta) {
	return meta.filename || fileURLToPath(meta.url);
}

export function getFileDirName(meta: ImportMeta) {
	return meta.dirname || path.dirname(fileURLToPath(meta.url));
}

const info = readJSONSync(
	path.join(getFileDirName(import.meta), '..', 'package.json'),
) as typeof import('../package.json');

export const { name: PACKAGE_NAME, version: PACKAGE_VERSION } = info;

export const PACKAGE_ROOT = path.resolve(getFileDirName(import.meta), '..');
