
const fs = require('node:fs').promises;
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

// Function to strip ANSI escape codes
const stripAnsi = (string) => {
	const ansiEscapeCodes =
		/[\u001B\u009B][#();?[\]]*(?:\d{1,4}(?:;\d{0,4})*)?[\d<=>A-ORZcf-nqry]/g;
	return string.replace(ansiEscapeCodes, '');
};

// Async function to analyze files in a directory
const analyzeFilesInDirectory = async (directoryPath, outputPath) => {
	try {
		const files = await fs.readdir(directoryPath);
		const filesData = [];

		for (const file of files) {
			const filePath = path.join(directoryPath, file);
			const fileStats = await fs.stat(filePath);

			// Skip directories
			if (fileStats.isDirectory()) {
				continue;
			}

			const fileContent = await fs.readFile(filePath, 'utf8');
			const lines = fileContent.toString().split(/\n/);

			const lineLengths = lines.map((line) => stripAnsi(line).length);
			const maxLineWidth = Math.max(...lineLengths);

			filesData.push({
				height: lines.length,
				width: maxLineWidth,
				path: path.relative(ROOT, path.join(directoryPath, file)),
			});
		}

		// Writing the output file
		await fs.writeFile(outputPath, JSON.stringify({ banners: filesData }, null, 2));
		console.log(`Analysis complete. Data written to ${outputPath}`);
	} catch (error) {
		console.error('An error occurred:', error);
	}
};

// Please update the directoryPath and outputPath as necessary
const directoryPath = path.join(ROOT, 'banners'); // Example: change to the directory you wish to analyze
const outputPath = path.join(ROOT, 'src/ascii/banners.json'); // The output JSON file

analyzeFilesInDirectory(directoryPath, outputPath);
