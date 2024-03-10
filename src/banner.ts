import fs from 'node:fs';
import path from 'node:path';
import * as ascii from './ascii/index.js';
import { PACKAGE_ROOT } from './package-info.js';

interface WidthItem {
	width: number;
}
interface HeightItem {
	height: number;
}

interface DimensionItem extends WidthItem, HeightItem {}

const terminalWidth: number = process.stdout.columns;
const terminalHeight: number = process.stdout.rows;

const stripAnsi = (string: string): string => {
	// eslint-disable-next-line no-control-regex
	const ansiEscapeCodes = /[\u001B\u009B][#();?[\]]*(?:\d{1,4}(?:;\d{0,4})*)?[\d<=>A-ORZcf-nqry]/g;
	return string.replace(ansiEscapeCodes, '');
};
const selectShortest = <T extends HeightItem>(
	items: T[],
	maxHeight: number = Number.POSITIVE_INFINITY,
): T | undefined =>
	items
		.filter((item) => item.height <= maxHeight)
		.sort((a, b) => a.height - b.height)
		.at(0);

const selectLargest = <T extends WidthItem>(
	items: T[],
	maxWidth: number = terminalWidth,
): T | undefined =>
	items
		.filter((item) => item.width <= maxWidth)
		.sort((a, b) => b.width - a.width)
		.at(0);

const selectBiggest = <T extends DimensionItem>(
	items: T[],
	maxWidth: number = terminalWidth,
	maxHeight: number = terminalHeight,
): T | undefined =>
	items
		.filter((item) => item.width <= maxWidth && item.height <= maxHeight)
		.sort((a, b) => b.width * b.height - a.width * a.height)
		.at(0) ?? selectShortest<T>(items, maxHeight);

const center = (text: string[] | string, containerWidth: number = terminalWidth) => {
	const lines: string[] = typeof text === 'string' ? [text] : text;

	return lines.map((line) => {
		const cleanLine: string = stripAnsi(line);
		const leftPadding: number = Math.max(Math.floor((containerWidth - cleanLine.length) / 2), 0);
		return ' '.repeat(leftPadding) + line;
	});
};

export function showBanner() {
	const banner = selectBiggest(ascii.banners);
	const MIN_ALLOWED_BANNER_WIDTH = 50;
	const title = banner
		? selectLargest<(typeof ascii.titles)[0]>(
				ascii.titles,
				Math.max((banner.height / 3) * 2, MIN_ALLOWED_BANNER_WIDTH),
			)
		: undefined;

	if (banner && title) {
		const bannerLines: string = fs.readFileSync(path.join(PACKAGE_ROOT, banner.path), {
			encoding: 'utf8',
		});

		const lines: string[] = [...bannerLines.split('\n'), ...title.text];
		center(lines, banner.width).forEach((line) => void console.log(line));
	}

	// Debugging
	// if (!banner || !title) {
	//     console.log({
	//         ascii,
	//         banner,
	//         terminalHeight,
	//         terminalWidth,
	//         title,
	//     });
	// }
}
