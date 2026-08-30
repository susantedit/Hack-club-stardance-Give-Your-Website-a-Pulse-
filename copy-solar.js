import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'solar');
const destDir = path.join(__dirname, 'public', 'solar');

fs.mkdirSync(destDir, { recursive: true });

fs.cpSync(srcDir, destDir, {
    recursive: true,
    filter: (src) => !src.includes('.git')
});

console.log('Successfully synchronized solar folder to public/solar!');
