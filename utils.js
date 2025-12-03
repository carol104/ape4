import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function readJSON(relPath) {
	const p = path.resolve(__dirname, relPath);
	const content = fs.readFileSync(p, 'utf8');
	return JSON.parse(content);
}

export function writeJSON(relPath, data) {
	const p = path.resolve(__dirname, relPath);
	fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}